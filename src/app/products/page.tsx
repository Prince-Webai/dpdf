'use client'

import { ArrowRight, FileJson, Layers, Cpu, Zap, Lock, FileText, Pentagon, Sparkles, Code2, Globe, ShieldCheck, BarChart3, Workflow, Binary, ScanLine, FilePen, FileOutput, Combine, Scissors, KeyRound, ChevronRight } from "lucide-react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

/* ── Data ─────────────────────────────────────────────────── */
const stats = [
    { value: "99.9%", label: "Uptime SLA" },
    { value: "<400ms", label: "Avg Response" },
    { value: "10M+", label: "API Calls / Day" },
    { value: "AES-256", label: "Encryption" },
    { value: "TLS 1.3", label: "In-Transit" },
    { value: "SOC 2", label: "Compliant" },
]

const categories = [
    {
        id: "extraction",
        tag: "Intelligence Layer",
        icon: ScanLine,
        color: "text-blue-400",
        glow: "rgba(96,165,250,0.12)",
        borderGlow: "rgba(96,165,250,0.2)",
        title: "Data Extraction",
        headline: "Turn any PDF into structured intelligence.",
        description: "Our AI models parse layouts, tables, and handwriting without brittle templates — delivering structured JSON on the first call.",
        products: [
            {
                icon: FileJson,
                name: "Document Parser API",
                desc: "Extract text, tables, and structured fields using ML-driven layout analysis — no templates required.",
                tags: ["Template-free", "Multi-page", "High-fidelity OCR"],
                codeSnippet: `POST /v1/extract
{
  "url": "https://vault.nexus/report.pdf",
  "mode": "structured_json"
}`,
            },
            {
                icon: Binary,
                name: "PDF → JSON / CSV / XML",
                desc: "Convert complex PDFs into machine-readable formats while preserving table hierarchies and nested structures.",
                tags: ["Table preservation", "Batch processing", "Streaming"],
                codeSnippet: `POST /v1/convert
{
  "format": "csv",
  "preserve_tables": true
}`,
            },
            {
                icon: BarChart3,
                name: "Invoice & Receipt Parser",
                desc: "Purpose-built financial document AI that captures every line item, tax, and total — across 40+ languages.",
                tags: ["Line-item extraction", "Multi-currency", "40+ languages"],
                codeSnippet: `POST /v1/invoice/parse
{
  "detect_currency": true,
  "output": "line_items"
}`,
            },
        ],
    },
    {
        id: "manipulation",
        tag: "Operations Layer",
        icon: Workflow,
        color: "text-purple-400",
        glow: "rgba(192,132,252,0.12)",
        borderGlow: "rgba(192,132,252,0.2)",
        title: "PDF Manipulation",
        headline: "Surgical control over every byte.",
        description: "Merge, split, watermark, encrypt — complete programmatic sovereignty over your PDF assets at enterprise scale.",
        products: [
            {
                icon: Combine,
                name: "Merge & Split APIs",
                desc: "Combine hundreds of PDFs or slice a document into page ranges — preserving bookmarks and metadata.",
                tags: ["Bookmark preservation", "Page ranges", "Bulk ops"],
                codeSnippet: `POST /v1/merge
{
  "files": ["a.pdf", "b.pdf"],
  "preserve_bookmarks": true
}`,
            },
            {
                icon: KeyRound,
                name: "Watermark & Encrypt",
                desc: "Dynamic text and image watermarks with position control. AES-256 password protection with permission matrices.",
                tags: ["Dynamic variables", "AES-256", "Permission masks"],
                codeSnippet: `POST /v1/watermark
{
  "text": "CONFIDENTIAL - {{user}}",
  "opacity": 0.15
}`,
            },
            {
                icon: FilePen,
                name: "Edit & Annotate",
                desc: "Fill AcroForms, apply digital signatures, append pages, and flatten annotations — all via REST.",
                tags: ["AcroForm fill", "Digital signatures", "Flattening"],
                codeSnippet: `POST /v1/form/fill
{
  "fields": { "name": "Nexus LLC" },
  "flatten": true
}`,
            },
        ],
    },
    {
        id: "generation",
        tag: "Creation Layer",
        icon: FileOutput,
        color: "text-emerald-400",
        glow: "rgba(52,211,153,0.12)",
        borderGlow: "rgba(52,211,153,0.2)",
        title: "Document Generation",
        headline: "Create pixel-perfect PDFs from any source.",
        description: "From HTML templates to raw JSON data — generate branded, production-ready documents at any volume.",
        products: [
            {
                icon: Globe,
                name: "HTML / URL → PDF",
                desc: "Render web pages as pixel-perfect PDFs. Inject custom CSS, wait for network idle, control page breaks.",
                tags: ["Network idle wait", "Custom CSS", "Page breaks"],
                codeSnippet: `POST /v1/html-to-pdf
{
  "url": "https://app.nexus/report",
  "wait_for": "networkidle"
}`,
            },
            {
                icon: Code2,
                name: "Document Builder",
                desc: "Generate dynamic PDFs from JSON data + Handlebars templates. Supports custom fonts, tables, and headers.",
                tags: ["JSON templates", "Dynamic tables", "Custom fonts"],
                codeSnippet: `POST /v1/generate
{
  "template_id": "invoice_v3",
  "data": { "total": 1250 }
}`,
            },
        ],
    },
]

