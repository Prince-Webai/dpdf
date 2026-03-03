import React from "react";
import { KeySquare, ShieldCheck, Fingerprint } from "lucide-react";
import Link from "next/link";

export default function AuthenticationGuidePage() {
    return (
        <div className="space-y-12 max-w-5xl mx-auto py-8">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-executive-gold/10 border border-executive-gold/20 text-executive-gold text-xs font-mono tracking-wider mb-2">
                    <ShieldCheck className="w-3 h-3" />
                    <span>SECURITY</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Authentication Guide</h1>
                <p className="text-white/60 max-w-3xl font-mono text-sm leading-relaxed">
                    Secure your integrations with DocuNexus API using Bearer tokens. We enforce strict authentication on all extraction and administrative endpoints to ensure your document data remains private.
                </p>
            </header>

            <section className="space-y-8 mt-12">
                <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-4">API Keys</h2>
                <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-lg text-sm text-white/70 font-mono leading-relaxed">
                    <p>API requests are authenticated using Bearer tokens in the Authorization header. You must include your secret API key in all requests. Your API keys carry many privileges, so please keep them secure.</p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-lg font-mono text-xs overflow-x-auto relative">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-white/5 text-white/30 text-[10px] m-2 rounded">BASH</div>
                    <pre className="text-white/80"><code className="language-bash">
                        curl "https://api.docunexus.com/v1/extract/sync" \
                        -H "Authorization: Bearer dn_live_xxxxxxxxxxxxxxxxx" \
                        -F "file=@/path/to/invoice.pdf"
                    </code></pre>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard/api-keys" className="inline-flex items-center gap-2 bg-executive-gold text-black px-6 py-2 text-xs font-bold font-mono tracking-wider hover:bg-white transition-colors">
                        <KeySquare className="w-4 h-4" />
                        GENERATE API KEY
                    </Link>
                </div>
            </section>

            <section className="space-y-8 mt-16">
                <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-4">Environments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-lg flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Fingerprint className="text-blue-400 w-5 h-5" />
                            <h3 className="font-serif text-xl text-white">Sandbox</h3>
                        </div>
                        <p className="text-white/60 text-sm font-mono leading-relaxed">Sandbox keys allow you to test your integration without consuming real credits or storing permanent data. Sandbox extraction guarantees processing of up to 5 pages.</p>
                        <code className="bg-black/40 text-blue-300 p-2 text-xs text-center border border-blue-500/20 rounded">Prefix: dn_test_</code>
                    </div>

                    <div className="bg-executive-gold/5 border border-executive-gold/20 p-6 rounded-lg flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-executive-gold w-5 h-5" />
                            <h3 className="font-serif text-xl text-white">Production</h3>
                        </div>
                        <p className="text-white/60 text-sm font-mono leading-relaxed">Production keys are used on your live platform, deducting credits per extraction operation. Ensure these are stored securely via environment variables.</p>
                        <code className="bg-black/40 text-executive-gold px-2 py-2 text-xs text-center border border-executive-gold/20 rounded">Prefix: dn_live_</code>
                    </div>
                </div>
            </section>

            <section className="space-y-6 mt-16 pb-12">
                <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-4">Error Handling</h2>
                <p className="text-white/60 text-sm font-mono mb-6">If authentication fails, the API returns a <code className="text-red-400 font-bold">401 Unauthorized</code> error. Ensure the formatting of the Bearer prefix is correct.</p>
                <div className="bg-[#0a0a0a] border border-red-500/20 rounded-lg p-4 font-mono text-sm overflow-x-auto relative">
                    <pre className="text-red-300">{`{
  "status": "error",
  "error": {
    "code": "unauthorized",
    "message": "Invalid or missing API Key provided."
  }
}`}</pre>
                </div>
            </section>
        </div>
    );
}
