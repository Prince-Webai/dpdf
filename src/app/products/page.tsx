'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, FileJson, Layers, Cpu, Zap, Lock, FileText, CheckCircle2, Pentagon, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const products = [
    {
        category: "Data Extraction",
        icon: FileJson,
        color: "text-blue-400",
        bgColor: "bg-blue-400/5",
        borderColor: "border-blue-400/10",
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
        bgColor: "bg-purple-400/5",
        borderColor: "border-purple-400/10",
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
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/5",
        borderColor: "border-emerald-400/10",
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
        <div className="flex min-h-screen bg-executive-black text-white selection:bg-executive-gold selection:text-black relative flex-col overflow-hidden">
            <div className="executive-grain" />

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-executive-gold/5 rounded-none blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-none blur-[120px]" />
            </div>

            <div className="flex flex-col min-h-screen relative z-10 pt-32 pb-64">
                {/* Hero Section */}
                <section className="relative py-48 flex items-center justify-center">
                    <div className="container px-4 md:px-6 mx-auto text-center max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 border border-executive-gold/20 bg-executive-gold/5 px-4 py-2 rounded-none text-[10px] tracking-[0.4em] uppercase text-executive-gold mb-12 backdrop-blur-md">
                                <Sparkles className="w-3 h-3" />
                                <span>The Nexus Component Library</span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-serif text-white mb-10 font-normal leading-tight tracking-tighter">
                                Strategic <span className="text-white/30 italic">Capabilities.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/40 mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
                                From machine-learning document analysis to surgical PDF manipulation.
                                Everything you need to orchestrate mission-critical workflows.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link href="/signup" className="group relative">
                                    <div className="absolute -inset-0.5 bg-executive-gold rounded-none blur-md opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                    <Button size="lg" className="relative h-14 px-10 bg-executive-gold text-black hover:bg-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-none transition-all duration-500 border border-executive-gold/20">
                                        Deploy Protocol <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="h-14 px-10 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-none transition-all duration-500" asChild>
                                    <Link href="/docs">
                                        Structural Docs
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-20 relative">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <div className="space-y-64">
                            {products.map((category, index) => (
                                <motion.div
                                    key={category.category}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8 }}
                                    className="relative"
                                >
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
                                        <div className="flex items-center gap-6">
                                            <div className={`p-5 bg-black border border-white/5`}>
                                                <category.icon className={`h-8 w-8 stroke-[1px] ${category.color}`} />
                                            </div>
                                            <div>
                                                <span className="text-executive-gold text-[10px] tracking-[0.4em] uppercase font-bold block mb-2">Category {index + 1}</span>
                                                <h2 className="text-4xl md:text-5xl font-serif">{category.category}</h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                                        {category.items.map((item, itemIndex) => (
                                            <motion.div
                                                key={item.title}
                                                whileHover={{ y: -5 }}
                                                className="bg-executive-panel/40 border border-white/5 backdrop-blur-sm p-10 group flex flex-col h-full relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                                                <h3 className="text-2xl font-serif mb-4 text-white group-hover:text-executive-gold transition-colors">{item.title}</h3>
                                                <p className="text-white/40 mb-10 flex-grow leading-relaxed font-light text-sm">
                                                    {item.description}
                                                </p>

                                                <ul className="space-y-4 mt-auto pt-8 border-t border-white/5">
                                                    {item.features.map(feature => (
                                                        <li key={feature} className="flex items-center text-[11px] tracking-wide text-white/30 uppercase font-bold">
                                                            <div className={`h-1 w-1 rounded-none mr-4 ${itemIndex % 2 === 0 ? 'bg-executive-gold' : 'bg-white/20'}`} />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-executive-gold/[0.02] z-0" />
                    <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Pentagon className="w-16 h-16 text-executive-gold/40 mx-auto mb-12 animate-pulse" />
                            <h2 className="text-5xl md:text-8xl font-serif mb-12 tracking-tight">
                                Automate at <br /><span className="text-white/30 italic">Quantum Scale.</span>
                            </h2>
                            <p className="text-xl text-white/40 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
                                Join elite development teams orchestrating mission-critical
                                document workflows with DocuNexus.
                            </p>

                            <Link href="/signup" className="inline-block relative group">
                                <div className="absolute -inset-1 bg-white rounded-none blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                                <Button size="lg" className="h-16 px-16 bg-white text-black hover:bg-executive-gold hover:text-white transition-all duration-700 text-[12px] tracking-[0.5em] font-bold uppercase rounded-none">
                                    Initiate Integration
                                </Button>
                            </Link>

                            <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 px-12">
                                <span className="font-serif italic text-lg whitespace-nowrap">Global Secure</span>
                                <span className="font-serif italic text-lg whitespace-nowrap">Enterprise API</span>
                                <span className="font-serif italic text-lg whitespace-nowrap">Quantum Scaling</span>
                                <span className="font-serif italic text-lg whitespace-nowrap">Strategic Data</span>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    )
}
