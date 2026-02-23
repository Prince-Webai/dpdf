'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, Code, Download } from "lucide-react"

export default function ExtractToolPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<string | null>(null)

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
            // STEP 1: Get Pre-signed URL from PDF.co via our Proxy
            // We use a mock API key 'dn_test_sandbox' to bypass our local middleware check
            const presignedReq = await fetch('/api/v1/file/upload/get-presigned-url?name=' + encodeURIComponent(file.name), {
                headers: { 'Authorization': 'Bearer dn_test_sandbox' }
            });

            if (!presignedReq.ok) throw new Error("Failed to get upload URL");
            const presignedData = await presignedReq.json();

            // STEP 2: Upload the actual file directly to the provided PDF.co AWS S3 bucket
            // This goes directly to the presigned URL, NOT through our proxy
            const uploadReq = await fetch(presignedData.presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/pdf' },
                body: file
            });

            if (!uploadReq.ok) throw new Error("Failed to upload document");

            // STEP 3: Call the Extract API using the uploaded file's URL
            const extractReq = await fetch('/api/v1/pdf/convert/to/json', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer dn_test_sandbox',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: presignedData.url,
                    inline: true,
                    async: false // For sandboxes we want synchronous responses
                })
            });

            if (!extractReq.ok) throw new Error("Failed to extract data");
            const extractData = await extractReq.json();

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
                        </CardContent>
                    </Card>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
                        <p><strong>Note:</strong> This sandbox leverages your Development API key automatically. Requests made here do not count towards your production quota.</p>
                    </div>
                </div>

                {/* Output Panel */}
                <div>
                    <Card className="bg-[#0a0a0a] border-white/10 h-full flex flex-col overflow-hidden">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                            <h3 className="font-semibold text-sm flex items-center gap-2"><Code className="h-4 w-4 text-emerald-400" /> JSON Response</h3>
                            {result && (
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-400 hover:text-white">
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
        </div>
    )
}
