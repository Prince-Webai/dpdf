import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { LoginForm } from './login-form'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex justify-center items-center">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
