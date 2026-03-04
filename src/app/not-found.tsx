import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden pt-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black -z-10" />
            <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6">
                <FileQuestion className="h-10 w-10 text-indigo-500" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">404</h1>
            <p className="text-xl font-semibold text-gray-200 mb-2">Page Not Found</p>
            <p className="text-sm text-gray-400 mb-8 max-w-sm">
                The resource you are looking for does not exist, has been moved, or is temporarily unavailable.
            </p>
            <Button asChild className="bg-white text-black hover:bg-gray-200">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" /> Return to Homepage
                </Link>
            </Button>
        </div>
    )
}
