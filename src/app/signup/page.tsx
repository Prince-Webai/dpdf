import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { SignupForm } from './signup-form'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-executive-black flex justify-center items-center">
                <Loader2 className="h-8 w-8 text-executive-gold animate-spin" />
            </div>
        }>
            <SignupForm />
        </Suspense>
    )
}

