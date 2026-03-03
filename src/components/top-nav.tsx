'use client'

import { useProfile } from '@/context/profile-context'
import { User, Zap, ChevronDown, ShieldAlert } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

export function TopNav() {
    const { user, fullName, plan, credits, creditLimit } = useProfile()
    const router = useRouter()

    return (
        <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-12 bg-executive-black/90 backdrop-blur-md font-mono text-[10px] uppercase tracking-widest relative z-50">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-white/40 mb-1">CURRENT PROTOCOL</span>
                    <span className="text-executive-gold flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        {plan} ARCHITECTURE
                    </span>
                </div>
                <div className="h-8 w-px bg-white/[0.05]" />
                <div className="flex flex-col">
                    <span className="text-white/40 mb-1">RESOURCE ALLOCATION</span>
                    <span className="text-white">
                        {credits.toLocaleString()} / {creditLimit.toLocaleString()} UNITS
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-4 group outline-none">
                        <div className="flex flex-col items-end">
                            <span className="text-white group-hover:text-executive-gold transition-colors">{fullName}</span>
                            <span className="text-white/40 text-[9px]">{user?.email}</span>
                        </div>
                        <div className="w-10 h-10 border border-white/[0.05] flex items-center justify-center group-hover:border-executive-gold transition-all">
                            <User className="h-4 w-4 text-white group-hover:text-executive-gold" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-executive-black border-white/[0.05] rounded-none text-[10px] uppercase tracking-widest font-mono p-2 w-56">
                        <DropdownMenuLabel className="text-white/40 px-2 py-1.5 font-bold">IDENTITY CONTROL</DropdownMenuLabel>
                        <DropdownMenuItem className="focus:bg-white/[0.05] focus:text-executive-gold transition-all cursor-pointer p-2" onClick={() => router.push('/dashboard')}>
                            STRATEGIC OVERVIEW
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/[0.05] focus:text-executive-gold transition-all cursor-pointer p-2" onClick={() => router.push('/dashboard/settings')}>
                            PROTOCOL SETTINGS
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.05]" />
                        <DropdownMenuLabel className="text-white/40 px-2 py-1.5 font-bold">SAFETY PROTOCOLS</DropdownMenuLabel>
                        <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-500 transition-all cursor-pointer p-2 flex items-center justify-between" onClick={() => router.push('/dashboard/settings')}>
                            <span>DEACTIVATE ACCOUNT</span>
                            <ShieldAlert className="h-3.5 w-3.5" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
