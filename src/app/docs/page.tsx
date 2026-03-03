import {
    Key, UploadCloud, FileJson, Layers, Code2, FileImage,
    Globe, Lock, Terminal, ScanLine, Scissors, FilePen,
    KeyRound, Barcode, AlertCircle, Zap, CheckCircle2, ChevronRight
} from "lucide-react"

/* ── Reusable mini-components ──────────────────────────────── */

function Method({ type }: { type: "GET" | "POST" | "DELETE" }) {
    const styles: Record<string, string> = {
        GET: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/25",
        POST: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
        DELETE: "bg-red-500/10 text-red-400 border border-red-500/25",
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold font-mono tracking-wider ${styles[type]}`}>
            {type}
        </span>
    )
}

function Endpoint({ method, path }: { method: "GET" | "POST" | "DELETE"; path: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <Method type={method} />
            <code className="font-mono text-sm bg-white/5 px-3 py-1.5 border border-white/8 text-gray-200 break-all">{path}</code>
        </div>
    )
}

function ParamTable({ params }: {
    params: { name: string; required?: boolean; type?: string; desc: string }[]
}) {
    return (
        <div className="border border-white/8 overflow-hidden mb-6">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04]">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-white/70 text-xs tracking-widest uppercase">Parameter</th>
                        <th className="px-4 py-3 font-semibold text-white/70 text-xs tracking-widest uppercase">Type</th>
                        <th className="px-4 py-3 font-semibold text-white/70 text-xs tracking-widest uppercase">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] bg-[#070707]">
                    {params.map(p => (
                        <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-mono text-executive-gold text-sm whitespace-nowrap">
                                {p.name}
                                {p.required && <span className="text-red-400 ml-1.5" title="Required">*</span>}
                            </td>
                            <td className="px-4 py-3 text-white/30 text-xs font-mono">{p.type ?? "string"}</td>
                            <td className="px-4 py-3 text-white/45 text-sm leading-relaxed">{p.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function CodeBlock({ label, lang, code }: { label: string; lang: string; code: string }) {
    return (
        <div className="bg-[#050505] border border-white/8 overflow-hidden shadow-xl mb-4">
            <div className="bg-white/[0.04] px-4 py-2 border-b border-white/8 text-xs font-mono text-white/30 flex justify-between items-center">
                <span>{label}</span>
                <span className="text-executive-gold/50">{lang}</span>
            </div>
            <pre className="p-5 text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed">{code}</pre>
        </div>
    )
}

function ResponseBlock({ code }: { code: string }) {
    return (
        <div className="bg-[#050505] border border-white/8 overflow-hidden shadow-xl">
            <div className="bg-white/[0.04] px-4 py-2 border-b border-white/8 text-xs font-mono text-white/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
                Response · 200 OK
            </div>
            <pre className="p-5 text-xs font-mono overflow-x-auto text-executive-gold/80 leading-relaxed">{code}</pre>
        </div>
    )
}

function SectionHeader({ id, icon: Icon, title }: { id: string; icon: React.ElementType; title: string }) {
    return (
        <div id={id} className="flex items-center gap-4 mb-6 scroll-mt-36">
            <div className="w-12 h-12 bg-executive-gold/8 border border-executive-gold/15 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-executive-gold" />
            </div>
            <h2 className="text-3xl font-bold text-white font-serif">{title}</h2>
        </div>
    )
}

function Divider() {
    return <hr className="border-white/[0.06] my-20" />
}

/* ── Page ──────────────────────────────────────────────────── */

export default function DocsPage() {
    return (
        <div className="max-w-4xl space-y-0 text-white/40 pb-40">

            {/* ══ INTRODUCTION ══════════════════════════════════ */}
            <section id="introduction" className="scroll-mt-36 mb-20">
                <div className="mb-8 relative inline-flex items-center justify-center p-5 bg-executive-gold/5 border border-executive-gold/12">
                    <Globe className="w-8 h-8 text-executive-gold" />
                </div>
                <h1 className="text-5xl md:text-7xl font-normal text-white mb-8 tracking-tight font-serif leading-tight">
                    The Protocol
                </h1>
                <p className="text-xl leading-relaxed text-white/40 mb-8 max-w-3xl font-light">
                    The DocuNexus API is organized around REST. All endpoints accept JSON-encoded request bodies, return JSON-encoded responses, and use standard HTTP response codes. You can use the DocuNexus API from any language that can make HTTP requests.
                </p>
                <p className="text-base leading-relaxed text-white/30 mb-10 max-w-3xl font-light">
                    The API base URL is <code className="text-executive-gold font-mono text-sm bg-white/5 px-2 py-0.5 border border-white/8">https://api.docunexus.com</code>. All requests must be made over HTTPS — plain HTTP connections will be refused.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: Lock, title: "Secure by Default", desc: "TLS 1.3 required for all connections. Data encrypted at rest with AES-256." },
                        { icon: Terminal, title: "Developer First", desc: "Consistent error messages, a full sandbox, and SDKs for 6 languages." },
                        { icon: Zap, title: "Sub-400ms P99", desc: "Global edge infrastructure with an uptime SLA of 99.9%." },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="p-5 border border-white/8 bg-white/[0.02] flex gap-4">
                            <Icon className="w-5 h-5 text-executive-gold flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
                                <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Divider />

            {/* ══ AUTHENTICATION ════════════════════════════════ */}
            <section id="authentication" className="scroll-mt-36 mb-20">
                <SectionHeader id="authentication-h" icon={Key} title="Authentication" />
                <p className="text-base mb-6 leading-relaxed">
                    DocuNexus authenticates API requests using API keys. Generate and manage your keys in the{" "}
                    <a href="/dashboard/api-keys" className="text-executive-gold hover:text-white underline underline-offset-4 transition-colors">Developer Hub</a>.
                    Do not share or expose your secret key in client-side code, GitHub, or any public channel.
                </p>
                <p className="text-base mb-8 leading-relaxed">
                    Pass your API key as a <code className="text-executive-gold font-mono text-sm">Bearer</code> token in the <code className="text-executive-gold font-mono text-sm">Authorization</code> header of every request.
                </p>

                <CodeBlock label="HTTP Header" lang="HTTP" code={`Authorization: Bearer dn_secret_your_api_key_here`} />

                <CodeBlock label="Example Request (cURL)" lang="bash" code={`curl -X GET "https://api.docunexus.com/v1/file/upload/get-presigned-url?name=report.pdf" \\
  -H "Authorization: Bearer dn_secret_your_api_key_here"`} />

                <div className="p-5 border border-yellow-500/15 bg-yellow-500/[0.04] flex gap-4 mt-6">
                    <AlertCircle className="w-5 h-5 text-yellow-400/70 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/40 leading-relaxed">
                        <strong className="text-white/70">Keep your key secure.</strong> If you suspect your key has been compromised, rotate it immediately from the Developer Hub. DocuNexus will never ask for your key outside of API requests.
                    </p>
                </div>
            </section>

            <Divider />

            {/* ══ BASE URL & VERSIONING ═════════════════════════ */}
            <section id="base-url" className="scroll-mt-36 mb-20">
                <SectionHeader id="base-url-h" icon={Globe} title="Base URL & Versioning" />
                <p className="text-base mb-6 leading-relaxed">
                    All API endpoints are prefixed with the API version. The current stable version is <code className="text-executive-gold font-mono text-sm">v1</code>.
                </p>
                <CodeBlock label="Base URL" lang="HTTP" code={`https://api.docunexus.com/v1`} />
                <p className="text-sm text-white/30 leading-relaxed">
                    When a breaking change is introduced, a new version will be published. Prior versions remain supported for a minimum of 12 months after deprecation is announced.
                </p>
            </section>

            <Divider />

            {/* ══ ERROR CODES ═══════════════════════════════════ */}
            <section id="errors" className="scroll-mt-36 mb-20">
                <SectionHeader id="errors-h" icon={AlertCircle} title="Error Codes" />
                <p className="text-base mb-8 leading-relaxed">
                    DocuNexus uses standard HTTP response codes. Codes in the <code className="text-executive-gold font-mono">2xx</code> range indicate success. Codes in the <code className="text-executive-gold font-mono">4xx</code> range indicate a client error (e.g., missing parameter). Codes in the <code className="text-executive-gold font-mono">5xx</code> range indicate a server error.
                </p>
                <div className="border border-white/8 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.04]">
                            <tr>
                                <th className="px-4 py-3 text-white/60 text-xs tracking-widest uppercase font-semibold">Code</th>
                                <th className="px-4 py-3 text-white/60 text-xs tracking-widest uppercase font-semibold">Meaning</th>
                                <th className="px-4 py-3 text-white/60 text-xs tracking-widest uppercase font-semibold">Common Cause</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05] bg-[#070707]">
                            {[
                                { code: "200", color: "text-emerald-400", meaning: "OK", cause: "Request succeeded." },
                                { code: "400", color: "text-yellow-400", meaning: "Bad Request", cause: "A required parameter is missing or malformed." },
                                { code: "401", color: "text-red-400", meaning: "Unauthorized", cause: "Invalid or missing API key in the Authorization header." },
                                { code: "403", color: "text-red-400", meaning: "Forbidden", cause: "Your plan does not have access to this endpoint." },
                                { code: "404", color: "text-yellow-400", meaning: "Not Found", cause: "The requested resource or endpoint does not exist." },
                                { code: "429", color: "text-orange-400", meaning: "Rate Limited", cause: "You have exceeded your plan's request rate limit." },
                                { code: "500", color: "text-red-400", meaning: "Server Error", cause: "An internal error occurred. Contact support if it persists." },
                            ].map(row => (
                                <tr key={row.code} className="hover:bg-white/[0.02] transition-colors">
                                    <td className={`px-4 py-3 font-mono font-bold ${row.color}`}>{row.code}</td>
                                    <td className="px-4 py-3 text-white/60">{row.meaning}</td>
                                    <td className="px-4 py-3 text-white/35 text-sm">{row.cause}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ResponseBlock code={`{
  "error": true,
  "status": 400,
  "message": "Missing required parameter: 'url'. Please provide a valid document URL.",
  "code": "MISSING_PARAM"
}`} />
            </section>

            <Divider />

            {/* ══ RATE LIMITS ═══════════════════════════════════ */}
            <section id="rate-limits" className="scroll-mt-36 mb-20">
                <SectionHeader id="rate-limits-h" icon={Zap} title="Rate Limits" />
                <p className="text-base mb-6 leading-relaxed">
                    Rate limits are enforced per API key on a rolling 60-second window. Your current plan limits and remaining quota are returned in the response headers of every request.
                </p>
                <div className="border border-white/8 overflow-hidden mb-6">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/[0.04]">
                            <tr>
                                <th className="px-4 py-3 text-white/60 text-xs tracking-widest uppercase font-semibold">Plan</th>
                                <th className="px-4 py-3 text-white/60 text-xs tracking-widest uppercase font-semibold">Requests / Minute</th>
                                <th className="px-4 py-3 text-white/60 text-xs tracking-widest uppercase font-semibold">Credits / Month</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05] bg-[#070707]">
                            {[
                                { plan: "Basic", rpm: "60", credits: "1,000" },
                                { plan: "Personal", rpm: "300", credits: "5,000" },
                                { plan: "Business", rpm: "1,000", credits: "25,000" },
                                { plan: "Enterprise", rpm: "Unlimited", credits: "Unlimited" },
                            ].map(row => (
                                <tr key={row.plan} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-white/70 font-medium">{row.plan}</td>
                                    <td className="px-4 py-3 text-executive-gold font-mono">{row.rpm}</td>
                                    <td className="px-4 py-3 text-white/45 font-mono">{row.credits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <CodeBlock label="Rate Limit Headers" lang="HTTP" code={`X-RateLimit-Limit: 300
X-RateLimit-Remaining: 247
X-RateLimit-Reset: 1741120800
X-Credits-Remaining: 4823`} />
            </section>

            <Divider />

            {/* ══ FILE UPLOAD ═══════════════════════════════════ */}
            <section id="upload" className="scroll-mt-36 mb-20">
                <SectionHeader id="upload-h" icon={UploadCloud} title="File Upload (Pre-signed URL)" />
                <p className="text-base mb-6 leading-relaxed">
                    DocuNexus processes documents from accessible URLs. The recommended approach for private or local files is to first request a secure, temporary pre-signed upload URL, upload your file directly to it, and then pass the resulting URL to any processing endpoint.
                </p>
                <p className="text-sm mb-8 text-white/30 leading-relaxed">
                    Pre-signed URLs expire after <strong className="text-white/50">60 minutes</strong>. Uploaded files are purged from storage after <strong className="text-white/50">24 hours</strong>.
                </p>

                <h3 className="text-lg font-semibold text-white mb-3 font-serif">Step 1 — Request Pre-signed URL</h3>
                <Endpoint method="GET" path="/v1/file/upload/get-presigned-url" />
                <ParamTable params={[
                    { name: "name", required: true, desc: "Filename including extension (e.g. invoice.pdf, report.docx)." },
                    { name: "contentType", desc: "MIME type of the file. Defaults to application/pdf.", type: "string" },
                ]} />
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X GET \\
  "https://api.docunexus.com/v1/file/upload/get-presigned-url?name=invoice.pdf" \\
  -H "Authorization: Bearer dn_secret..."`} />
                    <ResponseBlock code={`{
  "error": false,
  "status": 200,
  "name": "invoice.pdf",
  "url": "https://storage.docunexus.com/tmp/abc123/invoice.pdf",
  "presignedUrl": "https://storage.docunexus.com/tmp/abc123/invoice.pdf?Signature=..."
}`} />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3 font-serif">Step 2 — Upload File to Pre-signed URL</h3>
                <CodeBlock label="Upload via cURL (PUT)" lang="bash" code={`curl -X PUT "https://storage.docunexus.com/tmp/abc123/invoice.pdf?Signature=..." \\
  -H "Content-Type: application/pdf" \\
  --data-binary @/local/path/to/invoice.pdf`} />

                <h3 className="text-lg font-semibold text-white mb-3 font-serif mt-8">Direct Upload — Base64</h3>
                <div id="upload-direct" className="scroll-mt-36" />
                <Endpoint method="POST" path="/v1/file/upload" />
                <ParamTable params={[
                    { name: "name", required: true, desc: "Filename with extension." },
                    { name: "content", required: true, desc: "Base64-encoded file contents." },
                    { name: "contentType", desc: "MIME type. Defaults to application/pdf.", type: "string" },
                ]} />
                <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/file/upload" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "document.pdf",
    "content": "JVBERi0xLjQKJeLjz...",
    "contentType": "application/pdf"
  }'`} />
            </section>

            <Divider />

            {/* ══ AI EXTRACTION ════════════════════════════════ */}
            <section id="ai-extract" className="scroll-mt-36 mb-20">
                <SectionHeader id="ai-extract-h" icon={FileJson} title="AI Document Extraction" />
                <p className="text-base mb-6 leading-relaxed">
                    Convert any PDF — invoices, contracts, reports, forms — into structured JSON using DocuNexus's AI extraction engine. The model understands document layout without pre-defined templates, extracting key-value pairs, tables, and nested structures automatically.
                </p>

                <Endpoint method="POST" path="/v1/pdf/convert/to/json" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "Publicly accessible URL to the source PDF document." },
                    { name: "inline", type: "boolean", desc: "If true, returns the extracted JSON inline in the response body. Default: false (returns a download URL)." },
                    { name: "pages", desc: "Page range to process (e.g. '1', '1-5', '2,4,6'). Default: all pages." },
                    { name: "password", desc: "Password for encrypted PDF documents." },
                    { name: "lang", desc: "OCR language hint. Accepts ISO 639-1 codes (e.g. 'en', 'de', 'fr'). Default: 'en'." },
                ]} />

                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/convert/to/json" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/invoice.pdf",
    "inline": true,
    "pages": "1-3"
  }'`} />
                    <ResponseBlock code={`{
  "error": false,
  "status": 200,
  "pageCount": 3,
  "creditsUsed": 3,
  "body": [
    {
      "page": 1,
      "fields": {
        "vendor": "Nexus Strategic LLC",
        "invoice_number": "INV-2094",
        "total": 1250.00,
        "currency": "USD",
        "date": "2026-03-01"
      },
      "tables": [
        {
          "headers": ["Description", "Qty", "Unit Price", "Total"],
          "rows": [
            ["AI Compute", 1, 800, 800],
            ["Bandwidth", 1, 450, 450]
          ]
        }
      ]
    }
  ]
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ PDF TO TEXT ══════════════════════════════════ */}
            <section id="pdf-to-text" className="scroll-mt-36 mb-20">
                <SectionHeader id="pdf-to-text-h" icon={FileJson} title="PDF to Text" />
                <p className="text-base mb-6 leading-relaxed">
                    Extract all raw text content from a PDF, preserving reading order. Ideal for full-text search indexing, content analysis, or feeding text into downstream NLP pipelines.
                </p>
                <Endpoint method="POST" path="/v1/pdf/convert/to/text" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL of the PDF to extract text from." },
                    { name: "pages", desc: "Page range to process. Omit for all pages." },
                    { name: "inline", type: "boolean", desc: "Return text inline in the response. Default: false." },
                    { name: "password", desc: "Password for encrypted PDFs." },
                ]} />
                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/convert/to/text" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d '{ "url": "https://example.com/report.pdf", "inline": true }'`} />
                    <ResponseBlock code={`{
  "error": false,
  "status": 200,
  "body": "DocuNexus Quarterly Report\\nQ1 2026\\n\\nRevenue: $2.4M\\nGrowth: +34% YoY..."
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ PDF TO CSV ══════════════ */}
            <section id="pdf-to-csv" className="scroll-mt-36 mb-20">
                <SectionHeader id="pdf-to-csv-h" icon={FileJson} title="PDF to CSV" />
                <p className="text-base mb-6 leading-relaxed">
                    Extract tabular data from a PDF and convert it to CSV format. The engine intelligently detects table boundaries and column alignment — even in complex, multi-column layouts.
                </p>
                <Endpoint method="POST" path="/v1/pdf/convert/to/csv" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL of the source PDF." },
                    { name: "pages", desc: "Page range. Defaults to all pages." },
                    { name: "delimiter", desc: "Column delimiter character. Default: ','." },
                    { name: "inline", type: "boolean", desc: "Return CSV data inline. Default: false." },
                ]} />
                <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/convert/to/csv" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d '{ "url": "https://example.com/financials.pdf", "inline": true, "delimiter": "," }'`} />
            </section>

            <Divider />

            {/* ══ INVOICE PARSER ═══════════════════════════════ */}
            <section id="invoice-parser" className="scroll-mt-36 mb-20">
                <SectionHeader id="invoice-parser-h" icon={ScanLine} title="Invoice & Receipt Parser" />
                <p className="text-base mb-6 leading-relaxed">
                    A purpose-built extraction model trained on millions of financial documents. Extracts vendor details, line items, tax, totals, and dates from invoices and receipts — across 40+ languages, with no template configuration required.
                </p>
                <Endpoint method="POST" path="/v1/invoice/parse" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL of the invoice or receipt PDF." },
                    { name: "detect_currency", type: "boolean", desc: "Auto-detect and normalise currency symbols. Default: true." },
                    { name: "extract_line_items", type: "boolean", desc: "Include full line-item table in the response. Default: true." },
                    { name: "lang", desc: "Document language hint (ISO 639-1). Default: 'en'." },
                ]} />
                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/invoice/parse" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d '{
    "url": "https://example.com/inv-2094.pdf",
    "detect_currency": true,
    "extract_line_items": true
  }'`} />
                    <ResponseBlock code={`{
  "error": false,
  "vendor": "Nexus Strategic LLC",
  "invoice_number": "INV-2094",
  "date": "2026-03-01",
  "due_date": "2026-03-31",
  "currency": "USD",
  "subtotal": 1150.00,
  "tax": 100.00,
  "total": 1250.00,
  "line_items": [
    { "description": "AI Compute", "qty": 1, "unit_price": 800, "total": 800 },
    { "description": "Bandwidth", "qty": 1, "unit_price": 450, "total": 450 }
  ]
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ HTML TO PDF ══════════════════════════════════ */}
            <section id="html-to-pdf" className="scroll-mt-36 mb-20">
                <SectionHeader id="html-to-pdf-h" icon={Code2} title="HTML / URL to PDF" />
                <p className="text-base mb-6 leading-relaxed">
                    Convert raw HTML strings or fully rendered web pages into PDF documents. The renderer supports modern CSS3, custom fonts, JavaScript execution, and fine-grained page configuration.
                </p>
                <Endpoint method="POST" path="/v1/pdf/convert/from/html" />
                <ParamTable params={[
                    { name: "html", required: true, desc: "Raw HTML string to convert. Alternatively, provide a url parameter instead." },
                    { name: "url", desc: "A web page URL to render as PDF (use instead of html)." },
                    { name: "margins", desc: "Page margins in CSS shorthand (e.g. '10px 15px 10px 15px'). Default: '10px'." },
                    { name: "paper_size", desc: "Paper format: 'A4', 'Letter', 'Legal', 'A3'. Default: 'A4'." },
                    { name: "orientation", desc: "'portrait' or 'landscape'. Default: 'portrait'." },
                    { name: "wait_for", desc: "Wait condition before rendering: 'load', 'networkidle', or a CSS selector." },
                    { name: "header_html", desc: "HTML snippet for repeating page header." },
                    { name: "footer_html", desc: "HTML snippet for repeating page footer." },
                    { name: "css", desc: "Additional CSS to inject before rendering." },
                ]} />
                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/convert/from/html" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<h1 style=\\"font-family:sans-serif\\">Report</h1><p>Q1 2026</p>",
    "paper_size": "A4",
    "margins": "20px",
    "orientation": "portrait"
  }'`} />
                    <ResponseBlock code={`{
  "error": false,
  "status": 200,
  "url": "https://storage.docunexus.com/output/dn_abc123.pdf",
  "pageCount": 1,
  "sizeBytes": 42310,
  "creditsUsed": 1
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ DOCUMENT BUILDER ════════════════════════════ */}
            <section id="doc-builder" className="scroll-mt-36 mb-20">
                <SectionHeader id="doc-builder-h" icon={Code2} title="Document Builder" />
                <p className="text-base mb-6 leading-relaxed">
                    Generate rich, branded PDF documents from JSON data and reusable templates. Templates are created in the DocuNexus dashboard using Handlebars syntax.
                </p>
                <Endpoint method="POST" path="/v1/pdf/generate" />
                <ParamTable params={[
                    { name: "template_id", required: true, desc: "ID of the template created in the DocuNexus dashboard." },
                    { name: "data", required: true, type: "object", desc: "Key-value data object injected into the template." },
                    { name: "name", desc: "Optional filename for the generated PDF." },
                ]} />
                <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/generate" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_id": "tmpl_invoice_v3",
    "data": {
      "company": "Nexus Strategic LLC",
      "invoice_number": "INV-2095",
      "total": 3400.00,
      "date": "2026-03-03"
    }
  }'`} />
            </section>

            <Divider />

            {/* ══ MERGE ═════════════════════════════════════════ */}
            <section id="merge" className="scroll-mt-36 mb-20">
                <SectionHeader id="merge-h" icon={Layers} title="Merge PDFs" />
                <p className="text-base mb-6 leading-relaxed">
                    Combine multiple PDF documents into a single file. Documents are merged in the order they are listed in the request. Bookmarks, metadata, and form fields from source documents are preserved by default.
                </p>
                <Endpoint method="POST" path="/v1/pdf/merge" />
                <ParamTable params={[
                    { name: "urls", required: true, type: "string[]", desc: "Array of PDF URLs to merge, in order." },
                    { name: "preserve_bookmarks", type: "boolean", desc: "Merge source document bookmarks into the output. Default: true." },
                    { name: "name", desc: "Filename for the merged output PDF." },
                ]} />
                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/merge" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://storage.docunexus.com/tmp/cover.pdf",
      "https://storage.docunexus.com/tmp/body.pdf",
      "https://storage.docunexus.com/tmp/appendix.pdf"
    ],
    "preserve_bookmarks": true,
    "name": "final_report.pdf"
  }'`} />
                    <ResponseBlock code={`{
  "error": false,
  "status": 200,
  "url": "https://storage.docunexus.com/output/final_report.pdf",
  "pageCount": 28,
  "sizeBytes": 1382140,
  "creditsUsed": 3
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ SPLIT ════════════════════════════════════════ */}
            <section id="split" className="scroll-mt-36 mb-20">
                <SectionHeader id="split-h" icon={Scissors} title="Split PDF" />
                <p className="text-base mb-6 leading-relaxed">
                    Extract a range of pages from a PDF, or split a document into individual single-page files. Results are returned as an array of URLs.
                </p>
                <Endpoint method="POST" path="/v1/pdf/split" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL of the source PDF to split." },
                    { name: "pages", required: true, desc: "Page range(s) to extract (e.g. '1-3', '2,5,7', '1-3,5,7-9'). Pass '*' to split all pages individually." },
                    { name: "password", desc: "Password for encrypted source PDF." },
                ]} />
                <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/split" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d '{
    "url": "https://example.com/large_report.pdf",
    "pages": "1-5"
  }'`} />
            </section>

            <Divider />

            {/* ══ FILL FORMS & SIGN ════════════════════════════ */}
            <section id="annotate" className="scroll-mt-36 mb-20">
                <SectionHeader id="annotate-h" icon={FilePen} title="Fill Forms & Sign" />
                <p className="text-base mb-6 leading-relaxed">
                    Programmatically fill AcroForm fields in a PDF. Optionally apply a digital signature, add text annotations, or flatten the form fields so they can no longer be edited.
                </p>
                <Endpoint method="POST" path="/v1/pdf/form/fill" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL of the fillable PDF form." },
                    { name: "fields", required: true, type: "object", desc: "Key-value map of form field names to their values." },
                    { name: "flatten", type: "boolean", desc: "Flatten form fields after filling so they become non-editable text. Default: false." },
                    { name: "signature", type: "object", desc: "Optional digital signature config: { x, y, page, image_url }." },
                    { name: "password", desc: "Password for encrypted PDFs." },
                ]} />
                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/form/fill" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/agreement.pdf",
    "fields": {
      "full_name": "Alex Nexus",
      "date": "2026-03-03",
      "company": "Nexus Strategic LLC"
    },
    "flatten": true
  }'`} />
                    <ResponseBlock code={`{
  "error": false,
  "status": 200,
  "url": "https://storage.docunexus.com/output/dn_filled_abc.pdf",
  "fieldsPopulated": 3,
  "creditsUsed": 1
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ WATERMARK & ENCRYPT ══════════════════════════ */}
            <section id="watermark" className="scroll-mt-36 mb-20">
                <SectionHeader id="watermark-h" icon={KeyRound} title="Watermark & Encrypt" />
                <p className="text-base mb-6 leading-relaxed">
                    Add dynamic text or image watermarks to any PDF. Supports Handlebars-style variable interpolation in text watermarks (e.g. <code className="text-executive-gold font-mono text-sm">{"{{user}}"}</code>). You can also apply AES-256 password protection and set granular permission flags.
                </p>

                <h3 className="text-lg font-semibold text-white mb-3 font-serif">Add Watermark</h3>
                <Endpoint method="POST" path="/v1/pdf/edit/add/text" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL of the source PDF." },
                    { name: "text", required: true, desc: "Watermark text. Supports {{variables}} for dynamic content." },
                    { name: "x", type: "number", desc: "Horizontal position (percentage or pixels from left)." },
                    { name: "y", type: "number", desc: "Vertical position from top." },
                    { name: "pages", desc: "Pages to watermark. Default: all pages." },
                    { name: "font_size", type: "number", desc: "Font size in points. Default: 40." },
                    { name: "color", desc: "CSS color value (e.g. '#FF0000' or 'rgba(255,0,0,0.3)'). Default: '#CCCCCC'." },
                    { name: "rotation", type: "number", desc: "Rotation angle in degrees. Default: -45." },
                    { name: "opacity", type: "number", desc: "Opacity from 0.0 to 1.0. Default: 0.2." },
                ]} />

                <h3 className="text-lg font-semibold text-white mb-3 font-serif mt-8">Apply Password Protection</h3>
                <Endpoint method="POST" path="/v1/pdf/security/add" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL of the PDF to protect." },
                    { name: "owner_password", required: true, desc: "Owner password (full access, required to change permissions)." },
                    { name: "user_password", desc: "User password required to open and view the document." },
                    { name: "allow_printing", type: "boolean", desc: "Permit printing. Default: true." },
                    { name: "allow_copying", type: "boolean", desc: "Permit text/image copying. Default: false." },
                    { name: "allow_editing", type: "boolean", desc: "Permit form filling and annotation. Default: false." },
                ]} />
                <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/security/add" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/confidential.pdf",
    "owner_password": "secureOwner!2026",
    "user_password": "viewOnly!2026",
    "allow_printing": true,
    "allow_copying": false
  }'`} />
            </section>

            <Divider />

            {/* ══ PDF TO IMAGE ═════════════════════════════════ */}
            <section id="pdf-to-image" className="scroll-mt-36 mb-20">
                <SectionHeader id="pdf-to-image-h" icon={FileImage} title="PDF to Image" />
                <p className="text-base mb-6 leading-relaxed">
                    Render PDF pages as high-resolution PNG or JPEG images. Ideal for generating document thumbnails, preview images, or preparing pages for image-based OCR pipelines.
                </p>
                <Endpoint method="POST" path="/v1/pdf/convert/to/png" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "URL to the source PDF." },
                    { name: "pages", desc: "Page or range to render (e.g. '1', '1-3'). Default: '1'." },
                    { name: "resolution", type: "number", desc: "Output DPI. Higher = sharper. Default: 150. Max: 600." },
                    { name: "format", desc: "'png' or 'jpeg'. Default: 'png'." },
                    { name: "quality", type: "number", desc: "JPEG quality 1–100. Only applies when format is 'jpeg'. Default: 90." },
                    { name: "password", desc: "Password for encrypted PDFs." },
                ]} />
                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/convert/to/png" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/report.pdf",
    "pages": "1",
    "resolution": 200,
    "format": "png"
  }'`} />
                    <ResponseBlock code={`{
  "error": false,
  "status": 200,
  "urls": [
    "https://storage.docunexus.com/output/page_1.png"
  ],
  "pageCount": 1,
  "creditsUsed": 1
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ IMAGE TO PDF ═════════════════════════════════ */}
            <section id="image-to-pdf" className="scroll-mt-36 mb-20">
                <SectionHeader id="image-to-pdf-h" icon={FileImage} title="Image to PDF" />
                <p className="text-base mb-6 leading-relaxed">
                    Convert one or more images (PNG, JPEG, TIFF, BMP) into a PDF document. Each image is placed on its own page, scaled to fit the chosen paper size.
                </p>
                <Endpoint method="POST" path="/v1/pdf/convert/from/image" />
                <ParamTable params={[
                    { name: "urls", required: true, type: "string[]", desc: "Array of image URLs to convert (each becomes one PDF page, in order)." },
                    { name: "paper_size", desc: "Output paper format: 'A4', 'Letter', 'auto'. Default: 'A4'." },
                    { name: "fit_page", type: "boolean", desc: "Scale image to fit within the page margins. Default: true." },
                ]} />
                <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/pdf/convert/from/image" \\
  -H "Authorization: Bearer dn_secret..." \\
  -d '{ "urls": ["https://example.com/scan1.png", "https://example.com/scan2.png"] }'`} />
            </section>

            <Divider />

            {/* ══ BARCODE ══════════════════════════════════════ */}
            <section id="barcode" className="scroll-mt-36 mb-20">
                <SectionHeader id="barcode-h" icon={Barcode} title="Barcode & QR Code Generator" />
                <p className="text-base mb-6 leading-relaxed">
                    Generate barcodes and QR codes as PNG images. Supported formats include QR Code, Code 128, Code 39, EAN-13, DataMatrix, and PDF417.
                </p>
                <Endpoint method="GET" path="/v1/barcode/generate" />
                <ParamTable params={[
                    { name: "type", required: true, desc: "Barcode format: QRCode, Code128, Code39, EAN13, DataMatrix, PDF417." },
                    { name: "value", required: true, desc: "Text or numeric value to encode." },
                    { name: "width", type: "number", desc: "Output width in pixels. Default: 200." },
                    { name: "height", type: "number", desc: "Output height in pixels. Default: 200." },
                    { name: "fg_color", desc: "Foreground (barcode) colour as hex. Default: '#000000'." },
                    { name: "bg_color", desc: "Background colour as hex. Default: '#FFFFFF'." },
                    { name: "error_correction", desc: "QR Code error correction level: L, M, Q, H. Default: M." },
                ]} />
                <div className="grid md:grid-cols-2 gap-4">
                    <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X GET \\
  "https://api.docunexus.com/v1/barcode/generate?type=QRCode&value=https://docunexus.com&width=400&height=400&error_correction=H" \\
  -H "Authorization: Bearer dn_secret..." \\
  -o qr_code.png`} />
                    <ResponseBlock code={`# Returns a PNG image binary directly.
