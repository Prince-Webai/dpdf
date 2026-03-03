'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, Code, Download, Cpu, ShieldAlert } from "lucide-react"
import Script from 'next/script'
import { motion, AnimatePresence } from "framer-motion"

export default function ExtractToolPage() {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const extractTextLocally = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        if (!window.pdfjsLib) throw new Error("SYSTEM_MODULE_NOT_LOADED: PDF_LIBRARY_FAILURE");
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
            try {
                const presignedReq = await fetch('/api/v1/file/upload/get-presigned-url?name=' + encodeURIComponent(file.name), {
                    headers: { 'Authorization': 'Bearer dn_test_sandbox' }
                });
                if (!presignedReq.ok) {
                    const errData = await presignedReq.json().catch(() => ({}));
                    const errorMsg = errData.error || errData.message || "";
                    if (presignedReq.status === 500 && (errorMsg.includes("Missing upstream") || errorMsg.includes("PDFCO_MASTER_API_KEY"))) {
                        documentText = await extractTextLocally(file);
                    } else {
                        throw new Error(errorMsg || "UPLINK_FAILURE");
                    }
                } else {
                    const presignedData = await presignedReq.json();
                    const uploadReq = await fetch(presignedData.presignedUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/pdf' },
                        body: file
                    });
                    if (!uploadReq.ok) throw new Error("BUFFER_UPLOAD_FAILURE");
                    const textReq = await fetch('/api/v1/pdf/convert/to/text', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer dn_test_sandbox', 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: presignedData.url, inline: true, async: false })
                    });
                    if (!textReq.ok) {
                        const errData = await textReq.json().catch(() => ({}));
                        throw new Error(errData.error || errData.message || "CONVERSION_FAILURE");
                    }
                    const textData = await textReq.json();
                    if (textData.error) throw new Error(textData.message || "EXTRACTION_FAILURE");
                    documentText = textData.body;
                }
            } catch (proxyError: any) {
                if (!documentText) {
                    documentText = await extractTextLocally(file);
                } else {
                    throw proxyError;
                }
            }
            const extractReq = await fetch('/api/ai/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentText })
            });
            if (!extractReq.ok) throw new Error("AI_LINK_FAILURE");
            const extractData = await extractReq.json();
            if (extractData.error) throw new Error(extractData.message || "AI_PARSING_FAULT");
            setResult(JSON.stringify(extractData, null, 4));
        } catch (error: any) {
            setResult(JSON.stringify({ error: true, code: "SYSTEM_FAULT", message: error.message }, null, 4));
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
        a.download = `nexus_export_${file?.name.replace('.pdf', '') || 'artifact'}.json`
        document.body.appendChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-16"
        >
            <div className="border-b border-white/[0.05] pb-12">
                <h1 className="text-6xl font-serif text-white mb-4 tracking-tight">Technical Workbench</h1>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">AUTONOMOUS DOCUMENT EXTRACTION PIPELINE 01.A</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/[0.02] gap-px border border-white/[0.05]">
                {/* Input Panel */}
                <div className="bg-executive-black p-12 space-y-12">
                    <div className="flex items-center gap-4 border-b border-white/[0.05] pb-6">
                        <Cpu className="h-4 w-4 text-executive-gold" />
                        <h2 className="font-mono text-[10px] text-white uppercase tracking-widest">ARTIFACT_INTAKE</h2>
                    </div>

                    {!file ? (
                        <div className="border border-white/[0.05] aspect-video flex flex-col items-center justify-center group hover:bg-white/[0.02] transition-colors relative abstract-texture">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                            <div className="space-y-6 text-center">
                                <Upload className="h-8 w-8 text-white/20 mx-auto group-hover:text-executive-gold transition-colors" />
                                <div className="space-y-2">
                                    <p className="font-mono text-[10px] text-white/60 uppercase tracking-widest italic leading-relaxed">
                                        INITIALIZE UPLOAD SEQUENCE<br />
                                        <span className="text-white/20">SUPPORTED_FORMAT: PDF_ENCRYPTED</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-executive-gold/20 bg-executive-gold/[0.02] p-12 flex flex-col items-center text-center space-y-8 animate-in fade-in duration-500">
                            <div className="w-20 h-20 border border-executive-gold/30 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-executive-gold" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-serif text-3xl text-white italic">{file.name}</h4>
                                <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">{(file.size / 1024 / 1024).toFixed(2)} MB ARCHITECTURAL_ARTIFACT</p>
                            </div>

                            <div className="flex gap-4 w-full">
                                <button
                                    className="flex-1 border border-white/[0.05] py-4 font-mono text-[10px] text-white/40 uppercase tracking-widest hover:bg-white/[0.05] transition-all rounded-none"
                                    onClick={() => { setFile(null); setResult(null); }}
                                >
                                    PURGE_BUFFER
                                </button>
                                <button
                                    className="flex-1 border border-executive-gold py-4 font-mono text-[10px] text-executive-gold uppercase tracking-[0.2em] hover:bg-executive-gold hover:text-executive-black transition-all disabled:opacity-20 rounded-none"
                                    onClick={handleExtract}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'PROCESSING...' : 'INITIALIZE_EXTRACTION'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-4 p-6 border border-white/5 bg-white/[0.01]">
                        <ShieldAlert className="h-4 w-4 text-white/20 shrink-0" />
                        <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest leading-loose">
                            SANDBOX MODE ACTIVE. RESOURCE ALLOCATION REDIRECTED TO DEVELOPMENT CHANNELS. PRODUCTION QUOTA UNTOUCHED.
                        </p>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="bg-executive-black p-12 flex flex-col space-y-12">
                    <div className="flex items-center justify-between border-b border-white/[0.05] pb-6">
                        <div className="flex items-center gap-4">
                            <Code className="h-4 w-4 text-executive-gold" />
                            <h2 className="font-mono text-[10px] text-white uppercase tracking-widest">DATA_SCHEMA_OUTPUT</h2>
                        </div>
                        {result && (
                            <button
                                onClick={handleDownload}
                                className="font-mono text-[9px] text-white/40 hover:text-executive-gold transition-colors flex items-center gap-2 uppercase tracking-widest"
                            >
                                <Download className="h-3 w-3" /> EXPORT_ARTIFACT
                            </button>
                        )}
                    </div>

                    <div className="flex-1 min-h-[400px] border border-white/[0.05] bg-zinc-900/[0.02] relative overflow-hidden">
                        {!result && !isProcessing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 space-y-6">
                                <Code className="h-12 w-12 opacity-10" />
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] italic">AWAITING_INPUT_STREAM</p>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-executive-black/50 z-20">
                                <div className="space-y-8 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-executive-gold mx-auto" />
                                    <div className="space-y-2">
                                        <p className="font-mono text-[10px] text-executive-gold uppercase tracking-[0.4em] animate-pulse">PARSING_STRUCTURE</p>
                                        <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest">NEURAL_MAPPING_IN_PROGRESS</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="p-12 overflow-auto max-h-[600px] font-mono text-[11px] leading-relaxed relative z-10">
                                <pre className="text-white/60">
                                    <code dangerouslySetInnerHTML={{
                                        __html: result
                                            .replace(/"([^"]+)":/g, '<span class="text-executive-gold/60">"$1"</span>:')
                                            .replace(/: "([^"]+)"/g, ': <span class="text-white">"$1"</span>')
                                            .replace(/: ([0-9.]+)/g, ': <span class="text-white/40">$1</span>')
                                    }} />
                                </pre>
                            </div>
                        )}
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
        </motion.div>
    )
}
