'use client'

import { Card } from "@/components/ui/card"
import { Key, UploadCloud, FileJson, Layers, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
    return (
        <div className="max-w-4xl space-y-20 pb-20">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-24">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                    Welcome to the DocuNexu API. Our REST API allows you to automate document workflows including extraction, manipulation, and layout analysis with enterprise-grade reliability.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 bg-white/[0.02] border-white/10 group hover:border-indigo-500/30 transition-all">
                        <Key className="h-6 w-6 text-indigo-400 mb-4" />
                        <h3 className="text-lg font-bold mb-2">Secure by Default</h3>
                        <p className="text-sm text-gray-400">Stateless processing means your data is erased immediately after the session concludes.</p>
                    </Card>
                    <Card className="p-6 bg-white/[0.02] border-white/10 group hover:border-emerald-500/30 transition-all">
                        <UploadCloud className="h-6 w-6 text-emerald-400 mb-4" />
                        <h3 className="text-lg font-bold mb-2">High Throughput</h3>
                        <p className="text-sm text-gray-400">Process thousands of documents in parallel with our globally distributed node network.</p>
                    </Card>
                </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 text-sm">1</span>
                    Authentication
                </h2>
                <p className="text-gray-400 mb-6">
                    All API requests must include your secret key in the <code className="text-indigo-300">Authorization</code> header as a Bearer token.
                </p>
                <div className="bg-black rounded-xl border border-white/10 p-6 font-mono text-sm overflow-hidden">
                    <div className="flex items-center justify-between text-gray-500 mb-4 border-b border-white/5 pb-2">
                        <span>HTTPS Request</span>
                    </div>
                    <code className="text-indigo-400">Authorization:</code> <code className="text-white">Bearer dn_secret_key_••••••••</code>
                </div>
            </section>

            {/* Upload */}
            <section id="upload" className="scroll-mt-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">File Ingestion</h2>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">v1.2</span>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-gray-400">Initialize a document upload by requesting a pre-signed URL. This allows for direct, secure ingestion into our processing vault.</p>
                        <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg">
                            <span className="text-indigo-400 font-bold">GET</span>
                            <span className="text-white">/v1/file/upload/get-presigned-url</span>
                        </div>
                    </div>

                    <Card className="bg-black border-white/10 overflow-hidden">
                        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-widest">Response Schema</h4>
                            <span className="text-emerald-400 text-xs font-mono">200 OK</span>
                        </div>
                        <pre className="p-6 text-sm font-mono text-blue-300 overflow-x-auto leading-loose">
                            {`{
  "vault_id": "test_document.pdf",
  "upload_url": "https://vault.docunexu.io/...",
  "expires_in": 3600
}`}
                        </pre>
                    </Card>
                </div>
            </section>

            {/* Document Extraction */}
            <section id="pdf-to-json" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Document Parser & Extraction</h2>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">v1.1</span>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-gray-400">Extract structured JSON table data and text arrays from unstructured PDF documents or scanned images.</p>
                        <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg">
                            <span className="text-indigo-400 font-bold">POST</span>
                            <span className="text-white">/v1/pdf/convert/to/json</span>
                        </div>
                    </div>

                    <Card className="bg-black border-white/10 overflow-hidden">
                        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-widest">Request Payload</h4>
                        </div>
                        <pre className="p-6 text-sm font-mono text-blue-300 overflow-x-auto leading-loose">
                            {`{
  "url": "https://your-server.com/invoice.pdf",
  "inline": true,
  "pages": "0,1-3"
}`}
                        </pre>
                    </Card>

                    <Card className="bg-black border-white/10 overflow-hidden">
                        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-widest">Response Schema</h4>
                            <span className="text-emerald-400 text-xs font-mono">200 OK</span>
                        </div>
                        <pre className="p-6 text-sm font-mono text-blue-300 overflow-x-auto leading-loose">
                            {`{
  "status": 200,
  "body": [
    { "text": "Invoice Number: 4501", "rect": [50, 60, 200, 80] }
  ],
  "credits_consumed": 1
}`}
                        </pre>
                    </Card>
                </div>
            </section>

            {/* Merge & Split */}
            <section id="merge-split" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Merge & Split PDFs</h2>
                    <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-widest">v1.0</span>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-gray-400">Combine multiple PDF files from given URLs or split a large document into isolated single-page PDFs.</p>
                        <div className="flex flex-col gap-2 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-indigo-400 font-bold">POST</span>
                                <span className="text-white">/v1/pdf/merge</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <span className="text-indigo-400/50 font-bold">POST</span>
                                <span>/v1/pdf/split</span>
                            </div>
                        </div>
                    </div>

                    <Card className="bg-black border-white/10 overflow-hidden">
                        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-widest">Merge Request Payload</h4>
                        </div>
                        <pre className="p-6 text-sm font-mono text-blue-300 overflow-x-auto leading-loose">
                            {`{
  "urls": [
    "https://your-server.com/part1.pdf",
    "https://your-server.com/part2.pdf"
  ],
  "name": "final-export.pdf"
}`}
                        </pre>
                    </Card>
                </div>

            </section>

            <div className="pt-20 text-center">
                <p className="text-gray-500 text-sm">Need help? <Link href="#" className="text-indigo-400 font-bold hover:underline">Contact System Architecture team</Link></p>
            </div>
        </div>
    )
}
