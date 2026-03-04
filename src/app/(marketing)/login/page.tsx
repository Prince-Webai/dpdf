import { LoginForm } from "./login-form";
import { Suspense } from "react";

export const revalidate = 0

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
