'use client'

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { FileCode2, Layers, Zap, Shield, ChevronRight, Terminal, Cpu } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const [ctaHref, setCtaHref] = useState("/signup")

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setCtaHref("/dashboard")
      }
    }
    checkAuth()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6 z-10"
        style={{ opacity, scale }}
      >
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-8"
          >
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="font-medium">DocuNexu API v2.0 is now live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 text-white leading-[1.1]"
          >
            The Intelligence Layer <br className="hidden md:block" /> for Documents
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Extract, merge, and manipulate complex documents with zero infrastructure. Built for high-volume engineering teams who ship fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center gap-5 items-center"
          >
            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] rounded-xl" asChild>
              <Link href={ctaHref}>
                Start Building Free <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all rounded-xl" asChild>
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Code Mockup */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        className="relative z-20 container mx-auto px-4 -mt-10 md:-mt-20 mb-32"
      >
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#050505] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row">

            {/* Code Side */}
            <div className="flex-1 p-6 md:p-8 md:border-r border-white/5">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-xs text-gray-500 font-mono">extract.ts</div>
              </div>
              <pre className="font-mono text-sm md:text-base leading-loose text-gray-300 overflow-x-auto">
                <span className="text-purple-400">import</span> {'{'} DocuNexu {'}'} <span className="text-purple-400">from</span> <span className="text-emerald-400">'@docunexu/sdk'</span>;<br /><br />
                <span className="text-blue-400">const</span> nx = <span className="text-purple-400">new</span> DocuNexu(process.env.API_KEY);<br /><br />
                <span className="text-gray-500">// Extract multi-page tables into JSON arrays</span><br />
                <span className="text-blue-400">const</span> result = <span className="text-purple-400">await</span> nx.extract(<span className="text-emerald-400">"q3_report.pdf"</span>);<br /><br />
                console.<span className="text-blue-300">log</span>(result.tables[0].columns);<br />
                <span className="text-gray-500">//  ['Revenue', 'Expenses', 'Net Income']</span>
              </pre>
            </div>

            {/* Response Side */}
            <div className="w-full md:w-80 bg-black/50 p-6 md:p-8 flex flex-col justify-center">
              <div className="text-xs text-blue-400 font-mono mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Output
              </div>
              <pre className="font-mono text-xs text-blue-300/80 leading-relaxed overflow-x-auto bg-blue-950/20 p-4 rounded-lg border border-blue-900/30">
                {`{
  "status": "success",
  "confidence": 0.99,
  "pages_processed": 14,
  "data": {
    "tables": [
      {
        "id": "tbl_1",
        "rows": 42
      }
    ]
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-24 relative z-10 bg-black">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Everything you need to build document apps</h2>
            <p className="text-gray-400 text-lg">Powerful APIs designed for edge runtimes, serverless functions, and modern frontend frameworks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={FileCode2}
              title="Spatial Layout Analysis"
              desc="Our AI understands document geometry, extracting complex nested tables and forms exactly as they appear visually."
              delay={0}
            />
            <FeatureCard
              icon={Layers}
              title="Byte-level Manipulation"
              desc="Merge thousands of PDFs, split by bookmarks, or rotate pages on the fly without loading the entire document in memory."
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="Stateless Architecture"
              desc="Military-grade security by default. We process your documents and purge them instantly. Zero data retention."
              delay={0.2}
            />
            <FeatureCard
              icon={Cpu}
              title="Edge Native"
              desc="Built on global edge networks to ensure sub-100ms latency anywhere in the world."
              delay={0.3}
            />
            <FeatureCard
              icon={Zap}
              title="High Throughput"
              desc="Handle sudden traffic spikes with auto-scaling infrastructure capable of processing millions of pages."
              delay={0.4}
            />
            <FeatureCard
              icon={Terminal}
              title="Developer First"
              desc="Comprehensive SDKs, typed responses, and interactive documentation to get you to production faster."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative z-10 border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container px-4 mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to integrate?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Get your API key in seconds and start processing documents for free. No credit card required to start.
          </p>
          <Button size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30 hover:scale-105 transition-all" asChild>
            <Link href={ctaHref}>
              {ctaHref === "/dashboard" ? "Go to Dashboard" : "Create an Account"}
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-indigo-500/30 transition-all group flex flex-col gap-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}
