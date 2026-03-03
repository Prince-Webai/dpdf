'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, FileJson, Layers, Cpu, Zap, Lock, FileText, Pentagon, Globe, Sparkles, ShieldCheck, Database } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="flex min-h-screen bg-executive-black text-white selection:bg-executive-gold selection:text-black relative flex-col overflow-hidden">
      <div className="executive-grain" />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-executive-gold/10 rounded-none blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-none blur-[120px]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 130, 74, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`
          }}
        />
      </div>

      <div className="flex flex-col min-h-screen relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="container px-4 md:px-6 mx-auto text-center max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 border border-executive-gold/20 bg-executive-gold/5 px-4 py-2 rounded-none text-[10px] tracking-[0.4em] uppercase text-executive-gold mb-12 backdrop-blur-md shadow-[0_0_20px_rgba(156,130,74,0.1)]">
                <Sparkles className="w-3 h-3 animate-spin-slow" />
                <span>Quantum Intelligence Protocol Enabled</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-10 font-normal leading-tight tracking-tighter">
                <span className="block overflow-hidden h-[1.1em]">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    Orchestrate
                  </motion.span>
                </span>
                <span className="block overflow-hidden h-[1.1em] text-white/30 italic">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    Every Document
                  </motion.span>
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl text-white/40 mb-16 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
              >
                The world's most sophisticated PDF API framework.
                Secure. Scalable. Stunningly precise extraction.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row justify-center gap-6"
              >
                <Link href="/signup" className="group relative">
                  <div className="absolute -inset-0.5 bg-executive-gold rounded-none blur-md opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <Button size="lg" className="relative h-14 px-10 bg-executive-gold text-black hover:bg-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-none transition-all duration-500 overflow-hidden border border-executive-gold/20">
                    <span className="relative z-10 flex items-center">
                      Start Integration <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-10 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-[11px] tracking-[0.2em] uppercase font-bold rounded-none transition-all duration-500" asChild>
                  <Link href="/docs">
                    Protocol Docs
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-executive-gold/50 to-transparent animate-bounce" />
          </motion.div>
        </section>

        {/* Live Preview / Code Section */}
        <section className="py-48 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative group lg:max-w-5xl mx-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-executive-gold/20 via-transparent to-indigo-500/20 rounded-none blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative border border-white/10 bg-executive-black/80 backdrop-blur-3xl rounded-none overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-none bg-red-500/50" />
                    <div className="w-3 h-3 rounded-none bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-none bg-green-500/50" />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-white/30 font-mono">
                    <Globe className="w-3 h-3" />
                    <span>ENDPOINT: /v1/pdf/extract</span>
                  </div>
                  <div className="w-12 h-3" /> {/* Spacer */}
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="p-8 border-r border-white/5 bg-black/40">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-executive-gold font-bold">Request Payload</span>
                      <div className="h-1 w-12 bg-executive-gold/20" />
                    </div>
                    <div className="text-sm font-mono text-white/60 leading-relaxed overflow-x-auto">
                      <pre>
                        {`{
  "protocol": "docunexus-v1",
  "source": {
     "type": "url",
     "url": "https://vault.nexus/inv.pdf"
  },
  "extraction": {
     "mode": "strategic",
     "format": "structured_json"
  },
  "security": "encrypted"
}`}
                      </pre>
                    </div>
                  </div>
                  <div className="p-8 bg-black/60 relative group-hover:bg-black/80 transition-colors">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-emerald-500/70 font-bold">Response: 200 OK</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-75" />
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse delay-150" />
                      </div>
                    </div>
                    <div className="text-sm font-mono text-emerald-500/80 leading-relaxed overflow-x-auto">
                      <pre>
                        {`{
  "status": "ready",
  "id": "dn_67x92j",
  "data": {
    "entity": "Nexus Strategic",
    "total": 1250.00,
    "confidence": 0.998,
    "items": [
      { "desc": "AI Compute", "amt": 800 },
      { "desc": "Bandwidth", "amt": 450 }
    ]
  }
}`}
                      </pre>
                    </div>

                    <div className="absolute bottom-8 right-8">
                      <div className="p-4 rounded-none border border-white/10 bg-executive-black/50 backdrop-blur-md flex items-center gap-4 animate-float">
                        <div className="w-10 h-10 rounded-none bg-executive-gold/10 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-executive-gold" />
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-[10px] tracking-[0.1em] uppercase text-white/40">Extraction Verification</p>
                          <p className="font-serif text-sm italic">Verified Secure</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-64 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mb-32">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-executive-gold text-[10px] tracking-[0.5em] uppercase font-bold block mb-6"
              >
                Operational Dominance
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-serif leading-tight"
              >
                Built for high-stakes <br /><span className="text-white/40 italic">document orchestration.</span>
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { title: "AI Core Extraction", desc: "No more rigid templates. Our AI understands layouts naturally.", icon: Cpu, color: "text-blue-400" },
                { title: "Strategic Merge", desc: "Surgically combine documents while maintaining metadata integrity.", icon: Layers, color: "text-purple-400" },
                { title: "Secure Protocol", desc: "AES-256 encryption at rest and TLS 1.3 in transit.", icon: Lock, color: "text-emerald-400" },
                { title: "Nexus Playground", desc: "Integrated sandbox for rapid protocol testing and debugging.", icon: Code, color: "text-pink-400" },
                { title: "Delta Usage Logs", desc: "Real-time auditing of every request and credit utilization.", icon: Database, color: "text-orange-400" },
                { title: "Velocity Platform", desc: "Sub-second processing speeds for enterprise-scale workloads.", icon: Zap, color: "text-yellow-400" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="p-10 border border-white/5 bg-executive-panel/50 backdrop-blur-sm relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className={`mb-8 w-12 h-12 flex items-center justify-center bg-black border border-white/5 group-hover:border-executive-gold/30 group-hover:bg-executive-gold/5 transition-all duration-500`}>
                    <feature.icon className={`w-6 h-6 stroke-[1px] ${feature.color} group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className="text-xl font-serif mb-4 group-hover:text-executive-gold transition-colors">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed font-light text-sm">{feature.desc}</p>

                  <motion.div
                    className="h-[1px] bg-executive-gold w-0 absolute bottom-0 left-0 transition-all duration-500 group-hover:w-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-60 relative overflow-hidden">
          <div className="absolute inset-0 bg-executive-gold/[0.02] z-0" />
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Pentagon className="w-16 h-16 text-executive-gold/40 mx-auto mb-12 animate-pulse" />
              <h2 className="text-5xl md:text-8xl font-serif mb-12 tracking-tight">
                Execute the future of <br /><span className="text-white/30 italic">intelligent data.</span>
              </h2>
              <p className="text-xl text-white/40 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
                Join elite development teams orchestrating mission-critical
                document workflows at scale.
              </p>

              <Link href="/signup" className="inline-block relative group">
                <div className="absolute -inset-1 bg-white rounded-none blur-md opacity-5 group-hover:opacity-15 transition duration-500"></div>
                <Button size="lg" className="h-16 px-14 bg-white text-black hover:bg-executive-gold hover:text-white transition-all duration-500 text-[11px] tracking-[0.3em] font-bold uppercase rounded-none border border-white/10 group-hover:border-executive-gold/20">
                  Initiate Deployment
                </Button>
              </Link>

              <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 px-12">
                <span className="font-serif italic text-lg whitespace-nowrap">Global Secure</span>
                <span className="font-serif italic text-lg whitespace-nowrap">Enterprise API</span>
                <span className="font-serif italic text-lg whitespace-nowrap">Quantum Scaling</span>
                <span className="font-serif italic text-lg whitespace-nowrap">Strategic Data</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Custom Animations Styles */}
      <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
    </div>
  )
}
