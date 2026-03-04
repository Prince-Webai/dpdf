'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Info, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useProfile } from "@/context/profile-context"

export default function PricingPage() {
    const { user } = useProfile()
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

    const prices = {
        monthly: { basic: "14.99", personal: "24.99", business: "54.99" },
        annual: { basic: "11.99", personal: "19.99", business: "43.99" }
    }

    return (
        <div className="flex flex-col min-h-screen pt-32 pb-24 relative overflow-hidden bg-executive-black text-white selection:bg-executive-gold selection:text-black">
            <div className="executive-grain" />
            {/* Immersive Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-executive-black to-executive-black -z-10" />

            <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-executive-gold/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-20 md:mb-28">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 text-blue-500 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    >
                        <Sparkles className="w-3 h-3" />
                        Save 20% on all Annual Plans
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 text-white"
                    >
                        Pricing that scales <br className="hidden sm:block" /> with your throughput
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed"
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
                                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all relative z-10 duration-300 ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all relative z-10 flex items-center gap-2 duration-300 ${billingCycle === 'annual' ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                Annual
                                <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors ${billingCycle === 'annual' ? 'bg-black/20 text-black' : 'bg-executive-gold/10 text-executive-gold'}`}>
                                    -20%
                                </span>
                            </button>
                            <motion.div
                                className="absolute bg-blue-500 rounded-full h-[calc(100%-12px)] shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                animate={{
                                    left: billingCycle === 'monthly' ? 6 : '50%',
                                    width: 'calc(50% - 6px)'
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4 lg:px-0">
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
                        isLoggedIn={!!user}
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
                        isLoggedIn={!!user}
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
                        isLoggedIn={!!user}
                    />
                </div>

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
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-semibold mb-2 text-base">What happens if I exceed my usage?</h4>
                                <p className="leading-relaxed">We will never hardblock your application in production. If you consistently exceed your tier limit, our team will reach out to discuss a custom plan suited for your volume.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
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

function PriceCard({ name, price, desc, features, featured = false, delay, link = "/signup", btnText = "Start Free Trial", isLoggedIn }: any) {
    const finalLink = isLoggedIn ? link : `/signup?next=${encodeURIComponent(link)}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay, type: "spring", bounce: 0.3 }}
            className={`relative p-6 sm:p-10 rounded-none border flex flex-col items-center text-center transition-all duration-300 group ${featured ? 'bg-executive-panel/50 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] sm:-translate-y-4 hover:-translate-y-6' : 'bg-[#050505] border-white/10 hover:border-blue-500/30 hover:bg-[#0a0a0a]'}`}
        >
            {featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-md text-blue-400 px-4 py-1.5 rounded-none text-[9px] font-bold uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(59,130,246,0.1)] z-50">
                    Most Popular
                </div>
            )}

            <h3 className={`text-lg sm:text-xl font-serif mb-4 uppercase tracking-[0.2em] ${featured ? 'text-executive-gold' : 'text-gray-300'}`}>{name}</h3>

            <div className="mb-6 flex items-baseline gap-1 relative">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={price}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight"
                    >
                        ${price}
                    </motion.span>
                </AnimatePresence>
                <span className={`text-sm font-medium ${featured ? 'text-executive-gold/60' : 'text-gray-500'}`}>/mo</span>
            </div>

            <p className={`text-sm mb-10 min-h-[48px] leading-relaxed ${featured ? 'text-white/80' : 'text-gray-400'}`}>{desc}</p>

            <div className={`w-full h-px mb-10 ${featured ? 'bg-executive-gold/30' : 'bg-white/10'}`} />

            <ul className="space-y-5 mb-12 text-sm w-full text-left">
                {features.map((f: string) => (
                    <li key={f} className="flex items-center gap-4">
                        <div className={`rounded-none p-1 border flex items-center justify-center ${featured ? 'bg-executive-gold/10 border-executive-gold/30 text-executive-gold' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                            <Check className="h-3 w-3 shrink-0" strokeWidth={3} />
                        </div>
                        <span className={featured ? 'text-white font-medium' : 'text-gray-300'}>{f}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-auto w-full relative group/btn">
                <div className={`absolute -inset-0.5 blur-md opacity-40 transition duration-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] ${featured ? 'bg-blue-500' : 'bg-transparent group-hover/btn:bg-blue-500/20'}`} />
                <Button variant="outline" className={`relative w-full h-14 rounded-none text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center border-0 ${featured ? 'bg-blue-500/10 backdrop-blur-md text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-white/5 border border-white/10 text-white hover:bg-blue-500 hover:text-white hover:border-blue-500'}`} asChild>
                    <Link href={finalLink}>{btnText}</Link>
                </Button>
            </div>
        </motion.div>
    )
}
