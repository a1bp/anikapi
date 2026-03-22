import React from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  Terminal, 
  Activity, 
  Zap, 
  ImageIcon, 
  Layers, 
  Code2, 
  Copy, 
  Check,
  ArrowLeft,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const BASE_URL = 'http://in.astryxtech.online:19136';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white">
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            <span className="font-bold text-xl tracking-tight">ANIK <span className="text-emerald-500">API</span> <span className="text-zinc-500 font-normal text-sm ml-2">DOCS</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/CY7DQAGCp5" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block space-y-8 sticky top-28 h-fit">
          <div className="relative group mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search docs..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                const sections = document.querySelectorAll('main section');
                sections.forEach(section => {
                  const text = section.textContent?.toLowerCase() || '';
                  if (text.includes(query)) {
                    (section as HTMLElement).style.display = 'block';
                  } else {
                    (section as HTMLElement).style.display = 'none';
                  }
                });
              }}
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Introduction</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#getting-started" className="text-emerald-400 hover:underline">Getting Started</a></li>
              <li><a href="#authentication" className="text-zinc-400 hover:text-white transition-colors">Authentication</a></li>
              <li><a href="#rate-limiting" className="text-zinc-400 hover:text-white transition-colors">Rate Limiting</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Endpoints</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#status" className="text-zinc-400 hover:text-white transition-colors">Status Endpoints</a></li>
              <li><a href="#fast" className="text-zinc-400 hover:text-white transition-colors">Fast Endpoints</a></li>
              <li><a href="#media" className="text-zinc-400 hover:text-white transition-colors">Media Endpoints</a></li>
              <li><a href="#advanced" className="text-zinc-400 hover:text-white transition-colors">Advanced</a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-20 pb-32">
          <section id="getting-started">
            <h1 className="text-5xl font-black mb-6">Getting Started</h1>
            <p className="text-xl text-zinc-400 leading-relaxed mb-8">
              Welcome to the ANIK API documentation. Our API provides a set of high-performance endpoints 
              to track Minecraft server status, retrieve player heads, and generate server icons.
            </p>
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                Base URL
              </h3>
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg font-mono text-emerald-400">
                <span>{BASE_URL}</span>
                <CopyButton text={BASE_URL} />
              </div>
            </div>
          </section>

          <section id="authentication">
            <h2 className="text-3xl font-bold mb-6">Authentication</h2>
            <p className="text-zinc-400 leading-relaxed">
              Currently, ANIK API is <strong>publicly accessible</strong> and does not require an API key for standard usage. 
              Simply make requests directly to our endpoints.
            </p>
          </section>

          <section id="rate-limiting">
            <h2 className="text-3xl font-bold mb-6">Rate Limiting</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              To maintain service quality, we enforce a rate limit of <strong>60 requests per minute</strong> per IP address. 
              Exceeding this will result in a <code>429 Too Many Requests</code> error.
            </p>
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
              <h4 className="font-bold mb-4">Error Response</h4>
              <pre className="bg-black/40 p-4 rounded-lg text-sm font-mono text-red-400">
{`{
  "error": "Rate limit exceeded",
  "retry_after": 45
}`}
              </pre>
            </div>
          </section>

          <section id="status">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Activity className="text-emerald-400" />
              Status Endpoints
            </h2>
            <div className="space-y-12">
              {/* Track Endpoint */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">GET</span>
                  <h3 className="text-xl font-bold">/track/:server</h3>
                </div>
                <p className="text-zinc-400">The primary endpoint for comprehensive server tracking. Returns everything from player counts to HTML MOTDs and favicons.</p>
                <div className="bg-zinc-950 rounded-xl border border-white/5 p-6">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Example Response</h4>
                  <pre className="text-sm font-mono text-zinc-300 overflow-x-auto">
{`{
  "online": true,
  "host": "hypixel.net",
  "port": 25565,
  "version": { "name": "1.8.x", "protocol": 47 },
  "players": { "online": 45231, "max": 100000 },
  "motd": { 
    "clean": "Hypixel Network",
    "html": "<span>...</span>" 
  },
  "favicon": "data:image/png;base64,..."
}`}
                  </pre>
                </div>
              </div>

              {/* Java Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">GET</span>
                  <h3 className="text-xl font-bold">/status/java/:server</h3>
                </div>
                <p className="text-zinc-400">Specific status check for Java Edition servers. Optimized for standard PC Minecraft servers.</p>
              </div>

              {/* Bedrock Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">GET</span>
                  <h3 className="text-xl font-bold">/status/bedrock/:server</h3>
                </div>
                <p className="text-zinc-400">Specific status check for Bedrock Edition (PE/Console) servers.</p>
              </div>
            </div>
          </section>

          <section id="fast">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Zap className="text-amber-400" />
              Fast Endpoints
            </h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">GET</span>
                  <h3 className="text-xl font-bold">/ping/:server</h3>
                </div>
                <p className="text-zinc-400">Returns only the latency (ms) and online status. Perfect for high-frequency monitoring.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">GET</span>
                  <h3 className="text-xl font-bold">/players/:server</h3>
                </div>
                <p className="text-zinc-400">Returns a simplified object containing only player-related data (online, max, and sample list if available).</p>
              </div>
            </div>
          </section>

          <section id="media">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <ImageIcon className="text-purple-400" />
              Media Endpoints
            </h2>
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <h4 className="font-bold mb-2">Player Head</h4>
                  <code className="text-emerald-400 text-sm block mb-4">/head/:username/:size?</code>
                  <div className="flex items-center gap-4">
                    <img src={`${BASE_URL}/head/Notch/128`} alt="Notch Head" className="w-16 h-16 rounded-lg bg-black/40 p-2" referrerPolicy="no-referrer" />
                    <p className="text-xs text-zinc-500">Size defaults to 64px if not specified.</p>
                  </div>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <h4 className="font-bold mb-2">Server Icon</h4>
                  <code className="text-emerald-400 text-sm block mb-4">/icon/:server</code>
                  <img src={`${BASE_URL}/icon/hypixel.net`} alt="Server Icon" className="w-16 h-16 rounded-lg bg-black/40 p-2" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                <h4 className="font-bold mb-2">Server Widget</h4>
                <code className="text-emerald-400 text-sm block mb-4">/widget/:server</code>
                <p className="text-zinc-400 text-sm mb-4">Returns a generated image representing the server status. Ideal for forum signatures or simple website embeds.</p>
                <img src={`${BASE_URL}/widget/hypixel.net`} alt="Server Widget" className="max-w-full h-auto rounded-lg border border-white/10" referrerPolicy="no-referrer" />
              </div>
            </div>
          </section>

          <section id="advanced">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Layers className="text-blue-400" />
              Advanced
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded uppercase">POST</span>
                  <h3 className="text-xl font-bold">/bulk</h3>
                </div>
                <p className="text-zinc-400">Query multiple servers in a single request to minimize network overhead.</p>
                <div className="bg-zinc-950 rounded-xl border border-white/5 p-6">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Request Body</h4>
                  <pre className="text-sm font-mono text-emerald-400 mb-6">
{`{
  "servers": ["hypixel.net", "play.example.com", "pe.mineplex.com"]
}`}
                  </pre>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase mb-4">Response</h4>
                  <p className="text-sm text-zinc-400">Returns an array of status objects corresponding to the input servers.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
