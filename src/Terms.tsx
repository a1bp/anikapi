import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ChevronLeft, Shield, Scale, FileText, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed inset-0 bg-radial-at-t from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">ANIK <span className="text-emerald-500">API</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            TERMS OF SERVICE
          </h1>
          <p className="text-zinc-400 mb-12">Last updated: March 22, 2026</p>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                By accessing and using ANIK API, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services. We reserve the 
                right to modify these terms at any time, and your continued use of the API 
                constitutes acceptance of those changes.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">2. API Usage & Limits</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Our API is provided "as is" and is intended for developers to track Minecraft 
                server data. While we offer a free tier, we expect fair usage:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                <li>Do not attempt to bypass rate limits or security measures.</li>
                <li>Do not use the API for any illegal or malicious activities.</li>
                <li>Commercial use is permitted as long as it doesn't degrade service for others.</li>
                <li>We reserve the right to throttle or block IPs that abuse the system.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Scale className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold">3. Data Accuracy</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                While we strive for 99.9% uptime and accurate data, ANIK API does not guarantee 
                the accuracy of the information retrieved from third-party Minecraft servers. 
                Server status, player counts, and MOTDs are subject to the response of the 
                target server.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                ANIK API shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible 
                losses resulting from your use of the service.
              </p>
            </section>
          </div>

          <footer className="mt-20 pt-12 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm">
              Questions about our terms? Contact us on <a href="https://discord.gg/CY7DQAGCp5" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Discord</a>.
            </p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
