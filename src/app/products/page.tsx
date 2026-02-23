'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, FileJson, Layers, Cpu, Zap, Lock, FileText, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const products = [
    {
        category: "Data Extraction",
        icon: FileJson,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/20",
        items: [
            {
                title: "Document Parser API",
                description: "Extract text, tables, and specific data points from PDFs using pre-defined or custom templates.",
                features: ["Template-based extraction", "Multi-page support", "High-fidelity OCR"]
            },
            {
                title: "PDF to JSON / CSV / XML",
                description: "Convert unstructured PDF documents into structured, machine-readable data formats instantly.",
                features: ["Preserve table structures", "Handle complex layouts", "Batch processing"]
            },
            {
                title: "Invoice & Receipt Parser",
                description: "Purpose-built AI models to automatically identify and extract key-value pairs from financial documents.",
                features: ["Line-item extraction", "Multi-currency support", "No templates required"]
            }
        ]
    },
    {
        category: "PDF Manipulation",
        icon: Layers,
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/20",
        items: [
            {
                title: "Merge & Split APIs",
                description: "Combine multiple PDF files into one, or split a large document into individual pages or ranges.",
                features: ["Preserve bookmarks", "High-speed processing", "Handle massive files"]
            },
            {
                title: "Watermark & Secure",
                description: "Add text or image watermarks, set passwords, and manage permissions on your PDF documents.",
                features: ["Dynamic text variables", "Opacity control", "AES-256 encryption"]
            },
            {
                title: "Edit & Annotate",
                description: "Programmatically fill PDF forms, add signatures, or append new pages to existing documents.",
                features: ["AcroForm support", "Digital signatures", "Flattening"]
            }
        ]
    },
    {
        category: "Document Generation",
        icon: FileText,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/20",
        items: [
            {
                title: "HTML / URL to PDF",
                description: "Convert complex web pages or raw HTML code into pixel-perfect PDF documents.",
                features: ["Wait for network idle", "Custom CSS injection", "Page breaks support"]
            },
            {
                title: "Document Builder",
                description: "Generate dynamic PDFs from scratch using JSON data and customizable templates.",
                features: ["Header/Footer management", "Dynamic recurring tables", "Custom fonts"]
            }
        ]
    }
]

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen pt-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black -z-10" />

                <div className="container px-4 md:px-6 mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">PDF Toolset</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            Everything you need to build powerful document workflows. From simple HTML to PDF conversions to advanced AI-driven data extraction spanning millions of pages.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-gray-200 text-base rounded-full" asChild>
                                <Link href="/signup">
                                    Get API Key <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 border-white/20 text-white hover:bg-white/10 text-base rounded-full" asChild>
                                <Link href="/docs">
                                    Read Requirements
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-20 relative">
                <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                    <div className="space-y-32">
                        {products.map((category, index) => (
                            <motion.div
                                key={category.category}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
                                    <div className={`p-3 rounded-xl ${category.bgColor} ${category.borderColor} border`}>
                                        <category.icon className={`h-8 w-8 ${category.color}`} />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold">{category.category}</h2>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {category.items.map((item, itemIndex) => (
                                        <div
                                            key={item.title}
                                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors group flex flex-col h-full"
                                        >
                                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                            <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                                                {item.description}
                                            </p>

                                            <ul className="space-y-3 mt-auto pt-6 border-t border-white/5">
                                                {item.features.map(feature => (
                                                    <li key={feature} className="flex items-center text-sm text-gray-300">
                                                        <CheckCircle2 className={`h-4 w-4 mr-3 ${category.color}`} />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Code Sneak Peek */}
            <section className="py-24 bg-gradient-to-b from-black to-[#050505] border-t border-white/5">
                <div className="container px-4 md:px-6 mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl font-bold mb-6">One powerful <code className="text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">/api/v1/</code> endpoint.</h2>
                    <p className="text-gray-400 mb-12 max-w-2xl mx-auto">Skip the complicated SDKs. Our REST API is language-agnostic and designed to be integrated in under 5 minutes.</p>

                    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden text-left max-w-3xl mx-auto shadow-2xl">
                        <div className="flex items-center border-b border-white/10 px-4 py-3 bg-[#111]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="mx-auto text-xs text-gray-500 font-mono">Merge PDFs Request</div>
                        </div>
                        <pre className="p-6 text-sm overflow-x-auto text-gray-300 font-mono">
                            <code>
                                <span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> <span className="text-blue-400">fetch</span>(<span className="text-green-400">'https://api.docunexu.com/v1/pdf/merge'</span>, {"{"}<br />
                                {"  "}method: <span className="text-green-400">'POST'</span>,<br />
                                {"  "}headers: {"{"}<br />
                                {"    "}<span className="text-green-400">'Authorization'</span>: <span className="text-green-400">'Bearer dn_live_YOUR_API_KEY'</span>,<br />
                                {"    "}<span className="text-green-400">'Content-Type'</span>: <span className="text-green-400">'application/json'</span><br />
                                {"  "}{"}"},<br />
                                {"  "}body: <span className="text-blue-400">JSON</span>.<span className="text-yellow-200">stringify</span>({"{"}<br />
                                {"    "}name: <span className="text-green-400">'merged_report.pdf'</span>,<br />
                                {"    "}url: <span className="text-green-400">'https://example.com/file1.pdf,https://example.com/file2.pdf'</span><br />
                                {"  "}{"}"})<br />
                                {"}"});<br />
                                <br />
                                <span className="text-pink-400">const</span> data = <span className="text-pink-400">await</span> response.<span className="text-yellow-200">json</span>();<br />
                                <span className="text-gray-500">{"// Returns: { \"url\": \"https://docunexu-cloud.com/...\", \"error\": false }"}</span>
                            </code>
                        </pre>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative border-t border-white/10">
                <div className="absolute inset-0 bg-indigo-500/5" />
                <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to automate your documents?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Join developers building faster, more reliable PDF workflows with DocuNexu. Get started with 500 free credits today.
                    </p>
                    <Button size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-full" asChild>
                        <Link href="/signup">
                            Create your free account
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
