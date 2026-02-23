'use client'

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

import { motion, Variants } from "framer-motion"

export default function PricingPage() {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    }

    return (
        <div className="flex flex-col min-h-screen pt-32 pb-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black -z-10" />
            <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
                    >
                        Pricing that scales with you
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Start for free, upgrade when you need higher limits. No hidden fees.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto perspective-1000"
                >
                    {/* Free Tier */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="rounded-3xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-8 flex flex-col shadow-2xl transition-all duration-300 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                        <h3 className="text-2xl font-semibold mb-2">Hobby</h3>
                        <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <p className="text-gray-400 mb-8 h-12">Perfect for testing and small side projects.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['100 API calls/month', 'Basic PDF Extraction', 'Community Support'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="text-gray-400 w-5 h-5 flex-shrink-0" /> <span className="text-gray-300">{feature}</span></li>
                            ))}
                        </ul>
                        <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full h-12" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </motion.div>

                    {/* Pro Tier */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -15, scale: 1.03 }}
                        className="rounded-3xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-950/40 to-[#0a0a0a] p-8 flex flex-col relative shadow-[0_0_40px_rgba(99,102,241,0.15)] z-10 group overflow-hidden md:-mt-8 md:mb-8"
                    >
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors duration-500 pointer-events-none" />

                        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.5)]">Most Popular</div>

                        <h3 className="text-2xl font-semibold mb-2 text-indigo-100">Pro</h3>
                        <div className="text-4xl font-bold mb-6 text-white">$49<span className="text-lg text-indigo-300 font-normal">/mo</span></div>
                        <p className="text-indigo-200/80 mb-8 h-12">For professional developers and scaling startups.</p>
                        <ul className="space-y-4 mb-8 flex-1 text-indigo-50">
                            {['10,000 API calls/month', 'AI Invoice Parsing', 'HTML to PDF', 'Priority Email Support'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="text-indigo-400 w-5 h-5 flex-shrink-0" /> <span>{feature}</span></li>
                            ))}
                        </ul>
                        <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500 rounded-full h-12 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all" asChild>
                            <Link href="/signup">Upgrade to Pro</Link>
                        </Button>
                    </motion.div>

                    {/* Scale Tier */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="rounded-3xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-8 flex flex-col shadow-2xl transition-all duration-300 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                        <h3 className="text-2xl font-semibold mb-2">Scale</h3>
                        <div className="text-4xl font-bold mb-6">$199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <p className="text-gray-400 mb-8 h-12">For high volume production and enterprise workloads.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['100,000 API calls/month', 'All Pro Features', 'Custom Workflows', 'Dedicated Account Manager'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="text-gray-400 w-5 h-5 flex-shrink-0" /> <span className="text-gray-300">{feature}</span></li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-full h-12" asChild>
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
