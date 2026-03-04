<<<<<<< HEAD:src/app/login/page.tsx
import { LoginForm } from "./login-form";
import { Suspense } from "react";
=======
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { LoginForm } from './login-form'

export const revalidate = 0
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI):src/app/(marketing)/login/page.tsx

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
