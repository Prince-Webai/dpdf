'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, Code, Download } from "lucide-react"
import Script from 'next/script'

export default function ExtractToolPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const extractTextLocally = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        if (!window.pdfjsLib) throw new Error("PDF library not loaded yet. Please wait a moment.");
        // @ts-ignore
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // @ts-ignore
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
        }
        return fullText;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleExtract = async () => {
        if (!file) return
        setIsProcessing(true)
        setResult(null)

        try {
            let documentText = "";

            // Attempt to use PDF.co Proxy first (the platform standard)
            try {
                // STEP 1: Get Pre-signed URL from PDF.co via our Proxy
                const presignedReq = await fetch('/api/v1/file/upload/get-presigned-url?name=' + encodeURIComponent(file.name), {
                    headers: { 'Authorization': 'Bearer dn_test_sandbox' }
                });

                if (!presignedReq.ok) {
                    const errData = await presignedReq.json().catch(() => ({}));
                    const errorMsg = errData.error || errData.message || "";

                    // If the master key is missing, we fall back to local extraction automatically
                    if (presignedReq.status === 500 && (errorMsg.includes("Missing upstream") || errorMsg.includes("PDFCO_MASTER_API_KEY"))) {
                        console.log("PDF.co not configured. Falling back to local AI extraction...");
                        documentText = await extractTextLocally(file);
                    } else {
                        throw new Error(errorMsg || "Failed to get upload URL (Status " + presignedReq.status + ")");
                    }
                } else {
                    const presignedData = await presignedReq.json();

                    // STEP 2: Upload the actual file directly to the provided PDF.co AWS S3 bucket
                    const uploadReq = await fetch(presignedData.presignedUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/pdf' },
                        body: file
                    });

                    if (!uploadReq.ok) throw new Error("Failed to upload document");

                    // STEP 3: Extract RAW TEXT from the PDF using PDF.co
                    const textReq = await fetch('/api/v1/pdf/convert/to/text', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer dn_test_sandbox',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            url: presignedData.url,
                            inline: true,
                            async: false
                        })
                    });

                    if (!textReq.ok) {
                        const errData = await textReq.json().catch(() => ({}));
                        throw new Error(errData.error || errData.message || "Failed to extract document text (Status " + textReq.status + ")");
                    }
                    const textData = await textReq.json();

                    if (textData.error) {
                        throw new Error(textData.message || "Failed to extract text from PDF");
                    }

                    documentText = textData.body;
                }
            } catch (proxyError: any) {
                // If it's just a configuration error, we might have already set documentText or we can try here
                if (!documentText) {
                    console.log("Proxy failed, trying local extraction:", proxyError.message);
                    documentText = await extractTextLocally(file);
                } else {
                    throw proxyError;
                }
            }

            // STEP 4: Send the extracted text to our OpenAI Extractor Prompt Endpoint
            const extractReq = await fetch('/api/ai/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentText })
            });

            if (!extractReq.ok) {
                const errData = await extractReq.json().catch(() => ({}));
                throw new Error(errData.message || "AI extraction network request failed");
            }

            const extractData = await extractReq.json();

            if (extractData.error) {
                throw new Error(extractData.message || "AI extraction failed");
            }

            setResult(JSON.stringify(extractData, null, 2));

        } catch (error: any) {
            console.error("Extraction Error:", error);
            setResult(JSON.stringify({
                error: true,
                message: error.message || "An unexpected error occurred during extraction."
            }, null, 2));
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!result) return
        const blob = new Blob([result], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `extracted_${file?.name.replace('.pdf', '') || 'data'}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">AI Invoice Parser Sandbox</h1>
                <p className="text-gray-400">Test the PDF extraction API directly from your dashboard.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="space-y-6">
                    <Card className="bg-[#0a0a0a] border-white/10 overflow-hidden">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Input Document</h3>
                        </div>
                        <CardContent className="p-6">
                            {!file ? (
                                <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <Upload className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-300 font-medium mb-1">Click to upload or drag and drop</p>
                                    <p className="text-gray-500 text-sm">PDF documents up to 10MB</p>
                                </div>
                            ) : (
                                <div className="border border-indigo-500/30 bg-indigo-500/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                                        <FileText className="h-8 w-8 text-indigo-400" />
                                    </div>
                                    <h4 className="font-medium text-white mb-1 truncate max-w-full">{file.name}</h4>
                                    <p className="text-xs text-gray-400 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB PDF Document</p>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={() => { setFile(null); setResult(null); }}>
                                            Remove
                                        </Button>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleExtract} disabled={isProcessing}>
                                            {isProcessing ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                            ) : (
                                                'Extract Data'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
                                <p><strong>Note:</strong> This sandbox leverages your Development API key automatically. Requests made here do not count towards your production quota.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Output Panel */}
                <div>
                    <Card className="bg-[#0a0a0a] border-white/10 h-full flex flex-col overflow-hidden">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                            <h3 className="font-semibold text-sm flex items-center gap-2"><Code className="h-4 w-4 text-emerald-400" /> JSON Response</h3>
                            {result && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-gray-400 hover:text-white"
                                    onClick={handleDownload}
                                >
                                    <Download className="h-3 w-3 mr-2" /> Download
                                </Button>
                            )}
                        </div>
                        <CardContent className="p-0 flex-1 relative bg-[#050505] min-h-[400px]">
                            {!result && !isProcessing && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                                    <Code className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Upload a document and extract data to see the JSON output.</p>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 font-mono text-sm">
                                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                    <p>Analyzing document structure...</p>
                                    <p className="text-gray-500 mt-2">Running AI extraction models</p>
                                </div>
                            )}

                            {result && (
                                <div className="p-6 overflow-auto h-full max-h-[600px]">
                                    <pre className="text-sm font-mono text-gray-300">
                                        <code dangerouslySetInnerHTML={{
                                            __html: result
                                                .replace(/"([^"]+)":/g, '<span class="text-indigo-300">"$1"</span>:')
                                                .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
                                                .replace(/: ([0-9.]+)/g, ': <span class="text-orange-400">$1</span>')
                                        }} />
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // @ts-ignore
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                }}
            />
        </div>
    )
}
