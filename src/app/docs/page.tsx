import { Key, UploadCloud, FileJson, Layers, CheckCircle2, ChevronRight, Terminal, Globe, Lock } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="max-w-4xl space-y-24 text-gray-300">
            {/* Introduction */}
            <section id="introduction" className="scroll-mt-32">
                <div className="mb-8 relative inline-flex items-center justify-center p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                    <Globe className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">API Documentation</h1>
                <p className="text-xl leading-relaxed text-gray-400 mb-8 max-w-3xl">
                    The DocuNexu API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex gap-4">
                        <Lock className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Secure by Design</h4>
                            <p className="text-sm">TLS 1.2+ protocol required for all connections. Data encrypted at rest.</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex gap-4">
                        <Terminal className="w-6 h-6 text-blue-400 flex-shrink-0" />
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
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Key className="w-8 h-8 text-yellow-500" /> Authentication
                </h2>
                <p className="text-lg mb-6 leading-relaxed">
                    The DocuNexu API uses API keys to authenticate requests. You can view and manage your API keys in the <a href="/dashboard/api-keys" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">Developer Dashboard</a>.
                </p>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 mb-8 shadow-2xl">
                    <p className="mb-4">Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
                    <p>Authentication to the API is performed via the generic HTTP Header Authorization. Provide your API key as the bearer token value.</p>
                </div>

                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a] font-mono text-sm leading-relaxed mb-8">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2 text-gray-400">
                        <div className="flex gap-1.5 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        HTTP Header
                    </div>
                    <div className="p-4 overflow-x-auto text-indigo-300">
                        Authorization: Bearer <span className="text-green-400">dn_secret_your_api_key_here</span>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* File Upload (Pre-signed URL) */}
            <section id="upload" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <UploadCloud className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">File Upload (Cloud)</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    DocuNexu requires cloud-hosted documents for processing. The most secure way to process files is to request a temporary, secure pre-signed upload URL. Upload your file there, and pass the resulting URL to our processing endpoints.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">1. Get Pre-signed URL</h3>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold font-mono tracking-wider border border-blue-500/30 mb-4">GET</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/file/upload/get-presigned-url</code>

                            <h4 className="font-semibold text-white mt-6 mb-3">Query Parameters</h4>
                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-indigo-300">name <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">Name of the file including extension (e.g., invoice.pdf).</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X GET "https://docunexu.com/api/v1/file/upload/get-presigned-url?name=test.pdf" \\
  -H "Authorization: Bearer dn_secret..."`}
                        </pre>
                        <div className="bg-white/5 border-y border-white/10 px-4 py-2 text-xs font-mono text-gray-400">Response (JSON)</div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed">
                            {`{
  "error": false,
  "status": 200,
  "name": "test.pdf",
  "url": "https://pdf-temp-files.s3.amazonaws.com/...",
  "presignedUrl": "https://pdf-temp-files.s3.amazonaws.com/...&Signature=..."
}`}
                        </pre>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* PDF to JSON */}
            <section id="pdf-to-json" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <FileJson className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Extract AI (PDF to JSON)</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    Convert complex invoices, forms, and receipts into structured JSON data. Uses advanced AI and Layout Analysis to intelligently extract tables and key-value pairs without zonal OCR mapping.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold font-mono tracking-wider border border-green-500/30 mb-4">POST</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/pdf/convert/to/json</code>

                            <h4 className="font-semibold text-white mt-6 mb-3">Body Parameters</h4>
                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-indigo-300">url <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">Publicly accessible URL to the source PDF document. Use the <code className="text-pink-400">url</code> returned from the upload endpoint.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-indigo-300">inline</td>
                                            <td className="px-4 py-3 text-gray-400">Boolean. If true, returns JSON data inline instead of a URL to the results. Default: <code className="text-blue-300">false</code>.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-indigo-300">async</td>
                                            <td className="px-4 py-3 text-gray-400">Boolean. Run processing in background. Required for files over 5MB. Default: <code className="text-blue-300">false</code>.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X POST "https://docunexu.com/api/v1/pdf/convert/to/json" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/invoice.pdf",
    "inline": true
  }'`}
                        </pre>
                        <div className="bg-white/5 border-y border-white/10 px-4 py-2 text-xs font-mono text-gray-400">Response (JSON)</div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed">
                            {`{
  "error": false,
  "status": 200,
  "body": "{ \\"invoice_number\\": \\"10023\\", ... }"
}`}
                        </pre>
                    </div>
                </div>
            </section>

            <hr className="border-white/10" />

            {/* Merge/Split */}
            <section id="merge-split" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Layers className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Merge & Split</h2>
                </div>
                <p className="text-lg mb-6 leading-relaxed">
                    Combine multiple PDF documents into a single archive, or extract specific page ranges from massive documents instantly.
                </p>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="inline-flex items-center px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold font-mono tracking-wider border border-green-500/30 mb-4">POST</div>
                            <code className="ml-3 font-mono text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-200">/v1/pdf/merge</code>

                            <h4 className="font-semibold text-white mt-6 mb-3">Body Parameters</h4>
                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5">
                                        <tr><th className="px-4 py-3 font-medium text-white">Parameter</th><th className="px-4 py-3 font-medium text-white">Description</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10 bg-[#0a0a0a]">
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-indigo-300">url <span className="text-red-400 ml-1" title="Required">*</span></td>
                                            <td className="px-4 py-3 text-gray-400">Comma-separated list of document URLs to merge together.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-mono text-indigo-300">name</td>
                                            <td className="px-4 py-3 text-gray-400">File name for the resulting merged PDF.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-xs font-mono text-gray-400 flex justify-between">
                            <span>Request (cURL)</span>
                            <span>bash</span>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">
                            {`curl -X POST "https://docunexu.com/api/v1/pdf/merge" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d "url=https://[url1]&url=https://[url2]" \\
  -d "name=merged.pdf"`}
                        </pre>
                        <div className="bg-white/5 border-y border-white/10 px-4 py-2 text-xs font-mono text-gray-400">Response (JSON)</div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed">
                            {`{
  "error": false,
  "status": 200,
  "name": "merged.pdf",
  "url": "https://pdf-temp-files.s3.../merged.pdf"
}`}
                        </pre>
                    </div>
                </div>
            </section>
        </div>
    )
}
