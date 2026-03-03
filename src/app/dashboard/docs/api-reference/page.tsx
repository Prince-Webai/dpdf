import React from "react";
import { Server, Copy, Check } from "lucide-react";

export default function ApiReferencePage() {
    return (
        <div className="space-y-12 max-w-5xl mx-auto py-8">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-executive-gold/10 border border-executive-gold/20 text-executive-gold text-xs font-mono tracking-wider mb-2">
                    <Server className="w-3 h-3" />
                    <span>REST API V1</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">API Reference</h1>
                <p className="text-white/60 max-w-3xl font-mono text-sm leading-relaxed">
                    Integrate DocuNexus capabilities programmatically. Our RESTful API enables you to automate document extraction, generate structured data, and manage your extraction jobs directly from your own applications.
                </p>
            </header>

            <section className="space-y-6 mt-12">
                <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-4">Base URI</h2>
                <div className="bg-black/40 border border-white/10 rounded-lg p-6 flex items-center justify-between group hover:border-executive-gold/30 transition-colors">
                    <code className="text-white/80 font-mono text-sm">https://api.docunexus.com/v1</code>
                    <button className="text-white/40 hover:text-executive-gold transition-colors">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </section>

            <section className="space-y-12 mt-12">
                <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-4">Endpoints</h2>

                {/* Extract Endpoint */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden hover:border-white/10 transition-all">
                    <div className="p-6 border-b border-white/[0.05] bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="bg-executive-gold/20 text-executive-gold border border-executive-gold/30 px-3 py-1 text-xs font-bold font-mono tracking-widest rounded">POST</span>
                            <code className="text-lg text-white font-mono tracking-tight">/extract/sync</code>
                        </div>
                        <span className="text-white/40 text-sm font-mono tracking-tight">Synchronous PDF Analysis</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
