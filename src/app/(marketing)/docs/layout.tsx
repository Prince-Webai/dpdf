'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BookOpen, Key, UploadCloud, FileJson, Layers, Code2,
    FileImage, ScanLine, Scissors, FilePen, KeyRound,
    Barcode, Globe, Zap, AlertCircle, ChevronRight
} from "lucide-react"

const navSections = [
    {
        label: "Getting Started",
        icon: BookOpen,
        links: [
            { href: "/docs#introduction", label: "Introduction" },
            { href: "/docs#authentication", label: "Authentication", icon: Key },
            { href: "/docs#base-url", label: "Base URL & Versioning" },
            { href: "/docs#errors", label: "Error Codes", icon: AlertCircle },
            { href: "/docs#rate-limits", label: "Rate Limits", icon: Zap },
        ],
    },
    {
        label: "File Management",
        icon: UploadCloud,
        links: [
            { href: "/docs#upload", label: "File Upload", icon: UploadCloud },
            { href: "/docs#upload-direct", label: "Direct Upload (Base64)" },
        ],
    },
    {
        label: "Extraction",
        icon: FileJson,
        links: [
            { href: "/docs#ai-extract", label: "AI Document Extract", icon: FileJson },
            { href: "/docs#pdf-to-text", label: "PDF to Text" },
            { href: "/docs#pdf-to-csv", label: "PDF to CSV" },
            { href: "/docs#pdf-to-xml", label: "PDF to XML" },
            { href: "/docs#invoice-parser", label: "Invoice Parser", icon: ScanLine },
        ],
    },
    {
        label: "PDF Generation",
        icon: Code2,
        links: [
            { href: "/docs#html-to-pdf", label: "HTML / URL to PDF", icon: Code2 },
            { href: "/docs#doc-builder", label: "Document Builder" },
        ],
    },
    {
        label: "PDF Manipulation",
        icon: Layers,
        links: [
            { href: "/docs#merge", label: "Merge PDFs", icon: Layers },
            { href: "/docs#split", label: "Split PDF", icon: Scissors },
            { href: "/docs#annotate", label: "Fill Forms & Sign", icon: FilePen },
            { href: "/docs#watermark", label: "Watermark & Encrypt", icon: KeyRound },
        ],
    },
    {
        label: "Conversion",
        icon: FileImage,
        links: [
            { href: "/docs#pdf-to-image", label: "PDF to Image", icon: FileImage },
            { href: "/docs#image-to-pdf", label: "Image to PDF" },
        ],
    },
    {
        label: "Utilities",
        icon: Globe,
        links: [
            { href: "/docs#barcode", label: "Barcode / QR Code", icon: Barcode },
            { href: "/docs#url-to-pdf", label: "URL Screenshot" },
        ],
    },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen relative pt-32 bg-executive-black overflow-hidden">
            <div className="executive-grain" />

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-executive-gold/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px]" />
            </div>

            <div className="flex flex-1 container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                {/* Left Sidebar */}
                <aside className="w-72 flex-shrink-0 hidden md:block py-20 pr-10 border-r border-white/5 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto hidden-scrollbar">
                    {/* API Version Badge */}
                    <div className="mb-10 inline-flex items-center gap-2 px-3 py-1.5 border border-executive-gold/20 bg-executive-gold/5 text-executive-gold text-[9px] tracking-[0.3em] uppercase font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-executive-gold animate-pulse" />
                        API v1 · Stable
                    </div>

                    <div className="space-y-10">
                        {navSections.map((section) => (
                            <div key={section.label}>
                                <h4 className="text-white/30 mb-4 text-[9px] tracking-[0.35em] font-bold uppercase flex items-center gap-2">
                                    <section.icon className="w-3 h-3 text-executive-gold" />
                                    {section.label}
                                </h4>
                                <ul className="space-y-1">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-2 text-white/35 hover:text-white px-3 py-2 hover:bg-white/5 transition-all text-[11px] tracking-wider uppercase font-medium group relative"
                                            >
                                                <div className="w-[1.5px] h-3 bg-transparent group-hover:bg-executive-gold absolute left-0 transition-colors" />
                                                {link.label}
                                                {link.icon && (
                                                    <link.icon className="w-3 h-3 ml-auto text-executive-gold/30 group-hover:text-executive-gold transition-colors" />
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Help box */}
                    <div className="mt-12 p-4 border border-white/5 bg-executive-panel/30">
                        <p className="text-[10px] text-white/25 leading-relaxed mb-3">
                            Need help? Our engineering team is available 24/7.
                        </p>
                        <a href="mailto:support@docunexus.com" className="text-[10px] text-executive-gold hover:text-white transition-colors tracking-wider uppercase font-bold">
                            support@docunexus.com →
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 py-20 md:pl-16 lg:pl-24 min-w-0 pb-48">
                    {children}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hidden-scrollbar::-webkit-scrollbar { display: none; }
                .hidden-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .method-get { background: rgba(234,179,8,0.15); color: #EAB308; border: 1px solid rgba(234,179,8,0.3); }
                .method-post { background: rgba(34,197,94,0.12); color: #22C55E; border: 1px solid rgba(34,197,94,0.25); }
                .method-delete { background: rgba(239,68,68,0.12); color: #EF4444; border: 1px solid rgba(239,68,68,0.25); }
            `}} />
        </div>
    )
}
