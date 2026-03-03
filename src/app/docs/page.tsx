import { Key, UploadCloud, FileJson, Layers, CheckCircle2, ChevronRight, Terminal, Globe, Lock, FileImage, Code2, Barcode } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="max-w-4xl space-y-24 text-white/40 pb-40">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-32">
                <div className="mb-20 relative inline-flex items-center justify-center p-5 bg-executive-gold/5 border border-executive-gold/10">
                    <Globe className="w-8 h-8 text-executive-gold" />
                </div>
                <h1 className="text-5xl md:text-7xl font-normal text-white mb-16 tracking-tight font-serif">The Protocol</h1>
                <p className="text-xl leading-relaxed text-white/40 mb-12 max-w-3xl font-light">
                    The DocuNexus API is organized around REST. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-6 rounded-none border border-white/10 bg-white/5 flex gap-4">
                        <Lock className="w-6 h-6 text-executive-gold flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Secure by Design</h4>
                            <p className="text-sm">TLS 1.2+ protocol required for all connections. Data encrypted at rest.</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-none border border-white/10 bg-white/5 flex gap-4">
                        <Terminal className="w-6 h-6 text-executive-gold flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Developer First</h4>
                            <p className="text-sm">Robust sandbox environments and detailed error messages.</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-32">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 font-serif">
                    <Key className="w-8 h-8 text-executive-gold" /> Authentication
                </h2>
                <p className="text-lg mb-6 leading-relaxed">
                    The DocuNexus API uses API keys to authenticate requests. You can view and manage your API keys in the <a href="/dashboard/api-keys" className="text-executive-gold hover:text-white underline underline-offset-4">Developer Hub</a>.
                </p>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 mb-8 shadow-2xl">
                    <p className="mb-4">Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
                    <p>Authentication to the API is performed via the generic HTTP Header Authorization. Provide your API key as the bearer token value.</p>
                </div>

                <div className="rounded-none overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a] font-mono text-sm leading-relaxed mb-8">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2 text-gray-400">
                        <div className="flex gap-1.5 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        HTTP Header
                    </div>
                    <div className="p-4 overflow-x-auto text-executive-gold">
                        Authorization: Bearer <span className="text-white">dn_secret_your_api_key_here</span>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* File Upload (Pre-signed URL) */}
            <section id="upload" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-none bg-executive-gold/10 flex items-center justify-center border border-executive-gold/20">
                        <UploadCloud className="w-6 h-6 text-executive-gold" />
                    </div>
                    <h2 className="text-3xl font-bold text-white font-serif">File Upload</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    DocuNexus requires cloud-hosted documents for processing. The most secure way to process files is to request a temporary, secure pre-signed upload URL. Upload your file there, and pass the resulting URL to our processing endpoints.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2 font-serif">1. Get Pre-signed URL</h3>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-executive-gold/20 text-executive-gold text-xs font-bold font-mono tracking-wider border border-executive-gold/30 mb-4">GET</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/file/upload/get-presigned-url</code>

                            <h4 className="font-semibold text-white mt-6 mb-3">Query Parameters</h4>
                            <div className="border border-white/10 rounded-none overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">name <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">Name of the file including extension (e.g., invoice.pdf).</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-none border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X GET "https://api.docunexus.com/v1/file/upload/get-presigned-url?name=test.pdf" \\
  -H "Authorization: Bearer dn_secret..."`}
                        </pre>
                        <div className="bg-white/5 border-y border-white/10 px-4 py-2 text-xs font-mono text-gray-400">Response (JSON)</div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-executive-gold leading-relaxed">
                            {`{
  "error": false,
  "status": 200,
  "name": "test.pdf",
  "url": "https://docunexus-temp-files.s3.amazonaws.com/...",
  "presignedUrl": "https://docunexus-temp-files.s3.amazonaws.com/...&Signature=..."
}`}
                        </pre>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* AI Extract */}
            <section id="ai-extract" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-none bg-executive-gold/10 flex items-center justify-center border border-executive-gold/20">
                        <FileJson className="w-6 h-6 text-executive-gold" />
                    </div>
                    <h2 className="text-3xl font-bold text-white font-serif">AI Document Extraction</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    Convert complex invoices, forms, and receipts into structured JSON data. Uses advanced AI and Layout Analysis to intelligently extract tables and key-value pairs without zonal OCR mapping.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-executive-gold/20 text-executive-gold text-xs font-bold font-mono tracking-wider border border-executive-gold/30 mb-4">POST</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/pdf/convert/to/json</code>

                            <h4 className="font-semibold text-white mt-6 mb-3 font-serif">Body Parameters</h4>
                            <div className="border border-white/10 rounded-none overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">url <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">Publicly accessible URL to the source PDF document.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">inline</td>
                                            <td className="px-4 py-3 text-gray-400">Boolean. If true, returns JSON data inline. Default: <code className="text-white">false</code>.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-none border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X POST "https://api.docunexus.com/v1/pdf/convert/to/json" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/invoice.pdf",
    "inline": true
  }'`}
                        </pre>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* HTML to PDF */}
            <section id="html-to-pdf" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-none bg-executive-gold/10 flex items-center justify-center border border-executive-gold/20">
                        <Code2 className="w-6 h-6 text-executive-gold" />
                    </div>
                    <h2 className="text-3xl font-bold text-white font-serif">HTML to PDF</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    Generate high-quality PDF documents from HTML code or website URLs. Full support for modern CSS, JavaScript, and custom fonts.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-executive-gold/20 text-executive-gold text-xs font-bold font-mono tracking-wider border border-executive-gold/30 mb-4">POST</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/pdf/convert/from/html</code>

                            <h4 className="font-semibold text-white mt-6 mb-3 font-serif">Body Parameters</h4>
                            <div className="border border-white/10 rounded-none overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">html <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">HTML code or URL to convert.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">margins</td>
                                            <td className="px-4 py-3 text-gray-400">Set page margins in pixels (e.g., "5px 5px 5px 5px").</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-none border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X POST "https://api.docunexus.com/v1/pdf/convert/from/html" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d '{
    "html": "<h1>Hello DocuNexus</h1>",
    "margins": "10px 10px 10px 10px"
  }'`}
                        </pre>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* PDF to Image */}
            <section id="pdf-to-image" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-none bg-executive-gold/10 flex items-center justify-center border border-executive-gold/20">
                        <FileImage className="w-6 h-6 text-executive-gold" />
                    </div>
                    <h2 className="text-3xl font-bold text-white font-serif">PDF to Image</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    Render PDF pages into high-resolution PNG or JPG images. Perfect for generating document previews or thumbnails.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-executive-gold/20 text-executive-gold text-xs font-bold font-mono tracking-wider border border-executive-gold/30 mb-4">POST</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/pdf/convert/to/png</code>

                            <h4 className="font-semibold text-white mt-6 mb-3 font-serif">Body Parameters</h4>
                            <div className="border border-white/10 rounded-none overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">url <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">URL to the source PDF.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">pages</td>
                                            <td className="px-4 py-3 text-gray-400">Page number or range (e.g. "1-3").</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-none border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X POST "https://api.docunexus.com/v1/pdf/convert/to/png" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d '{
    "url": "https://example.com/report.pdf",
    "pages": "1"
  }'`}
                        </pre>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* Barcode */}
            <section id="barcode" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-none bg-executive-gold/10 flex items-center justify-center border border-executive-gold/20">
                        <Barcode className="w-6 h-6 text-executive-gold" />
                    </div>
                    <h2 className="text-3xl font-bold text-white font-serif">Barcode Generation</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    Generate various barcode and QR code formats (Code 128, QR Code, DataMatrix, PDF417) as high-quality images.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-executive-gold/20 text-executive-gold text-xs font-bold font-mono tracking-wider border border-executive-gold/30 mb-4">GET</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/barcode/generate</code>

                            <h4 className="font-semibold text-white mt-6 mb-3 font-serif">Query Parameters</h4>
                            <div className="border border-white/10 rounded-none overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">type <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">Barcode type (e.g., "QRCode", "Code128").</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-executive-gold">value <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">The text/numeric value to encode.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-none border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X GET "https://api.docunexus.com/v1/barcode/generate?type=QRCode&value=DocuNexus" \\
  -H "Authorization: Bearer dn_secret..."`}
                        </pre>
                    </div>
                </div>
            </section>
        </div>
    )
}
