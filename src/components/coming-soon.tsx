'use client'

import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function GenericComingSoon() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden pt-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg text-center"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center">
                        <FileText className="h-10 w-10 text-indigo-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">Coming Soon</h1>
                <p className="text-lg text-gray-400 mb-10">
                    This section is currently under development. We are working hard to bring you the best experience possible. Check back soon!
                </p>

                <Button asChild className="bg-white text-black hover:bg-gray-200">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </motion.div>
        </div>
    )
}
