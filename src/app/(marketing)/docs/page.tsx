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
            <section id="authentication" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
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

            {/* Base URL */}
            <section id="base-url" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">Base URL & Versioning</h2>
                <p className="text-gray-400 mb-6">All API requests should be made to our global edge endpoint. We use URL versioning to ensure backward compatibility.</p>
                <div className="bg-black/40 border border-white/10 rounded-lg p-6 flex items-center justify-between group hover:border-executive-gold/30 transition-colors">
                    <code className="text-white/80 font-mono text-sm tracking-tight">https://api.docunexu.com/v1</code>
                </div>
            </section>

            {/* Errors */}
            <section id="errors" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">Error Codes</h2>
                <p className="text-gray-400 mb-6">DocuNexus uses standard HTTP response codes to indicate the success or failure of an API request.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-white/5 bg-white/[0.01]">
                        <span className="text-emerald-400 font-mono text-xs font-bold block mb-1">200 OK</span>
                        <p className="text-[10px] text-gray-500">The request was successful.</p>
                    </div>
                    <div className="p-4 border border-white/5 bg-white/[0.01]">
                        <span className="text-amber-400 font-mono text-xs font-bold block mb-1">401 Unauthorized</span>
                        <p className="text-[10px] text-gray-500">Invalid or missing API key.</p>
                    </div>
                    <div className="p-4 border border-white/5 bg-white/[0.01]">
                        <span className="text-blue-400 font-mono text-xs font-bold block mb-1">429 Too Many Requests</span>
                        <p className="text-[10px] text-gray-500">Rate limit exceeded.</p>
                    </div>
                    <div className="p-4 border border-white/5 bg-white/[0.01]">
                        <span className="text-red-400 font-mono text-xs font-bold block mb-1">500 Server Error</span>
                        <p className="text-[10px] text-gray-500">Something went wrong on our end.</p>
                    </div>
                </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">Rate Limits</h2>
                <p className="text-gray-400 mb-6">
                    Limits are applied per API key. Free tier keys are limited to 10 requests per minute. Business tier users enjoy up to 10,000 requests per minute.
                </p>
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-xl">
                    <p className="text-xs text-indigo-300 font-mono">X-RateLimit-Limit: 1000</p>
                    <p className="text-xs text-indigo-300 font-mono">X-RateLimit-Remaining: 999</p>
                    <p className="text-xs text-indigo-300 font-mono">X-RateLimit-Reset: 135029302</p>
                </div>
            </section>

            {/* Upload */}
            <section id="upload" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">File Ingestion</h2>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">v1.2</span>
                </div>
                <div className="space-y-4">
                    <p className="text-gray-400">Initialize a document upload by requesting a pre-signed URL.</p>
                    <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg">
                        <span className="text-indigo-400 font-bold">GET</span>
                        <span className="text-white">/v1/file/upload/get-presigned-url</span>
                    </div>
                    <Card className="bg-black border-white/10 overflow-hidden">
                        <pre className="p-6 text-sm font-mono text-blue-300 overflow-x-auto">
                            {`{ "vault_id": "doc_123", "upload_url": "..." }`}
                        </pre>
                    </Card>
                </div>
            </section>

            {/* Upload Direct */}
            <section id="upload-direct" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">Direct Upload (Base64)</h2>
                <p className="text-gray-400 mb-6">For smaller files (under 5MB), you can send the document as a Base64-encoded string directly in the request payload.</p>
                <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg mb-4">
                    <span className="text-indigo-400 font-bold">POST</span>
                    <span className="text-white">/v1/file/upload/direct</span>
                </div>
            </section>

            {/* AI Extract */}
            <section id="ai-extract" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">AI Document Extract</h2>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">v1.1</span>
                </div>
                <div className="space-y-4">
                    <p className="text-gray-400">Extract structured JSON table data and text arrays from documents.</p>
                    <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg">
                        <span className="text-indigo-400 font-bold">POST</span>
                        <span className="text-white">/v1/pdf/convert/to/json</span>
                    </div>
                    <Card className="bg-black border-white/10 overflow-hidden">
                        <pre className="p-6 text-sm font-mono text-blue-300 overflow-x-auto">
                            {`{ "url": "...", "inline": true }`}
                        </pre>
                    </Card>
                </div>
            </section>

            {/* PDF to Text / CSV / XML */}
            <section id="pdf-to-text" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">PDF to Text / CSV / XML</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div id="pdf-to-csv" className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[10px] tracking-widest">CSV Export</h4>
                        <p className="text-xs text-gray-500">Flatten tables into RFC-compliant CSV structures.</p>
                    </div>
                    <div id="pdf-to-xml" className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[10px] tracking-widest">XML Structure</h4>
                        <p className="text-xs text-gray-500">Full hierarchical layout analysis in XML format.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[10px] tracking-widest">Raw Text</h4>
                        <p className="text-xs text-gray-500">Simple UTF-8 formatted string extraction.</p>
                    </div>
                </div>
            </section>

            {/* Invoice Parser */}
            <section id="invoice-parser" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">Invoice Parser</h2>
                <p className="text-gray-400 mb-6">Proprietary model specifically trained for financial documents, identifying Line Items, Taxes, Vendors, and Totals with 99.9% accuracy.</p>
            </section>

            {/* PDF Generation */}
            <section id="html-to-pdf" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">HTML / URL to PDF</h2>
                <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg mb-6">
                    <span className="text-indigo-400 font-bold">POST</span>
                    <span className="text-white">/v1/pdf/generate/from-html</span>
                </div>
                <div id="doc-builder">
                    <p className="text-gray-400">Our <span className="text-white font-bold">Document Builder</span> supports complex CSS layouts, custom fonts, and multi-page page breaks.</p>
                </div>
            </section>

            {/* Merge & Split */}
            <section id="merge" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-8">Merge PDFs</h2>
                <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg mb-6">
                    <span className="text-indigo-400 font-bold">POST</span>
                    <span className="text-white">/v1/pdf/merge</span>
                </div>
            </section>

            <section id="split" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-8">Split PDF</h2>
                <div className="flex items-center gap-3 font-mono text-sm bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-lg mb-6">
                    <span className="text-indigo-400 font-bold">POST</span>
                    <span className="text-white">/v1/pdf/split</span>
                </div>
            </section>

            {/* Annotate & Watermark */}
            <section id="annotate" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">Fill Forms & Sign</h2>
                <p className="text-gray-400">Programmatically fill PDF forms (AcroForms) or add visual signatures and stamps to any document.</p>
            </section>

            <section id="watermark" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">Watermark & Encrypt</h2>
                <p className="text-gray-400">Secure your documents with owner passwords, usage restrictions, or visible text/image watermarks across all pages.</p>
            </section>

            {/* Conversion */}
            <section id="pdf-to-image" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6 font-serif tracking-tight">PDF to Image Conversion</h2>
                <p className="text-gray-400 mb-6">Convert individual pages or entire documents into high-resolution PNG, JPG, or WEBP formats.</p>
                <div id="image-to-pdf" className="p-6 border border-white/10 bg-white/[0.02] rounded-xl">
                    <h4 className="text-white font-bold mb-2">Image to PDF</h4>
                    <p className="text-sm text-gray-500">Wrap any image set into a standard PDF container with optional OCR layering.</p>
                </div>
            </section>

            {/* Utilities */}
            <section id="barcode" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16">
                <h2 className="text-2xl font-bold mb-6">Barcode / QR Code</h2>
                <p className="text-gray-400">Identify and decode over 20+ barcode formats (QR, UPC, EAN, DataMatrix) found within document pages.</p>
            </section>

            <section id="url-to-pdf" className="scroll-mt-24 border-t border-white/5 pt-16 mt-16 pb-32">
                <h2 className="text-2xl font-bold mb-6">URL Screenshot</h2>
                <p className="text-gray-400">Capture any live website URL and convert it into a pixel-perfect PDF document or screenshot.</p>
            </section>

            <div className="pt-20 text-center">
                <p className="text-gray-500 text-sm">Need help? <Link href="#" className="text-indigo-400 font-bold hover:underline">Contact System Architecture team</Link></p>
            </div>
        </div>
    )
}