# Use -o qr_code.png in cURL to save.
# Or pass inline=true for a base64 JSON response:

{
  "error": false,
  "status": 200,
  "imageBase64": "iVBORw0KGgo...",
  "format": "png",
  "width": 400,
  "height": 400
}`} />
                </div>
            </section>

            <Divider />

            {/* ══ URL SCREENSHOT ═══════════════════════════════ */}
            <section id="url-to-pdf" className="scroll-mt-36 mb-20">
                <SectionHeader id="url-to-pdf-h" icon={Globe} title="URL Screenshot" />
                <p className="text-base mb-6 leading-relaxed">
                    Capture a full-page or viewport screenshot of any URL as a PNG or JPEG image. Useful for generating visual previews, email thumbnails, or archiving web content.
                </p>
                <Endpoint method="POST" path="/v1/url/screenshot" />
                <ParamTable params={[
                    { name: "url", required: true, desc: "The web page URL to capture." },
                    { name: "format", desc: "'png' or 'jpeg'. Default: 'png'." },
                    { name: "full_page", type: "boolean", desc: "Capture the full scrollable page, not just the viewport. Default: false." },
                    { name: "viewport_width", type: "number", desc: "Browser viewport width in pixels. Default: 1440." },
                    { name: "viewport_height", type: "number", desc: "Browser viewport height in pixels. Default: 900." },
                    { name: "wait_for", desc: "Wait condition: 'load', 'networkidle', or a CSS selector to wait for." },
                    { name: "delay", type: "number", desc: "Additional delay in ms after the wait_for condition is met. Default: 0." },
                ]} />
                <CodeBlock label="Request (cURL)" lang="bash" code={`curl -X POST "https://api.docunexus.com/v1/url/screenshot" \\
  -H "Authorization: Bearer dn_secret..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://www.docunexus.com",
    "full_page": true,
    "viewport_width": 1440,
    "wait_for": "networkidle"
  }'`} />
            </section>

        </div>
    )
}
