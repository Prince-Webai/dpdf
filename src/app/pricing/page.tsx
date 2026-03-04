'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Info, Sparkles, Database, Shield, HardDrive, Zap } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

    const prices = {
        monthly: { basic: "14.99", personal: "24.99", business: "54.99" },
        annual: { basic: "11.99", personal: "19.99", business: "43.99" }
    }

    return (
        <div className="flex flex-col min-h-screen pt-32 pb-24 relative overflow-hidden bg-black text-white selection:bg-indigo-500/30">
            {/* Immersive Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />

            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/5 blur-[120px] pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-20 md:mb-28">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm mb-8 font-medium shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                        <Sparkles className="w-4 h-4" />
                        Save 20% on all Annual Plans
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
                    >
                        Pricing that scales <br className="hidden sm:block" /> with your throughput
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Extremely generous free tier. Transparent pricing. Upgrade instantly when your production traffic demands it.
                    </motion.p>

                    {/* Highly Styled Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex items-center justify-center gap-4 relative z-20"
                    >
                        <div className="bg-[#050505] shadow-inner shadow-black/80 border border-white/10 p-1.5 rounded-full flex items-center relative drop-shadow-2xl">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all relative z-10 duration-300 ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Monthly Billing
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all relative z-10 flex items-center gap-2 duration-300 ${billingCycle === 'annual' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Annual Billing
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors ${billingCycle === 'annual' ? 'bg-black/10 text-emerald-800' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    -20%
                                </span>
                            </button>
                            <motion.div
                                className="absolute bg-white rounded-full h-[calc(100%-12px)] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                animate={{
                                    left: billingCycle === 'monthly' ? 6 : '50%',
                                    width: 'calc(50% - 6px)'
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4 lg:px-0">
                    <PriceCard
                        name="Basic"
                        price={prices[billingCycle].basic}
                        desc="The entry point for building and launching your MVP."
                        features={[
                            '17K Monthly Credits',
                            '60-min Link Expiry',
                            'Full API Access',
                            'Unlimited Output',
                            'Secured Data & Advanced Security',
                            'Priority Support'
                        ]}
                        delay={0.1}
                        link={billingCycle === 'monthly' ? "https://www.paypal.com/ncp/payment/SMWA26KE2MZZC" : "https://www.paypal.com/ncp/payment/59AA2G4UJ864J"}
                        btnText="Get Started"
                    />
                    <PriceCard
                        name="Personal"
                        price={prices[billingCycle].personal}
                        desc="Increased capacity for professionals and growing projects."
                        featured={true}
                        features={[
                            'Everything in Basic, plus:',
                            '37K Monthly Credits',
                            'Pro-Tier Stability',
                            'Enhanced Workspace Management'
                        ]}
                        delay={0.2}
                        link={billingCycle === 'monthly' ? "https://www.paypal.com/ncp/payment/T4ZGGNHMZX7TQ" : "https://www.paypal.com/ncp/payment/TZHQHJPA23LVJ"}
                        btnText="Get Started"
                    />
                    <PriceCard
                        name="Business"
                        price={prices[billingCycle].business}
                        desc="The powerhouse tier for scaling teams and production-heavy apps."
                        features={[
                            'Everything in Personal, plus:',
                            '81K Monthly Credits',
                            'Team Collaboration Tools',
                            'VIP Priority Support',
                            'Infrastructure Isolation'
                        ]}
                        delay={0.3}
                        link={billingCycle === 'monthly' ? "https://www.paypal.com/ncp/payment/SJP7DLJL4L6NG" : "https://www.paypal.com/ncp/payment/E5VMGGD3Q9HKE"}
                        btnText="Get Started"
                    />
                </div>

                {/* The Credit Economy Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 max-w-5xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            The Credit Economy
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Our credit system is designed to be flexible—you only pay for what you actually use across our stack.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* API & Database */}
                        <div className="bg-[#050505] border border-white/5 rounded-3xl p-8 hover:border-cyan-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Database className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6">API & Database Interactions</h3>
                            <ul className="space-y-6">
                                <li>
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-emerald-100 block mb-1">1 Credit = 100 API Requests</span>
                                            <p className="text-sm text-gray-500 leading-relaxed">Whether it’s a simple GET or a complex filtered query via our REST or GraphQL endpoints.</p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-emerald-100 block mb-1">5 Credits = 1 Database Function Call</span>
                                            <p className="text-sm text-gray-500 leading-relaxed">For heavy lifting like Edge Functions or complex stored procedures.</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Realtime & Auth */}
                        <div className="bg-[#050505] border border-white/5 rounded-3xl p-8 hover:border-pink-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6">Realtime & Auth</h3>
                            <ul className="space-y-6">
                                <li>
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-emerald-100 block mb-1">10 Credits = 1,000 Realtime Messages</span>
                                            <p className="text-sm text-gray-500 leading-relaxed">For those building chat apps or live dashboards that need instant updates.</p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-emerald-100 block mb-1">20 Credits = 1 Successful Auth User</span>
                                            <p className="text-sm text-gray-500 leading-relaxed">Covers the cost of managing a secure user session and JWT generation.</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Storage & Bandwidth */}
                        <div className="bg-[#050505] border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <HardDrive className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6">Storage & Bandwidth</h3>
                            <ul className="space-y-6">
                                <li>
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-emerald-100 block mb-1">1 Credit = 10MB of Data Egress</span>
                                            <p className="text-sm text-gray-500 leading-relaxed">When your users download assets or your app fetches large JSON blobs.</p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-emerald-100 block mb-1">50 Credits = 1GB of Monthly Storage</span>
                                            <p className="text-sm text-gray-500 leading-relaxed">Keeping your Postgres backups and file assets safe and accessible.</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ / Trust Segment */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-32 pt-16 border-t border-white/5 opacity-80"
                >
                    <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto text-sm text-gray-400">
                        <div className="flex gap-4 items-start">
                            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-semibold mb-2 text-base">What happens if I exceed my usage?</h4>
                                <p className="leading-relaxed">We will never hardblock your application in production. If you consistently exceed your tier limit, our team will reach out to discuss a custom plan suited for your volume.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-semibold mb-2 text-base">Is my sensitive data secure?</h4>
                                <p className="leading-relaxed">Yes. We run a fully stateless engine. Your documents are kept in highly encrypted volatile memory during processing and are wiped the millisecond the API responds.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function PriceCard({ name, price, desc, features, featured = false, delay, link = "/signup", btnText = "Start Free Trial" }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, type: "spring", bounce: 0.3 }}
            className={`relative p-10 rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 group ${featured ? 'bg-gradient-to-b from-indigo-600 to-indigo-900 border-indigo-400 shadow-[0_20px_60px_rgba(79,70,229,0.3)] md:-translate-y-4 md:hover:-translate-y-6' : 'bg-[#050505] border-white/10 hover:border-indigo-500/30 hover:bg-[#0a0a0a]'}`}
        >
            {featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl">
                    Most Popular
                </div>
            )}

            <h3 className={`text-xl font-bold mb-4 uppercase tracking-widest ${featured ? 'text-indigo-100' : 'text-gray-300'}`}>{name}</h3>

            <div className="mb-6 flex items-baseline gap-1 relative">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={price}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-6xl font-extrabold tracking-tight"
                    >
                        ${price}
                    </motion.span>
                </AnimatePresence>
                <span className={`text-sm font-medium ${featured ? 'text-indigo-200' : 'text-gray-500'}`}>/mo</span>
            </div>

            <p className={`text-sm mb-10 min-h-[48px] leading-relaxed ${featured ? 'text-indigo-100' : 'text-gray-400'}`}>{desc}</p>

            <div className={`w-full h-px mb-10 ${featured ? 'bg-indigo-400/30' : 'bg-white/10'}`} />

            <ul className="space-y-5 mb-12 text-sm w-full text-left">
                {features.map((f: string) => (
                    <li key={f} className="flex items-center gap-4">
                        <div className={`rounded-full p-1 ${featured ? 'bg-indigo-400/30 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                            <Check className="h-3 w-3 shrink-0" strokeWidth={3} />
                        </div>
                        <span className={featured ? 'text-indigo-50 font-medium' : 'text-gray-300'}>{f}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-auto w-full">
                <Button className={`w-full h-14 rounded-2xl text-base font-bold transition-all shadow-lg ${featured ? 'bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-[1.02]' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02]'}`} asChild>
                    <Link href={link}>{btnText}</Link>
                </Button>
            </div>
        </motion.div>
    )
}
