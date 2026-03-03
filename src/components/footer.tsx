'use client'

import Link from 'next/link'
import { Pentagon, Github, Twitter, Linkedin } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Footer() {
    const pathname = usePathname()
    if (pathname && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
        return null;
    }

    return (
        <footer className="border-t border-white/[0.05] bg-executive-black text-white/40 py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-executive-gold/[0.01] pointer-events-none" />
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="group flex items-center gap-3 mb-8">
                            <Pentagon className="text-executive-gold w-6 h-6 stroke-[1px] group-hover:rotate-180 transition-transform duration-700" />
                            <span className="font-serif text-xl tracking-[0.1em] text-white">Docu<span className="text-white/40 italic">Nexus</span></span>
                        </Link>
                        <p className="text-xs leading-relaxed mb-8 max-w-xs tracking-wide">
                            The world's most sophisticated PDF API framework.
                            Securely orchestrate mission-critical document workflows with quantum-scale precision.
                        </p>
                        <div className="flex gap-6">
                            <Link href="https://twitter.com/docunexus" className="hover:text-executive-gold transition-colors"><Twitter className="h-4 w-4" /></Link>
                            <Link href="https://github.com/docunexus" className="hover:text-executive-gold transition-colors"><Github className="h-4 w-4" /></Link>
                            <Link href="https://linkedin.com/company/docunexus" className="hover:text-executive-gold transition-colors"><Linkedin className="h-4 w-4" /></Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif text-sm text-white mb-6 uppercase tracking-[0.2em]">Framework</h3>
                        <ul className="space-y-4 text-xs">
                            <li><Link href="/products" className="hover:text-executive-gold transition-colors">PDF to JSON Protocol</Link></li>
                            <li><Link href="/products" className="hover:text-executive-gold transition-colors">Strategic Merge & Split</Link></li>
                            <li><Link href="/products" className="hover:text-executive-gold transition-colors">AI Document Parser</Link></li>
                            <li><Link href="/products" className="hover:text-executive-gold transition-colors">HTML to PDF Engine</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-serif text-sm text-white mb-6 uppercase tracking-[0.2em]">Resources</h3>
                        <ul className="space-y-4 text-xs">
                            <li><Link href="/docs" className="hover:text-executive-gold transition-colors">API Documentation</Link></li>
                            <li><Link href="/docs#authentication" className="hover:text-executive-gold transition-colors">Strategic Reference</Link></li>
                            <li><Link href="/dashboard" className="hover:text-executive-gold transition-colors">Development Sandbox</Link></li>
                            <li><Link href="/pricing" className="hover:text-executive-gold transition-colors">Pricing Protocol</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-serif text-sm text-white mb-6 uppercase tracking-[0.2em]">Corporate</h3>
                        <ul className="space-y-4 text-xs">
                            <li><Link href="/" className="hover:text-executive-gold transition-colors">About Nexus</Link></li>
                            <li><Link href="mailto:contact@docunexus.com" className="hover:text-executive-gold transition-colors">Contact Relations</Link></li>
                            <li><Link href="/privacy" className="hover:text-executive-gold transition-colors">Privacy Protocol</Link></li>
                            <li><Link href="/terms" className="hover:text-executive-gold transition-colors">Terms of Engagement</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] font-bold uppercase">
                    <p>© {new Date().getFullYear()} DocuNexus Protocol. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span className="text-executive-gold/40">Status: Operational</span>
                        <span className="text-white/20 italic">v1.2.4-Nexus</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
