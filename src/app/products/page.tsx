'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Terminal, FileJson, Layers, Cpu, Zap, Lock, ScanLine, Combine } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ProductsPage() {
    // Shared framer-motion variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 pt-32 pb-24 md:pt-48 md:pb-32">

                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm mb-8"
                    >
                        <ScanLine className="w-4 h-4 text-cyan-400" />
                        <span className="font-medium">Core Capabilities</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-[1.1]"
                    >
                        Powerful Document <br className="hidden sm:block" /> Intelligence API
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto"
                    >
                        A comprehensive suite of document manipulation and extraction endpoints mapped to a single, elegant REST interface.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left max-w-7xl mx-auto"
                >
                    <motion.div variants={itemVariants}>
                        <ProductCard
                            icon={FileJson}
                            title="Extraction API"
                            desc="Advanced OCR and layout analysis to convert any PDF tables, forms, and nested structures into high-fidelity JSON arrays."
                            color="cyan"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <ProductCard
                            icon={Combine}
                            title="Manipulation Engine"
                            desc="Merge thousands of documents, split by arbitrary page ranges, or rotate pages programmatically inside the pipeline."
                            color="indigo"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <ProductCard
                            icon={Lock}
                            title="Stateless Privacy"
                            desc="Computation environment that automatically and securely purges all temporary files upon request completion."
                            color="pink"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <ProductCard
                            icon={Terminal}
                            title="Multi-SDK Support"
                            desc="Official idiomatic libraries for Node.js, Python, and Go with built-in automatic retry and rate-limit handling."
                            color="purple"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <ProductCard
                            icon={Zap}
                            title="Edge Speed Topology"
                            desc="Globally distributed rendering nodes ensure your document processing happens at the lowest possible latency."
                            color="amber"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <ProductCard
                            icon={Cpu}
                            title="Vision AI Models"
                            desc="Powered by proprietary vision language models specifically tuned for dense financial, medical, and legal layouts."
                            color="emerald"
                        />
                    </motion.div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-32 text-center"
                >
                    <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-black border border-white/10 rounded-3xl p-10 md:p-16 max-w-4xl mx-auto backdrop-blur-sm">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to automate your workflows?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">Join engineering teams processing millions of documents per month with DocuNexu.</p>
                        <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all rounded-xl" asChild>
                            <Link href="/signup">
                                Get your API key <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}

function ProductCard({ icon: Icon, title, desc, color }: any) {
    const colorMap: Record<string, string> = {
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40",
        pink: "text-pink-400 bg-pink-500/10 border-pink-500/20 group-hover:bg-pink-500/20 group-hover:border-pink-500/40",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/40",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20 group-hover:border-amber-500/40",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40",
    }

    const iconStyle = colorMap[color] || colorMap.indigo

    return (
        <div className="h-full p-8 rounded-3xl bg-[#050505] border border-white/5 hover:border-white/10 transition-all duration-300 group hover:bg-[#080808] flex flex-col">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_20px_inherit] ${iconStyle}`}>
                <Icon className="h-6 w-6 currentColor" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{title}</h3>
            <p className="text-gray-400 text-base leading-relaxed flex-grow">{desc}</p>
        </div>
    )
}
