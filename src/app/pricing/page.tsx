'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Star, Pentagon, Sparkles } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
        }
        checkUser()
    }, [supabase])

    const prices = {
        monthly: { basic: "14.99", personal: "24.99", business: "49.99" },
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
        <div className="flex min-h-screen bg-executive-black text-white selection:bg-executive-gold selection:text-black relative flex-col overflow-hidden">
            <div className="executive-grain" />

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-executive-gold/5 rounded-none blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-none blur-[120px]" />
            </div>

            <div className="flex flex-col min-h-screen relative z-10 pt-48 pb-64">
                <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                    <div className="text-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 border border-executive-gold/20 bg-executive-gold/5 px-4 py-2 rounded-none text-[10px] tracking-[0.4em] uppercase text-executive-gold mb-12 backdrop-blur-md">
                                <Sparkles className="w-3 h-3" />
                                <span>Resource Allocation Tiers</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-serif text-white mb-10 font-normal leading-tight tracking-tighter">
                                Strategic <span className="text-white/30 italic">Investment.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-16 font-light">
                                Precise resource allocation for high-stakes orchestration.
                                Transparent. Flexible. Engineered for scale.
                            </p>
                        </motion.div>

                        {/* Billing Toggle */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-4 mb-20"
                        >
                            <div className="bg-black border border-white/5 p-1 rounded-none flex items-center relative backdrop-blur-md">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-8 py-3 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase transition-all relative z-10 ${billingCycle === 'monthly' ? 'text-black' : 'text-white/40'}`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle('annual')}
                                    className={`px-8 py-3 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase transition-all relative z-10 flex items-center gap-2 ${billingCycle === 'annual' ? 'text-black' : 'text-white/40'}`}
                                >
                                    Annual
                                    <span className="text-executive-gold/60 text-[8px] px-1.5 py-0.5 border border-executive-gold/20">
                                        -20%
                                    </span>
                                </button>
                                <motion.div
                                    className="absolute bg-executive-gold h-[calc(100%-8px)]"
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
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto"
                    >
                        {/* Plans Array */}
                        {[
                            {
                                name: "Basic",
                                price: prices[billingCycle].basic,
                                credits: "17K",
                                desc: "For foundational protocol testing.",
                                features: ["17K Monthly Credits", "60-min Link Expiry", "Full API Access", "Standard Support"],
                                highlight: false,
                                paypal: billingCycle === 'monthly' ? "https://www.paypal.com/ncp/payment/SMWA26KE2MZZC" : "https://www.paypal.com/ncp/payment/59AA2G4UJ864J"
                            },
                            {
                                name: "Personal",
                                price: prices[billingCycle].personal,
                                credits: "37K",
                                desc: "Surgical precision for solo creators.",
                                features: ["37K Monthly Credits", "Same-Day Response", "Advanced Security", "Developer Toolset"],
                                highlight: false,
                                paypal: billingCycle === 'monthly' ? "https://www.paypal.com/ncp/payment/T4ZGGNHMZX7TQ" : "https://www.paypal.com/ncp/payment/TZHQHJPA23LVJ"
                            },
                            {
                                name: "Business",
                                price: prices[billingCycle].business,
                                credits: "81K",
                                desc: "Production-ready orchestration.",
                                features: ["81K Monthly Credits", "VIP Priority Support", "Audit Logs", "Global Edge Network"],
                                highlight: true,
                                paypal: billingCycle === 'monthly' ? "https://www.paypal.com/ncp/payment/SJP7DLJL4L6NG" : "https://www.paypal.com/ncp/payment/E5VMGGD3Q9HKE"
                            }
                        ].map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                variants={item}
                                whileHover={{ y: -10 }}
                                className={`p-10 border transition-all duration-500 flex flex-col relative overflow-hidden ${plan.highlight ? 'border-executive-gold bg-executive-gold/[0.03] shadow-[0_0_40px_rgba(156,130,74,0.1)]' : 'border-white/5 bg-executive-panel/40 backdrop-blur-sm'}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 right-0 p-4">
                                        <Star className="w-5 h-5 text-executive-gold fill-executive-gold animate-pulse" />
                                    </div>
                                )}
                                <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-white/40 mb-6">{plan.name} Plan</h3>
                                <div className="mb-8">
                                    <span className="text-5xl font-serif text-white">${plan.price}</span>
                                    <span className="text-white/20 font-serif italic ml-2">/period</span>
                                </div>
                                <p className="text-white/40 mb-10 text-sm font-light leading-relaxed">{plan.desc}</p>

                                <div className="bg-black/40 border border-white/5 p-6 mb-10 flex justify-between items-center">
                                    <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-white/40">Credits</span>
                                    <span className="text-xl font-serif text-executive-gold font-bold">{plan.credits}</span>
                                </div>

                                <ul className="space-y-5 mb-12 flex-1">
                                    {plan.features.map((f, fi) => (
                                        <li key={fi} className="flex items-center text-[10px] tracking-widest uppercase font-bold text-white/30">
                                            <Check className={`w-3.5 h-3.5 mr-4 ${plan.highlight ? 'text-executive-gold' : 'text-white/20'}`} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => window.open(plan.paypal, "_blank")}
                                    className={`w-full h-14 rounded-none text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 border ${plan.highlight ? 'bg-executive-gold text-black hover:bg-white border-executive-gold' : 'bg-transparent text-white border-white/10 hover:bg-white hover:text-black'}`}
                                >
                                    Initiate Contract
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
