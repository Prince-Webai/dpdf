'use client'

import Link from 'next/link'
import { FileText, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black text-gray-400 py-20 mt-auto">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-6">
                            <FileText className="h-6 w-6 text-blue-500" />
                            <span>DocuNexu</span>
                        </Link>
                        <p className="text-sm mb-6 leading-relaxed">
                            AI-Powered PDF API platform for modern teams. Extract, merge, split, and edit PDFs at scale.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-6">Capabilities</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">PDF to JSON API</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Extraction Engine</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Merge & Split</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Secure Vault</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-6">Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">API Status</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Support Portal</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">OSS Libraries</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-6">Corporate</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Privacy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Trust Center</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs tracking-widest uppercase text-gray-600">
                    <p>© {new Date().getFullYear()} DocuNexu Systems. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
