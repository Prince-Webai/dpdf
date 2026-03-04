'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, Terminal, Download, Shield, Zap } from "lucide-react"
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
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">Neural Extraction Sandbox</h1>
                <p className="text-white/40 text-[13px] font-medium uppercase tracking-widest">Autonomous document analysis engine</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="space-y-6">
                    <div className="space-y-8">
                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="bg-white/[0.02] border-b border-white/5 px-8 py-5 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Source Intelligence</h3>
                            </div>
                            <CardContent className="p-10">
                                {!file ? (
                                    <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-16 text-center hover:bg-white/[0.03] hover:border-blue-500/30 transition-all cursor-pointer relative group/upload">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                        <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover/upload:scale-110 group-hover/upload:bg-blue-500/10 transition-all">
                                            <Upload className="h-8 w-8 text-white/20 group-hover/upload:text-blue-400" />
                                        </div>
                                        <p className="text-white font-bold mb-2 tracking-tight">Ingest Document</p>
                                        <p className="text-white/30 text-xs font-medium">Drag & Drop PDF (Max 10MB)</p>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group/file">
                                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/file:opacity-100 transition-opacity" />
                                        <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 relative">
                                            <FileText className="h-10 w-10 text-blue-400" />
                                            {isProcessing && (
                                                <div className="absolute -inset-2 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                            )}
                                        </div>
                                        <h4 className="text-xl font-black text-white mb-2 truncate max-w-full tracking-tighter">{file.name}</h4>
                                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mb-10">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF STREAM</p>

                                        <div className="flex gap-4 w-full max-w-xs relative">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-white/10 hover:bg-white/5 text-white/40 rounded-2xl py-6 font-bold text-xs"
                                                onClick={() => { setFile(null); setResult(null); }}
                                                disabled={isProcessing}
                                            >
                                                Discard
                                            </Button>
                                            <Button
                                                className="flex-1 bg-white text-black hover:bg-white/90 rounded-2xl py-6 font-bold text-xs shadow-xl active:scale-95 transition-all"
                                                onClick={handleExtract}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                                                ) : (
                                                    'Analyze Data'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-10 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 text-[11px] text-blue-300/60 leading-relaxed font-medium">
                                    <p className="flex gap-3">
                                        <Shield className="h-4 w-4 flex-shrink-0 text-blue-400/40" />
                                        <span>This sandbox utilizes your development environment credentials. High-volume testing is allowed without impacting production throughput.</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Output Panel */}
                <div>
                    <div>
                        <Card className="bg-white/5 backdrop-blur-3xl border-white/10 rounded-[3rem] h-full flex flex-col overflow-hidden shadow-2xl relative">
                            <div className="bg-white/[0.02] border-b border-white/5 px-8 py-5 flex items-center justify-between">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Terminal className="h-4 w-4 text-emerald-400/50" /> Structured Intelligence Output
                                </h3>
                                {result && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 px-4 text-[11px] font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                        onClick={handleDownload}
                                    >
                                        <Download className="h-3.5 w-3.5 mr-2" /> Export
                                    </Button>
                                )}
                            </div>
                            <CardContent className="p-0 flex-1 relative bg-[#050505]/40 min-h-[500px]">
                                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                                {!result && !isProcessing && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                                        <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center mb-6">
                                            <Terminal className="h-10 w-10 opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium tracking-tight">Stream output will manifest here</p>
                                    </div>
                                )}


                                {isProcessing && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="relative w-24 h-24 mb-6">
                                            <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
                                            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Zap className="h-8 w-8 text-blue-400 animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-white tracking-widest uppercase">Executing Neural Pass</p>
                                        <p className="text-[10px] text-white/20 mt-2 font-mono">STAGING AI CORES...</p>
                                    </div>
                                )}

                                {result && (
                                    <div className="p-10 overflow-auto h-full max-h-[700px] scrollbar-thin scrollbar-thumb-white/10 relative z-10">
                                        <pre className="text-[13px] font-mono leading-relaxed">
                                            <code dangerouslySetInnerHTML={{
                                                __html: result
                                                    .replace(/"([^"]+)":/g, '<span class="text-blue-300/80 font-bold">"$1"</span>:')
                                                    .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400/90">"$1"</span>')
                                                    .replace(/: ([0-9.]+)/g, ': <span class="text-amber-400/90 font-black">$1</span>')
                                                    .replace(/: (true|false)/g, ': <span class="text-purple-400 font-bold italic">$1</span>')
                                            }} />
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
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
