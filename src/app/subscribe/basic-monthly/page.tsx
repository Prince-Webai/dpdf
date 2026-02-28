'use client'

import Script from 'next/script'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BasicMonthlySubscription() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [subscriptionId, setSubscriptionId] = useState('');

    return (
        <div className="flex flex-col min-h-screen pt-32 pb-24 relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black -z-10" />

            <div className="container px-4 mx-auto max-w-4xl relative z-10">
                {!isSuccess ? (
                    <>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Pricing
                        </Link>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Plan Summary */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-4xl font-bold mb-4">Complete your subscription</h1>
                                    <p className="text-gray-400 text-lg">You&apos;re subscribing to the <span className="text-indigo-400 font-semibold">Basic Monthly</span> plan.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        '17,000 Credits per month',
                                        'Full API access',
                                        '60-min link expiry',
                                        'Priority Support'
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Billing cycle</span>
                                        <span className="text-white">Monthly</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Price</span>
                                        <span className="text-white">$14.99 / mo</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-lg font-semibold">Total today</span>
                                        <span className="text-2xl font-bold text-white">$14.99</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Secure Checkout
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        Instant Activation
                                    </div>
                                </div>
                            </motion.div>

                            {/* PayPal Button */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                                <h3 className="text-xl font-semibold mb-6">Payment Method</h3>

                                <div id="paypal-button-container-P-9JK0468165598201HNGRSX7A" className="min-h-[150px] flex items-center justify-center">
                                    <div className="animate-pulse text-gray-500 text-sm italic">Loading PayPal...</div>
                                </div>

                                <p className="mt-6 text-xs text-center text-gray-500">
                                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                                    Your subscription will automatically renew each month.
                                </p>
                            </motion.div>
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center space-y-8 py-12"
                    >
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h1 className="text-4xl font-bold">Subscription Active!</h1>
                        <p className="text-gray-400">
                            Thank you for subscribing to the Basic Monthly plan. Your account has been upgraded and your credits are now available.
                        </p>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-mono text-gray-500">
                            ID: {subscriptionId}
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-block w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </motion.div>
                )}
            </div>

            <Script
                src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
                data-sdk-integration-source="button-factory"
                strategy="afterInteractive"
                onLoad={() => {
                    // @ts-ignore
                    if (window.paypal) {
                        const container = document.getElementById('paypal-button-container-P-9JK0468165598201HNGRSX7A');
                        if (container) container.innerHTML = '';

                        // @ts-ignore
                        window.paypal.Buttons({
                            style: {
                                shape: 'pill',
                                color: 'gold',
                                layout: 'vertical',
                                label: 'subscribe'
                            },
                            createSubscription: function (data: any, actions: any) {
                                return actions.subscription.create({
                                    plan_id: 'P-9JK0468165598201HNGRSX7A'
                                });
                            },
                            onApprove: function (data: any, actions: any) {
                                setSubscriptionId(data.subscriptionID);
                                setIsSuccess(true);
                                alert('Subscription successful! ID: ' + data.subscriptionID);
                            }
                        }).render('#paypal-button-container-P-9JK0468165598201HNGRSX7A');
                    }
                }}
            />
        </div>
    )
}
