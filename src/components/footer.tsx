import Link from 'next/link'
import { FileText, Github, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black text-gray-400 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                            <FileText className="h-6 w-6 text-indigo-500" />
                            <span>DocuNexu</span>
                        </Link>
                        <p className="text-sm mb-4">
                            AI-Powered PDF API platform for modern teams. Extract, merge, split, and edit PDFs at scale.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Products</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">PDF to JSON API</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Merge & Split</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">AI Document Parser</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">HTML to PDF</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm">
                    <p>© {new Date().getFullYear()} DocuNexu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
