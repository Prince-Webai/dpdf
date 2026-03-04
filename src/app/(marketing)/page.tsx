'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Layers,
  Zap,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Edit,
  Bot,
  FileJson,
  Barcode,
  Merge,
  Code2,
  Database,
  ArrowRight,
  Code,
  Lock,
  FileText,
  Check,
  Copy,
  Cpu,
  Sparkles,
  Pentagon
} from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

// Constant array of all services for the marquee
const SERVICES = [
  "AI Invoice Parsing", "PDF to Excel", "Merge Documents", "Split Pages", "HTML to PDF",
  "Image to PDF", "Redact Text", "Fill PDF Forms", "E-Signatures", "Read Barcodes",
  "Generate QR", "Compress PDF", "Encrypt & Secure", "OCR Text Extraction"
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const [ctaHref, setCtaHref] = useState("/signup")
  const [copiedScript, setCopiedScript] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setCtaHref("/dashboard")
      }
    }
    checkAuth()
  }, [])

  const copyCode = () => {
    const code = `curl -X POST https://api.docunexu.com/v1/pdf/extract \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://example.com/invoice.pdf", "format": "json" }'`;
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#020202] overflow-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Tech Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: 'linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)'
        }}
      />

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[150px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 md:pt-48 md:pb-24 px-4 md:px-6 z-10"
        style={{ opacity, scale }}
      >
        <div className="container mx-auto text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 text-white leading-[1.1] max-w-5xl"
          >
            The Ultimate Engine for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">PDF Generation & AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Instantly merge, split, generate, and intelligently extract data from any PDF. A massive array of document services behind one beautifully simple, stateless API.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center gap-4 items-center w-full"
          >
            <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 font-bold hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-full w-full sm:w-auto" asChild>
              <Link href={ctaHref}>
                Start Building Free <ChevronRight className="ml-2 w-5 h-5 opacity-50" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all rounded-full w-full sm:w-auto font-medium bg-black/50 backdrop-blur-md" asChild>
              <Link href="/docs">
                <Code2 className="mr-2 w-5 h-5 text-gray-400" /> Read the Docs
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Infinite Scrolling Services Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="w-full relative z-10 py-6 border-y border-white/5 bg-[#050505]/80 backdrop-blur-xl overflow-hidden flex"
      >
        <div className="flex gap-10 whitespace-nowrap animate-[marquee_40s_linear_infinite] px-4">
          {[...SERVICES, ...SERVICES, ...SERVICES].map((service, i) => (
            <div key={i} className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-blue-500/50" />
              <span className="text-gray-400 font-mono text-sm uppercase tracking-[0.2em] font-semibold">{service}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Code Sandbox View */}
      <section className="py-32 relative z-10">
        <div className="container px-4 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-black/50 backdrop-blur-3xl overflow-hidden shadow-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0a0a0a]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                <Terminal className="w-3 h-3" /> api.docunexu.com/v1/extract
              </div>
              <button onClick={copyCode} className="text-gray-500 hover:text-white transition-colors" aria-label="Copy code">
                {copiedScript ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
              <pre className="p-8 text-sm text-left overflow-x-auto text-gray-300 font-mono bg-[#050505] flex-1">
                <code>
                  <span className="text-pink-400">curl</span> -X POST https://api.docunexu.com/v1/pdf/extract \<br />
                  {"  "} -H <span className="text-green-400">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                  {"  "} -H <span className="text-green-400">"Content-Type: application/json"</span> \<br />
                  {"  "} -d <span className="text-yellow-300">{"'{ \"url\": \"invoice.pdf\", \"format\": \"json\" }'"}</span><br />
                  <br />
                  <span className="text-gray-500">// Response</span><br />
                  {"{"}<br />
                  {"  "}<span className="text-indigo-400">"status"</span>: <span className="text-green-400">"success"</span>,<br />
                  {"  "}<span className="text-indigo-400">"data"</span>: {"{"}<br />
                  {"    "}<span className="text-indigo-400">"invoice_id"</span>: <span className="text-green-400">"INV-2024"</span>,<br />
                  {"    "}<span className="text-indigo-400">"total"</span>: <span className="text-orange-400">1250.00</span><br />
                  {"  "}{"}"}<br />
                  {"}"}
                </code>
              </pre>
              <div className="md:w-72 bg-[#080808] p-8 flex flex-col justify-center gap-6">
                <div className="space-y-2">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Latency</p>
                  <p className="text-2xl font-black text-white">142ms</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Reliability</p>
                  <p className="text-2xl font-black text-white">99.99%</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <Link href="/docs" className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-2">
                    Documentation <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Array of Services Grid */}
      <section className="py-24 relative z-10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Layers className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white tracking-tight">The complete array of <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">PDF capabilities</span></h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">Stop using rigid templates and disparate legacy libraries. Our unified API gives you professional programmatic control over every byte of your documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Bot}
              title="AI Invoice & Receipt Parsing"
              desc="No templates needed. Automatically turn unstructured PDF invoices, receipts, and forms into precise, standardized JSON using LLM technology."
              delay={0}
              gradient="from-emerald-500/10 to-transparent"
              borderHover="hover:border-emerald-500/30"
              iconColor="text-emerald-400"
            />
            <FeatureCard
              icon={FileJson}
              title="PDF to Anything (Conversion)"
              desc="Extract high-quality text and seamlessly convert layouts directly into Excel, CSV, XML, JSON, HTML, and high-res image formats."
              delay={0.1}
              gradient="from-blue-500/10 to-transparent"
              borderHover="hover:border-blue-500/30"
              iconColor="text-blue-400"
            />
            <FeatureCard
              icon={Merge}
              title="Merge & Split Documents"
              desc="Combine hundreds of different PDF files into a massive master document, or split dynamic reports into exact individual pages."
              delay={0.2}
              gradient="from-indigo-500/10 to-transparent"
              borderHover="hover:border-indigo-500/30"
              iconColor="text-indigo-400"
            />
            <FeatureCard
              icon={Code2}
              title="HTML, CSS & Images to PDF"
              desc="Create pixel-perfect, secure PDF documents directly from raw HTML strings, complex CSS layouts, or varying image formats."
              delay={0.3}
              gradient="from-purple-500/10 to-transparent"
              borderHover="hover:border-purple-500/30"
              iconColor="text-purple-400"
            />
            <FeatureCard
              icon={Edit}
              title="Edit, Redact & Sign"
              desc="Add text overlays, append images, insert e-signatures, fill out form fields programmatically, or permanently redact sensitive text."
              delay={0.4}
              gradient="from-rose-500/10 to-transparent"
              borderHover="hover:border-rose-500/30"
              iconColor="text-rose-400"
            />
            <FeatureCard
              icon={Barcode}
              title="Barcode Reading & Generation"
              desc="Generate high-quality QR codes and 1D/2D barcodes. Scan and decode them accurately even from corrupted or blurry legacy PDFs."
              delay={0.5}
              gradient="from-cyan-500/10 to-transparent"
              borderHover="hover:border-cyan-500/30"
              iconColor="text-cyan-400"
            />
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

      {/* Final CTA */}
      <section className="py-32 relative z-10 overflow-hidden mt-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020202] to-[#020202] pointer-events-none" />
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="container px-4 mx-auto text-center relative z-10 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-2xl rotate-12 group transition-all duration-500 hover:rotate-0 hover:scale-110">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Ready to orchestrate PDFs?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Integrate our enterprise-grade architecture in minutes. Generous free tier provided. No credit card required.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-all font-bold" asChild>
              <Link href={ctaHref}>
                {ctaHref === "/dashboard" ? "Go to Dashboard" : "Create an Account"}
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, delay, gradient, borderHover, iconColor }: { icon: any, title: string, desc: string, delay: number, gradient: string, borderHover: string, iconColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.2 }}
      className={`p-[2px] rounded-3xl bg-white/5 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/5 transition-all group shadow-xl hover:shadow-2xl hover:-translate-y-1 ${borderHover}`}
    >
      <div className="bg-[#0a0a0a] rounded-[22px] p-8 h-full relative overflow-hidden flex flex-col">
        {/* Hover Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative z-10 flex flex-col h-full gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/5 transition-all duration-300 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-100 transition-colors">{title}</h3>
            <p className="text-sm font-medium text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
