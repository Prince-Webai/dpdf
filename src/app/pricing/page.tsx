'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"
import { motion, Variants } from "framer-motion"

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

    const prices = {
        monthly: { basic: "14.99", personal: "24.99", business: "54.99" },
        annual: { basic: "13.99", personal: "22.99", business: "49.99" }
    }

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
                <div className="text-center mb-12">
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
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
                    >
                        Start for free, upgrade when you need higher limits. No hidden fees.
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-4 mb-16"
                    >
                        <div className="bg-[#0a0a0a] border border-white/10 p-1 rounded-full flex items-center relative">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative z-10 ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative z-10 flex items-center gap-2 ${billingCycle === 'annual' ? 'text-white' : 'text-gray-500'}`}
                            >
                                Annual
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                                    -20%
                                </span>
                            </button>
                            <motion.div
                                className="absolute bg-[#1a1a1a] border border-white/10 rounded-full h-[calc(100%-8px)]"
                                initial={false}
                                animate={{
                                    left: billingCycle === 'monthly' ? 4 : '50%',
                                    width: 'calc(50% - 4px)'
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto perspective-1000"
                >
                    {/* Basic Tier */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="rounded-3xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-8 flex flex-col shadow-2xl transition-all duration-300 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                        <h3 className="text-2xl font-semibold mb-2">Basic</h3>
                        <div className="mb-1">
                            <span className="text-4xl font-bold">${prices[billingCycle].basic}</span>
                            <span className="text-lg text-gray-500 font-normal">/mo</span>
                        </div>
                        {billingCycle === 'annual' && <p className="text-[10px] text-gray-500 mb-6">Billed annually</p>}
                        {billingCycle === 'monthly' && <div className="mb-6 h-[15px]" />}

                        <p className="text-gray-400 mb-8 h-12">Perfect for individuals starting out.</p>
                        <div className="bg-white/5 rounded-xl p-4 mb-6 flex justify-between items-center border border-white/5">
                            <span className="text-sm text-gray-400">Credits/mo</span>
                            <span className="text-lg font-bold text-white">17K</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm">
                            {['60-min link expiry', 'Full API access', 'Unlimited output', 'Secured data', 'Advanced security', 'Priority Support'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="text-gray-400 w-4 h-4 flex-shrink-0" /> <span className="text-gray-300">{feature}</span></li>
                            ))}
                        </ul>
                        <Button className="w-full bg-white/10 text-white hover:bg-white/20 rounded-xl h-12 border border-white/10" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </motion.div>

                    {/* Personal Tier */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="rounded-3xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-8 flex flex-col shadow-2xl transition-all duration-300 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
                        <h3 className="text-2xl font-semibold mb-2">Personal</h3>
                        <div className="mb-1">
                            <span className="text-4xl font-bold">${prices[billingCycle].personal}</span>
                            <span className="text-lg text-gray-500 font-normal">/mo</span>
                        </div>
                        {billingCycle === 'annual' && <p className="text-[10px] text-gray-500 mb-6">Billed annually</p>}
                        {billingCycle === 'monthly' && <div className="mb-6 h-[15px]" />}

                        <p className="text-gray-400 mb-8 h-12">Ideal for freelancers and professionals.</p>
                        <div className="bg-white/5 rounded-xl p-4 mb-6 flex justify-between items-center border border-white/5">
                            <span className="text-sm text-gray-400">Credits/mo</span>
                            <span className="text-lg font-bold text-white">37K</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm">
                            {['60-min link expiry', 'Full API access', 'Unlimited output', 'Secured data', 'Advanced security', 'Priority Support'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="text-gray-400 w-4 h-4 flex-shrink-0" /> <span className="text-gray-300">{feature}</span></li>
                            ))}
                        </ul>
                        <Button className="w-full bg-white/10 text-white hover:bg-white/20 rounded-xl h-12 border border-white/10" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </motion.div>

                    {/* Business Tier */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -15, scale: 1.03 }}
                        className="rounded-3xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-950/40 to-[#0a0a0a] p-8 flex flex-col relative shadow-[0_0_40px_rgba(99,102,241,0.15)] z-10 group overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors duration-500 pointer-events-none" />

                        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" /> Best Value
                        </div>

                        <h3 className="text-2xl font-semibold mb-2 text-indigo-100">Business</h3>
                        <div className="mb-1">
                            <span className="text-4xl font-bold text-white">${prices[billingCycle].business}</span>
                            <span className="text-lg text-indigo-300 font-normal">/mo</span>
                        </div>
                        {billingCycle === 'annual' && <p className="text-[10px] text-indigo-300/60 mb-6">Billed annually</p>}
                        {billingCycle === 'monthly' && <div className="mb-6 h-[15px]" />}

                        <p className="text-indigo-200/80 mb-8 h-12">For growing teams needing power.</p>
                        <div className="bg-indigo-500/10 rounded-xl p-4 mb-6 flex justify-between items-center border border-indigo-500/20">
                            <span className="text-sm text-indigo-300">Credits/mo</span>
                            <span className="text-lg font-bold text-white">81K</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm text-indigo-50">
                            {['60-min link expiry', 'Full API access', 'Unlimited output', 'Secured data', 'Advanced security', 'Priority Support'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3"><Check className="text-indigo-400 w-4 h-4 flex-shrink-0" /> <span>{feature}</span></li>
                            ))}
                        </ul>
                        <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl h-12 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all" asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
