import React from "react";
import { Package, Smartphone, Workflow } from "lucide-react";

export default function SdkLibrariesPage() {
    return (
        <div className="space-y-12 max-w-5xl mx-auto py-8 text-white text-sm">
            <header className="space-y-4 text-center">
                <div className="inline-flex flex-col items-center justify-center p-3 mb-4 rounded-full bg-executive-gold/10 text-executive-gold font-mono tracking-wider">
                    <Package className="w-8 h-8 mb-2" />
                    <span>NATIVE SDKs</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-white mb-4">Official SDKs and Libraries</h1>
                <p className="text-white/60 font-mono leading-relaxed max-w-2xl mx-auto">
                    The fastest way to integrate DocuNexus directly into your codebase. Our official SDKs offer comprehensive support for all API endpoints, automatic retries, and strongly typed definitions.
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pb-12">

                {/* NodeJS */}
                <div className="border border-white/10 hover:border-executive-gold/60 bg-white/[0.02] p-8 rounded-lg transition-colors group">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#339933]/20 rounded-md flex items-center justify-center border border-[#339933]/40">
                                <Server className="w-5 h-5 text-[#339933]" />
                            </div>
                            <h2 className="text-xl font-serif">Node.js / TypeScript</h2>
                        </div>
                        <span className="text-xs text-white/30 font-mono bg-black px-2 py-1 rounded">v2.1.4</span>
                    </div>
                    <p className="text-white/60 font-mono mb-8 h-12">First-class TypeScript support with integrated types and Promise-based extraction queuing.</p>

                    <div className="bg-black border border-white/10 p-3 rounded font-mono text-xs overflow-hidden mb-4 relative">
                        <div className="absolute top-0 right-0 py-1 px-2 text-[10px] text-white/30">NPM</div>
                        <code className="text-white/80">npm install @docunexus/node</code>
                    </div>
                    <a href="https://github.com/docunexus" className="text-executive-gold hover:text-white font-mono text-xs inline-flex items-center group-hover:underline">
                        View Repository →
                    </a>
                </div>

                {/* Python */}
                <div className="border border-white/10 hover:border-executive-gold/60 bg-white/[0.02] p-8 rounded-lg transition-colors group">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#3776AB]/20 rounded-md flex items-center justify-center border border-[#3776AB]/40">
                                <Workflow className="w-5 h-5 text-[#3776AB]" />
                            </div>
                            <h2 className="text-xl font-serif">Python</h2>
                        </div>
                        <span className="text-xs text-white/30 font-mono bg-black px-2 py-1 rounded">v1.8.0</span>
                    </div>
                    <p className="text-white/60 font-mono mb-8 h-12">Designed for data engineers. Includes Pandas integration natively for entity exporting.</p>

                    <div className="bg-black border border-white/10 p-3 rounded font-mono text-xs overflow-hidden mb-4 relative">
                        <div className="absolute top-0 right-0 py-1 px-2 text-[10px] text-white/30">PIP</div>
                        <code className="text-white/80">pip install docunexus</code>
                    </div>
                    <a href="https://github.com/docunexus" className="text-executive-gold hover:text-white font-mono text-xs inline-flex items-center group-hover:underline">
                        View Documentation →
                    </a>
                </div>
            </section>
        </div>
    );
}

function Server({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></svg>
    )
}
