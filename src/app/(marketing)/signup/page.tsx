import { SignupForm } from "./signup-form";
import { Suspense } from "react";

export const revalidate = 0

export default function SignupPage() {
    return (
        <Suspense fallback={null}>
            <SignupForm />
        </Suspense>
    );
}