const comparisonFeatures = [
    { name: "AI-powered extraction", ours: true, basic: false, other: false },
    { name: "Sub-400ms response", ours: true, basic: false, other: true },
    { name: "AES-256 encryption", ours: true, basic: true, other: false },
    { name: "Batch processing", ours: true, basic: false, other: true },
    { name: "Multi-language OCR", ours: true, basic: false, other: false },
    { name: "Webhook support", ours: true, basic: true, other: true },
    { name: "Real-time logs", ours: true, basic: false, other: false },
    { name: "SOC 2 compliance", ours: true, basic: false, other: false },
]

/* ── Sub-components ────────────────────────────────────────── */

function FloatingParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
    return (
        <motion.div
            className="absolute w-[1px] h-[1px] bg-executive-gold/40 rounded-full"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2, 0], y: [0, -40, -80] }}
            transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeOut" }}
        />
    )
}

function ProductCard({ product, index, color }: { product: typeof categories[0]["products"][0]; index: number; color: string }) {
    const [hovered, setHovered] = useState(false)
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative bg-executive-panel/40 border border-white/5 backdrop-blur-sm flex flex-col group overflow-hidden cursor-default"
        >
            {/* Animated top border */}
            <motion.div
                className={`absolute top-0 left-0 h-[1px] ${color.replace("text-", "bg-")} opacity-0 group-hover:opacity-100`}
                initial={{ width: 0 }}
                animate={{ width: hovered ? "100%" : 0 }}
                transition={{ duration: 0.5 }}
            />

            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-black border border-white/5 group-hover:border-white/10 transition-colors duration-500">
                        <product.icon className={`w-5 h-5 stroke-[1px] ${color}`} />
                    </div>
                    <motion.div
                        animate={{ x: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight className={`w-4 h-4 ${color}`} />
                    </motion.div>
                </div>

                <h3 className="text-xl font-serif text-white mb-3 group-hover:text-executive-gold transition-colors duration-300">{product.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light flex-1 mb-6">{product.desc}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map(tag => (
                        <span key={tag} className="text-[9px] tracking-[0.15em] uppercase text-white/20 border border-white/5 px-2 py-1 font-bold">{tag}</span>
                    ))}
                </div>

                {/* Code snippet */}
                <motion.div
                    animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                >
                    <div className="border-t border-white/5 pt-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500/70 animate-pulse" />
                            <span className="text-[9px] tracking-[0.2em] uppercase text-white/20 font-bold">Live Request</span>
                        </div>
                        <pre className="text-[10px] font-mono text-emerald-400/70 leading-relaxed overflow-x-auto whitespace-pre-wrap">{product.codeSnippet}</pre>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function ProductsPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const heroRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: containerRef })
    const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
    const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60])

    const [activeCategory, setActiveCategory] = useState("extraction")
    const [particles] = useState(() =>
        Array.from({ length: 20 }, (_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 4,
        }))
    )

    return (
        <div ref={containerRef} className="flex min-h-screen bg-executive-black text-white selection:bg-executive-gold selection:text-black relative flex-col overflow-hidden">
            <div className="executive-grain" />

            {/* ── Background ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-executive-gold/5 blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-500/5 blur-[150px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/3 blur-[200px]" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156,130,74,0.6) 1px, transparent 0)`,
                        backgroundSize: "48px 48px",
                    }}
                />
                {/* Horizontal lines */}
                {[20, 40, 60, 80].map(pct => (
                    <div key={pct} className="absolute w-full h-[1px] bg-white/[0.02]" style={{ top: `${pct}%` }} />
                ))}
            </div>

            <div className="flex flex-col relative z-10 pt-24 pb-40">

                {/* ══ HERO ══════════════════════════════════════════════ */}
                <motion.section
                    ref={heroRef}
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center"
                >
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative max-w-6xl mx-auto"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 border border-executive-gold/20 bg-executive-gold/5 px-5 py-2.5 text-[10px] tracking-[0.4em] uppercase text-executive-gold mb-14 backdrop-blur-md shadow-[0_0_30px_rgba(156,130,74,0.08)]"
                        >
                            <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: "10s" }} />
                            <span>The Nexus Component Library</span>
                            <span className="w-1 h-1 bg-executive-gold/40 rounded-full" />
                            <span className="text-executive-gold/50">8 Modules</span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-6xl md:text-8xl lg:text-[110px] font-serif font-normal leading-[0.95] tracking-tighter mb-10">
                            <span className="block overflow-hidden">
                                <motion.span
                                    className="block"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    Strategic
                                </motion.span>
                            </span>
                            <span className="block overflow-hidden">
                                <motion.span
                                    className="block text-white/25 italic"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    Capabilities.
                                </motion.span>
                            </span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 1 }}
                            className="text-xl md:text-2xl text-white/35 max-w-2xl mx-auto font-light tracking-wide leading-relaxed mb-16"
                        >
                            From machine-learning document analysis to surgical PDF manipulation.
                            Every module built for production — at every scale.
                        </motion.p>

                        {/* CTA Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="flex flex-col sm:flex-row justify-center gap-5"
                        >
                            <Link href="/signup" className="group relative">
                                <div className="absolute -inset-0.5 bg-executive-gold blur-md opacity-20 group-hover:opacity-50 transition duration-500" />
                                <button className="relative h-14 px-12 bg-executive-gold text-black text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-500 flex items-center gap-2 group-hover:bg-white">
                                    Deploy Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Button size="lg" variant="outline" asChild className="h-14 px-10 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-none transition-all duration-500">
                                <Link href="/docs">View API Docs</Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Scroll cue */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    >
                        <span className="text-[9px] tracking-[0.35em] uppercase text-white/15">Explore Modules</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-[1px] h-10 bg-gradient-to-b from-executive-gold/40 to-transparent"
                        />
                    </motion.div>
                </motion.section>

                {/* ══ STATS BAR ════════════════════════════════════════ */}
                <section className="relative py-0 overflow-hidden">
                    <div className="border-y border-white/5 bg-executive-panel/30 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex overflow-x-auto"
                        >
                            {stats.map((stat, i) => (
                                <div key={i} className="flex-1 min-w-[140px] px-8 py-8 border-r border-white/5 last:border-r-0 text-center group">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 }}
                                    >
                                        <div className="text-2xl font-serif text-white group-hover:text-executive-gold transition-colors duration-300 mb-1">{stat.value}</div>
                                        <div className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-bold">{stat.label}</div>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ══ CATEGORY TABS ════════════════════════════════════ */}
                <section className="py-32 relative">
                    <div className="container px-4 md:px-8 mx-auto max-w-7xl">

                        {/* Section header */}
                        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-executive-gold text-[10px] tracking-[0.5em] uppercase font-bold block mb-4"
                                >
                                    Product Suite
                                </motion.span>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl md:text-6xl font-serif leading-tight"
                                >
                                    Three layers.<br />
                                    <span className="text-white/30 italic">Infinite capability.</span>
                                </motion.h2>
                            </div>

                            {/* Tab switcher */}
                            <div className="flex gap-1 p-1 border border-white/5 bg-executive-panel/40 backdrop-blur-sm">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`px-5 py-2.5 text-[9px] tracking-[0.25em] uppercase font-bold transition-all duration-300 ${activeCategory === cat.id ? "bg-executive-gold text-black" : "text-white/30 hover:text-white/60"}`}
                                    >
                                        {cat.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category sections */}
                        {categories.map((category, catIndex) => (
                            <div key={category.id} className={`mb-40 last:mb-0 ${activeCategory !== category.id && categories.findIndex(c => c.id === activeCategory) !== catIndex ? "" : ""}`}>

                                {/* Category header strip */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7 }}
                                    className="flex flex-col lg:flex-row lg:items-center gap-10 mb-16 pb-12 border-b border-white/5"
                                >
                                    {/* Left: icon + label */}
                                    <div className="flex items-center gap-6 flex-shrink-0">
                                        <div
                                            className="w-16 h-16 flex items-center justify-center border border-white/5"
                                            style={{ background: category.glow }}
                                        >
                                            <category.icon className={`w-7 h-7 stroke-[1px] ${category.color}`} />
                                        </div>
                                        <div>
                                            <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-white/20 block mb-1">{category.tag}</span>
                                            <h3 className="text-3xl md:text-5xl font-serif">{category.title}</h3>
                                        </div>
                                    </div>

                                    {/* Right: headline + description */}
                                    <div className="lg:ml-auto lg:max-w-lg">
                                        <p className={`text-lg font-serif italic ${category.color} mb-2`}>{category.headline}</p>
                                        <p className="text-white/35 text-sm leading-relaxed font-light">{category.description}</p>
                                    </div>
                                </motion.div>

                                {/* Product cards */}
                                <div className={`grid md:grid-cols-2 ${category.products.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}>
                                    {category.products.map((product, i) => (
                                        <ProductCard key={product.name} product={product} index={i} color={category.color} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══ COMPARISON ═══════════════════════════════════════ */}
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-executive-gold/[0.015] to-transparent" />
                    <div className="container px-4 md:px-8 mx-auto max-w-4xl relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <span className="text-executive-gold text-[10px] tracking-[0.5em] uppercase font-bold block mb-4">Why DocuNexus</span>
                            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                                The unfair <span className="text-white/30 italic">advantage.</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="border border-white/5 overflow-hidden"
                        >
                            {/* Table header */}
                            <div className="grid grid-cols-4 border-b border-white/5 bg-executive-panel/50">
                                <div className="p-6 text-[10px] tracking-[0.3em] uppercase text-white/20 font-bold">Feature</div>
                                <div className="p-6 text-center">
                                    <div className="text-executive-gold text-[10px] tracking-[0.25em] uppercase font-bold">DocuNexus</div>
                                </div>
                                <div className="p-6 text-center">
                                    <div className="text-white/25 text-[10px] tracking-[0.25em] uppercase font-bold">Basic APIs</div>
                                </div>
                                <div className="p-6 text-center">
                                    <div className="text-white/25 text-[10px] tracking-[0.25em] uppercase font-bold">Competitors</div>
                                </div>
                            </div>

                            {/* Table rows */}
                            {comparisonFeatures.map((feat, i) => (
                                <motion.div
                                    key={feat.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06 }}
                                    className="grid grid-cols-4 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <div className="p-5 text-sm text-white/40 font-light group-hover:text-white/60 transition-colors">{feat.name}</div>
                                    <div className="p-5 flex justify-center items-center">
                                        {feat.ours ? (
                                            <div className="w-5 h-5 bg-executive-gold/10 border border-executive-gold/30 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-executive-gold rounded-none" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 bg-white/[0.02] border border-white/5 flex items-center justify-center">
                                                <div className="w-1.5 h-[1px] bg-white/15" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex justify-center items-center">
                                        {feat.basic ? (
                                            <div className="w-5 h-5 bg-white/5 border border-white/10 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white/30 rounded-none" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <div className="w-1.5 h-[1px] bg-white/10" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex justify-center items-center">
                                        {feat.other ? (
                                            <div className="w-5 h-5 bg-white/5 border border-white/10 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white/30 rounded-none" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                <div className="w-1.5 h-[1px] bg-white/10" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ══ INTEGRATION SHOWCASE ═════════════════════════════ */}
                <section className="py-24 relative">
                    <div className="container px-4 md:px-8 mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left text */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="text-executive-gold text-[10px] tracking-[0.5em] uppercase font-bold block mb-6">Developer First</span>
                                <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
                                    Integrate in <span className="italic text-white/30">minutes,</span><br />
                                    not months.
                                </h2>
                                <p className="text-white/35 leading-relaxed font-light mb-10 text-sm">
                                    RESTful APIs with consistent, predictable responses. Comprehensive SDK support for Python, Node.js, PHP, Go, and Java. Every endpoint is versioned and backward-compatible.
                                </p>
                                <div className="space-y-4">
                                    {["Consistent JSON responses across all endpoints", "SDKs for 6 languages with TypeScript types", "Webhook delivery with retry and backoff", "Sandbox environment for every account"].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-1 h-1 bg-executive-gold flex-shrink-0" />
                                            <span className="text-sm text-white/40 font-light">{item}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Right: live code terminal */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-br from-executive-gold/10 via-transparent to-indigo-500/10 blur-2xl opacity-60 group-hover:opacity-100 transition duration-1000" />
                                <div className="relative border border-white/8 bg-black/70 backdrop-blur-2xl overflow-hidden">
                                    {/* Terminal chrome */}
                                    <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                                        <span className="ml-4 text-[10px] tracking-[0.2em] uppercase text-white/20 font-mono">docunexus.js — integration example</span>
                                    </div>
                                    <div className="p-7 font-mono text-sm leading-relaxed">
                                        <div className="text-white/20 mb-1 text-xs">// Install the SDK</div>
                                        <div className="text-emerald-400/80 mb-5">$ npm install @docunexus/sdk</div>
                                        <div className="text-white/20 mb-1 text-xs">// Initialize & extract</div>
                                        <div>
                                            <span className="text-blue-400/80">import</span>
                                            <span className="text-white/60"> {"{"} DocuNexus {"}"} </span>
                                            <span className="text-blue-400/80">from</span>
                                            <span className="text-emerald-400/60"> '@docunexus/sdk'</span>
                                        </div>
                                        <div className="mt-3">
                                            <span className="text-purple-400/80">const</span>
                                            <span className="text-white/60"> nexus = </span>
                                            <span className="text-yellow-400/80">new</span>
                                            <span className="text-white/60"> DocuNexus(</span>
                                            <span className="text-emerald-400/60">process.env.DN_KEY</span>
                                            <span className="text-white/60">)</span>
                                        </div>
                                        <div className="mt-4">
                                            <span className="text-purple-400/80">const</span>
                                            <span className="text-white/60"> result = </span>
                                            <span className="text-blue-400/80">await</span>
                                            <span className="text-white/60"> nexus.extract({"{"}</span>
                                        </div>
                                        <div className="pl-4 text-white/50">
                                            <div>url: <span className="text-emerald-400/60">'https://vault.nexus/doc.pdf'</span>,</div>
                                            <div>mode: <span className="text-emerald-400/60">'structured_json'</span>,</div>
                                            <div>fields: [<span className="text-emerald-400/60">'total'</span>, <span className="text-emerald-400/60">'vendor'</span>]</div>
                                        </div>
                                        <div className="text-white/60">{"}"});</div>
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <div className="text-white/20 text-xs mb-2">// Response</div>
                                            <div className="text-emerald-400/70 text-xs">{"{"} status: 'ok', confidence: 0.997, data: {"{"} total: 1250, vendor: 'Nexus LLC' {"}"} {"}"}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ══ FINAL CTA ════════════════════════════════════════ */}
                <section className="py-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-executive-gold/[0.018] z-0" />
                    {/* Animated radial sweep */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(156,130,74,0.06), transparent)" }}
                    />

                    <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-4xl mx-auto"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="w-14 h-14 mx-auto mb-14 opacity-30"
                            >
                                <Pentagon className="w-full h-full text-executive-gold" strokeWidth={0.5} />
                            </motion.div>

                            <h2 className="text-5xl md:text-8xl font-serif mb-10 tracking-tight">
                                Automate at<br />
                                <span className="text-white/25 italic">quantum scale.</span>
                            </h2>
                            <p className="text-xl text-white/35 mb-16 max-w-xl mx-auto font-light leading-relaxed">
                                Join elite development teams orchestrating mission-critical
                                document workflows at scale with DocuNexus.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-5">
                                <Link href="/signup" className="group relative inline-block">
                                    <div className="absolute -inset-1 bg-white blur opacity-5 group-hover:opacity-20 transition duration-500" />
                                    <button className="relative h-16 px-14 bg-executive-gold text-black text-[11px] tracking-[0.3em] font-bold uppercase transition-all duration-500 hover:bg-white flex items-center gap-2">
                                        Initiate Integration <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Button size="lg" variant="outline" asChild className="h-16 px-10 border border-white/10 text-white/40 hover:text-white hover:bg-white/5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-none transition-all duration-500">
                                    <Link href="/pricing">View Pricing</Link>
                                </Button>
                            </div>

                            <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20 px-8">
                                {["Global Secure", "Enterprise API", "Quantum Scaling", "Strategic Data"].map(label => (
                                    <span key={label} className="font-serif italic text-lg whitespace-nowrap">{label}</span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    )
}
