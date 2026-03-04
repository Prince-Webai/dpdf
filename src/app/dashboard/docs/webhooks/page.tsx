import React from "react";
import { Plug, RefreshCw, Send, CodeSquare } from "lucide-react";
import Link from "next/link";

export default function WebhooksPage() {
    return (
        <div className="space-y-12 max-w-5xl mx-auto py-8 text-white text-sm">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-executive-gold/10 border border-executive-gold/20 text-executive-gold font-mono tracking-wider mb-2">
                    <Plug className="w-4 h-4" />
                    <span>EVENTS & WEBHOOKS</span>
                </div>
                <h1 className="text-4xl font-serif tracking-tight">Integrating Webhooks</h1>
                <p className="text-white/60 font-mono leading-relaxed max-w-3xl">
                    Instead of constantly polling the API to check job status, use Webhooks. DocuNexus will push events directly to your server securely using HTTPS calls when an extraction job updates state.
                </p>
            </header>

            <section className="space-y-8 mt-12 pb-12">
                <h2 className="text-2xl font-serif border-b border-white/10 pb-4">Event Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-lg">
                        <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Send className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h3 className="font-mono text-white mb-2">job.completed</h3>
                        <p className="text-white/60 text-xs font-mono leading-relaxed">Fired when a document extraction finishes successfully. Contains the full parsed data schema.</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-lg">
                        <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center mb-4">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                        </div>
                        <h3 className="font-mono text-white mb-2">job.failed</h3>
                        <p className="text-white/60 text-xs font-mono leading-relaxed">Fired when a document could not be processed due to corruption, unreadable text, or extraction engine errors.</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-lg">
                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center mb-4">
                            <RefreshCw className="w-4 h-4 text-blue-500" />
                        </div>
                        <h3 className="font-mono text-white mb-2">job.processing</h3>
                        <p className="text-white/60 text-xs font-mono leading-relaxed">Fired when the document transitions from the initial queue into active processing.</p>
                    </div>
                </div>

                <div className="mt-12 bg-black border border-white/10 rounded-lg p-6">
                    <h3 className="text-white font-serif text-lg mb-4">Verify Webhook Data</h3>
                    <p className="text-white/60 font-mono text-xs mb-6">Every webhook includes a <code className="text-white">X-DocuNexus-Signature</code> header. Use your Webhook Secret to verify the HMAC SHA-256 signature.</p>

                    <div className="bg-[#111] border border-white/5 rounded p-4 overflow-x-auto relative">
                        <div className="absolute top-0 right-0 py-1 px-2 text-[10px] text-white/30">NODE.JS</div>
                        <pre className="text-xs text-white/70 font-mono"><code>{`const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return signature === hash;
}`}</code></pre>
                    </div>
                </div>
            </section>
        </div>
    )
}
