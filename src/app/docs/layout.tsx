import Link from "next/link"
import { FileText, Key, UploadCloud, FileJson, Layers, BookOpen, ChevronRight } from "lucide-react"

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen relative pt-20">
            {/* Top Navigation Background Blur built into main layout, we just add padding */}
            <div className="flex flex-1 container mx-auto px-4 md:px-6 max-w-7xl">

                {/* Left Sidebar */}
                <aside className="w-64 flex-shrink-0 hidden md:block py-10 pr-8 border-r border-white/10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto hidden-scrollbar">
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-semibold text-white mb-3 text-sm tracking-wider uppercase flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-400" /> Getting Started
                            </h4>
                            <ul className="space-y-1.5">
                                <li>
                                    <Link href="/docs" className="flex items-center justify-between text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-sm">
                                        Introduction
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs#authentication" className="flex items-center justify-between text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-sm">
                                        Authentication
                                        <Key className="w-3.5 h-3.5 opacity-50" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-3 text-sm tracking-wider uppercase flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-400" /> API Reference
                            </h4>
                            <ul className="space-y-1">
                                <li>
                                    <Link href="/docs#upload" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-sm group">
                                        <div className="w-1 h-4 bg-transparent group-hover:bg-emerald-500 rounded-full transition-colors" />
                                        File Upload
                                        <UploadCloud className="w-3.5 h-3.5 ml-auto opacity-50" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs#pdf-to-json" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-sm group">
                                        <div className="w-1 h-4 bg-transparent group-hover:bg-indigo-500 rounded-full transition-colors" />
                                        PDF to JSON
                                        <FileJson className="w-3.5 h-3.5 ml-auto opacity-50" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/docs#merge-split" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-sm group">
                                        <div className="w-1 h-4 bg-transparent group-hover:bg-blue-500 rounded-full transition-colors" />
                                        Merge / Split
                                        <Layers className="w-3.5 h-3.5 ml-auto opacity-50" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-3 text-sm tracking-wider uppercase">Resources</h4>
                            <ul className="space-y-1.5">
                                <li><Link href="/docs#rate-limits" className="text-gray-400 hover:text-white px-3 py-2 rounded-md block text-sm transition-colors">Rate Limits & Errors</Link></li>
                                <li><Link href="/dashboard" className="text-gray-400 hover:text-white px-3 py-2 rounded-md block text-sm transition-colors">Developer Dashboard</Link></li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 py-10 md:pl-10 lg:pl-16 min-w-0 pb-32">
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
