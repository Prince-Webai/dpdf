import Link from "next/link"
import { FileText, Key, UploadCloud, FileJson, Layers, BookOpen, ChevronRight } from "lucide-react"

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen relative pt-32 bg-executive-black overflow-hidden">
            <div className="executive-grain" />

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-executive-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="flex flex-1 container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
                {/* Left Sidebar */}
                <aside className="w-72 flex-shrink-0 hidden md:block py-20 pr-12 border-r border-white/5 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto hidden-scrollbar">
                    <div className="space-y-12">
                        <div>
                            <h4 className="font-serif text-white/40 mb-6 text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-executive-gold/60" /> Getting Started
                            </h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/docs" className="flex items-center justify-between text-white/40 hover:text-executive-gold px-3 py-2 rounded-none hover:bg-white/5 transition-all text-sm font-serif italic">
                                        Introduction
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs#authentication" className="flex items-center justify-between text-white/40 hover:text-executive-gold px-3 py-2 rounded-none hover:bg-white/5 transition-all text-sm font-serif italic">
                                        Authentication
                                        <Key className="w-3.5 h-3.5 opacity-30" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-serif text-white/40 mb-6 text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                                <FileText className="w-4 h-4 text-executive-gold/60" /> API Reference
                            </h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/docs#upload" className="flex items-center gap-2 text-white/40 hover:text-executive-gold px-3 py-2 rounded-none hover:bg-white/5 transition-all text-sm font-serif italic group">
                                        <div className="w-[1px] h-4 bg-transparent group-hover:bg-executive-gold transition-colors" />
                                        File Upload
                                        <UploadCloud className="w-3.5 h-3.5 ml-auto opacity-30" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs#ai-extract" className="flex items-center gap-2 text-white/40 hover:text-executive-gold px-3 py-2 rounded-none hover:bg-white/5 transition-all text-sm font-serif italic group">
                                        <div className="w-[1px] h-4 bg-transparent group-hover:bg-executive-gold transition-colors" />
                                        AI Extraction
                                        <FileJson className="w-3.5 h-3.5 ml-auto opacity-30" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs#html-to-pdf" className="flex items-center gap-2 text-white/40 hover:text-executive-gold px-3 py-2 rounded-none hover:bg-white/5 transition-all text-sm font-serif italic group">
                                        <div className="w-[1px] h-4 bg-transparent group-hover:bg-executive-gold transition-colors" />
                                        HTML to PDF
                                        <Layers className="w-3.5 h-3.5 ml-auto opacity-30" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 py-20 md:pl-16 lg:pl-24 min-w-0 pb-48">
                    {children}
                </main>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .hidden-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hidden-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    )
}
