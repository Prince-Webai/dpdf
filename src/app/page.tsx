'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, FileJson, Layers, Cpu, Zap, Lock, FileText } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />

        <div className="container px-4 md:px-6 mx-auto text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
              New: AI-Powered Invoice Parsing API available now
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              The modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">PDF API</span><br className="hidden md:block" /> for developers.
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Eliminate PDF processing problems. Extract data, convert to JSON, merge, split, and edit documents with a powerful, developer-friendly API platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-gray-200 text-base rounded-full" asChild>
                <Link href="/signup">
                  Start building for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 border-white/20 text-white hover:bg-white/10 text-base rounded-full" asChild>
                <Link href="/docs">
                  Explore Documentation
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 relative mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 h-full w-full" />
            <div className="rounded-xl border border-white/10 bg-black/50 p-2 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center border-b border-white/10 px-4 py-3 bg-[#0a0a0a]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="mx-auto text-xs text-gray-500">api.docunexu.com/v1/extract</div>
              </div>
              <pre className="p-6 text-sm text-left overflow-x-auto text-gray-300 font-mono bg-[#0a0a0a]">
                <code>
                  <span className="text-pink-400">curl</span> -X POST https://api.docunexu.com/v1/pdf/extract \<br />
                  {"  "} -H <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                  {"  "} -H <span className="text-green-400">"Content-Type: application/json"</span> \<br />
                  {"  "} -d <span className="text-yellow-300">{"'{ \"url\": \"https://example.com/invoice.pdf\", \"format\": \"json\" }'"}</span><br />
                  <br />
                  <span className="text-gray-500">// Response</span><br />
                  {"{"}<br />
                  {"  "}<span className="text-indigo-400">"status"</span>: <span className="text-green-400">"success"</span>,<br />
                  {"  "}<span className="text-indigo-400">"data"</span>: {"{"}<br />
                  {"    "}<span className="text-indigo-400">"invoice_number"</span>: <span className="text-green-400">"INV-2024-001"</span>,<br />
                  {"    "}<span className="text-indigo-400">"total_amount"</span>: <span className="text-orange-400">1250.00</span>,<br />
                  {"    "}<span className="text-indigo-400">"line_items"</span>: [...]<br />
                  {"  "}{"}"}<br />
                  {"}"}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Animated Scroll Section */}
      <section className="py-32 relative">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Powerful PDF tools you can integrate in minutes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Everything you need to automate your document workflows, completely re-engineered for the modern web.
            </motion.p>
          </div>

          <div className="space-y-32">
            {/* Feature 1: Left Text, Right Visual */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex-1 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <FileJson className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">AI-Powered Extraction</h3>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Say goodbye to rigid templates. Our Document Parser and built-in AI models turn complex PDF invoices, receipts, and forms into clean, standardized JSON automatically with unmatched precision.
                </p>
                <ul className="space-y-3 mt-6">
                  {['Extract text, tables, and form fields', 'No zonal OCR mapping required', 'Supports scanned documents (OCR)'].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <div className="mr-3 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="flex-1 relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
                style={{ perspective: "1000px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent z-0" />
                <div className="absolute inset-4 border border-indigo-500/20 rounded-xl bg-black/50 backdrop-blur-sm p-6 overflow-hidden flex flex-col items-center justify-center transform hover:scale-[1.02] transition-transform duration-500">
                  <Cpu className="w-32 h-32 text-indigo-500/50 mb-8" />
                  <div className="w-full h-8 bg-indigo-500/20 rounded-md mb-2 animate-pulse" />
                  <div className="w-3/4 h-8 bg-indigo-500/20 rounded-md animate-pulse delay-75" />
                </div>
              </motion.div>
            </div>

            {/* Feature 2: Right Text, Left Visual */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex-1 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <Layers className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">Merge, Split & Convert</h3>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Combine thousands of pages flawlessly, split massive archives by page ranges, or convert PDFs into responsive HTML, images (JPG/PNG), or editable spreadsheets.
                </p>
                <ul className="space-y-3 mt-6">
                  {['Intelligent bookmark merging', 'Split by text search or barcode', 'Preserves original document formatting'].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <div className="mr-3 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="flex-1 relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
                style={{ perspective: "1000px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-cyan-900/20 to-transparent z-0" />
                <div className="absolute inset-4 border border-cyan-500/20 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center gap-4 transform hover:scale-[1.02] transition-transform duration-500">
                  <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="w-24 h-32 bg-cyan-900/40 border border-cyan-500/50 rounded-lg shadow-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-cyan-400" />
                  </motion.div>
                  <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }} className="w-24 h-32 bg-blue-900/40 border border-blue-500/50 rounded-lg shadow-2xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Feature 3: Center Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#111] to-[#0a0a0a] p-12 text-center relative overflow-hidden group"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700" />
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-500">
                  <Code className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-6">HTML & URL to PDF Generation</h3>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                  Our advanced rendering engine generates pixel-perfect PDFs from raw HTML, CSS templates, or live URLs, supporting modern web standards, custom fonts, and intricate layouts.
                </p>
                <Button size="lg" className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-base" asChild>
                  <Link href="/docs">View the HTML to PDF Guide</Link>
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Security Section with particles */}
      <section className="py-32 relative border-y border-white/10 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="container px-4 md:px-6 mx-auto text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.2)] mb-8"
          >
            <Lock className="w-10 h-10 text-green-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-8"
          >
            Enterprise-grade security built-in
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-400 mb-10 leading-relaxed font-light"
          >
            Your data is encrypted at rest (AES-256) and in transit (TLS 1.2+). We strictly adhere to GDPR, HIPAA, and SOC2 compliance standards.
            <span className="text-white font-medium block mt-4">Processed files are permanently destroyed within minutes.</span>
          </motion.p>
        </div>
      </section>

      {/* Hero-style CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black -z-10" />
        <div className="absolute inset-0 bg-transparent flex justify-center items-end opacity-20 -z-10">
          <div className="w-[1000px] h-[500px] bg-indigo-500 rounded-full blur-[150px] translate-y-1/2" />
        </div>

        <div className="container px-4 md:px-6 mx-auto text-center max-w-4xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Ready to automate your documents?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-indigo-200/70 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of developers building the future of document processing. Get 500 free API credits when you sign up.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all text-xl rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)]" asChild>
              <Link href="/signup">
                Create free account <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
