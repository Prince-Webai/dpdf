import { SignupForm } from "./signup-form";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <SignupForm />
        </Suspense>
    );
}
