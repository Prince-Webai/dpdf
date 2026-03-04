import { SignupForm } from "./signup-form";
import { Suspense } from "react";

<<<<<<< HEAD:src/app/signup/page.tsx
export default function Page() {
=======
export const revalidate = 0

export default function SignupPage() {
>>>>>>> 9d56d33 (feat: redesign dashboard with realtime intelligence and fluid UI):src/app/(marketing)/signup/page.tsx
    return (
        <Suspense fallback={null}>
            <SignupForm />
        </Suspense>
    );
}
