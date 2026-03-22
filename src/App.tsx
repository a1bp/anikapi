/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  Zap, 
  Image as ImageIcon, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  Search,
  Cpu,
  Globe,
  Code2,
  ChevronRight,
  Server,
  Play,
  BookOpen,
  Rocket,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Docs from './Docs';
import Terms from './Terms';

const BASE_URL = 'http://in.astryxtech.online:19136';

const endpoints = [
  {
    category: 'Status Endpoints',
    icon: <Activity className="w-5 h-5" />,
    items: [
      { name: 'Main Tracker', method: 'GET', path: '/track/{server}', example: `${BASE_URL}/track/hypixel.net`, description: 'Comprehensive server tracking data including players, version, and MOTD.' },
      { name: 'Java Status', method: 'GET', path: '/status/java/{server}', example: `${BASE_URL}/status/java/hypixel.net`, description: 'Specific status for Java Edition servers.' },
      { name: 'Bedrock Status', method: 'GET', path: '/status/bedrock/{server}', example: `${BASE_URL}/status/bedrock/pe.mineplex.com`, description: 'Specific status for Bedrock Edition servers.' },
      { name: 'Raw Data', method: 'GET', path: '/raw/{server}', example: `${BASE_URL}/raw/hypixel.net`, description: 'Unfiltered raw server response directly from the query.' },
    ]
  },
  {
    category: 'Fast Endpoints',
    icon: <Zap className="w-5 h-5" />,
    items: [
      { name: 'Ping', method: 'GET', path: '/ping/{server}', example: `${BASE_URL}/ping/hypixel.net`, description: 'Quick latency check for any server.' },
      { name: 'Players', method: 'GET', path: '/players/{server}', example: `${BASE_URL}/players/hypixel.net`, description: 'Current online player count and list.' },
    ]
  },
  {
    category: 'Media Endpoints',
    icon: <ImageIcon className="w-5 h-5" />,
    items: [
      { name: 'Server Icon', method: 'GET', path: '/icon/{server}', example: `${BASE_URL}/icon/hypixel.net`, description: 'Retrieve the 64x64 server icon as an image.' },
      { name: 'Player Head', method: 'GET', path: '/head/{username}', example: `${BASE_URL}/head/Notch`, description: 'Get a 3D render of a player head.' },
      { name: 'Player Head (Sized)', method: 'GET', path: '/head/{username}/{size}', example: `${BASE_URL}/head/Notch/512`, description: 'Get a player head with custom resolution.' },
      { name: 'Server Widget', method: 'GET', path: '/widget/{server}', example: `${BASE_URL}/widget/hypixel.net`, description: 'Ready-to-use visual server status widget.' },
    ]
  },
  {
    category: 'Advanced',
    icon: <Layers className="w-5 h-5" />,
    items: [
      { name: 'Bulk Lookup', method: 'POST', path: '/bulk', example: `${BASE_URL}/bulk`, description: 'Query multiple servers in a single request.', body: '{\n  "servers": ["hypixel.net", "play.example.com"]\n}' },
    ]
  }
];

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}

function LandingPage() {
  const [activeTab, setActiveTab] = useState('Status Endpoints');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Playground state
  const [playgroundServer, setPlaygroundServer] = useState('hypixel.net');
  const [playgroundEndpoint, setPlaygroundEndpoint] = useState('/track/');
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [playgroundView, setPlaygroundView] = useState<'json' | 'visual'>('visual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPlayground = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const isBulk = playgroundEndpoint === '/bulk';
      const proxyPath = isBulk ? 'bulk' : `${playgroundEndpoint.replace(/^\/|\/$/g, '')}/${playgroundServer}`;
      const url = `/api/proxy/${proxyPath}`;
      
      console.log(`[Playground] Requesting: ${url}`);
      
      const options: RequestInit = {
        method: isBulk ? 'POST' : 'GET',
        headers: isBulk ? { 'Content-Type': 'application/json' } : {},
        body: isBulk ? JSON.stringify({ servers: playgroundServer.split(',').map(s => s.trim()) }) : undefined
      };

      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Error: ${response.status} ${response.statusText}`);
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setPlaygroundResult(data);
      } else if (contentType && contentType.includes('image/')) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setPlaygroundResult({ isImage: true, url: imageUrl, type: contentType });
      } else {
        const text = await response.text();
        setPlaygroundResult({ isText: true, content: text, type: contentType });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setPlaygroundResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 scroll-smooth">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed inset-0 bg-radial-at-t from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">ANIK <span className="text-emerald-500">API</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <a href="#endpoints" className="hover:text-white transition-colors">Endpoints</a>
            <a href="#playground" className="hover:text-white transition-colors">Playground</a>
            <a href="#get-started" className="px-4 py-2 bg-white text-black rounded-full hover:bg-emerald-400 transition-all font-semibold">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              v1.0.0 STABLE
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              POWER YOUR <br /> MINECRAFT APPS
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              High-performance, low-latency API for Minecraft server tracking, 
              player data, and media assets. Built for developers who demand speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#get-started" className="px-8 py-4 bg-emerald-500 text-black rounded-full hover:bg-emerald-400 transition-all font-bold flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Get Started Free
              </a>
              <a href="#playground" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-bold flex items-center gap-2">
                <Play className="w-4 h-4" />
                Try Playground
              </a>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            { label: 'Uptime', value: '99.9%', icon: <Globe className="w-5 h-5 text-emerald-400" /> },
            { label: 'Avg Latency', value: '< 50ms', icon: <Zap className="w-5 h-5 text-amber-400" /> },
            { label: 'Daily Requests', value: '1.2M+', icon: <Cpu className="w-5 h-5 text-blue-400" /> },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                {stat.icon}
                <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </section>

        {/* Get Started Section */}
        <section id="get-started" className="mb-32 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Rocket className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-4xl font-bold">Get Started</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Endpoint', desc: 'Browse our documentation and find the endpoint that fits your needs.' },
              { step: '02', title: 'Make Request', desc: 'Use any HTTP client (fetch, axios, curl) to call our base URL with your parameters.' },
              { step: '03', title: 'Parse Response', desc: 'Receive clean, structured JSON data ready to be used in your application.' },
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-emerald-500/30 transition-all">
                <div className="text-5xl font-black text-white/5 absolute top-4 right-6 group-hover:text-emerald-500/10 transition-colors">{item.step}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Playground Section */}
        <section id="playground" className="mb-32 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Play className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-4xl font-bold">API Playground</h2>
          </div>
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-widest">
                    {playgroundEndpoint === '/bulk' ? 'Server Addresses (comma separated)' : 'Server Address'}
                  </label>
                  <input 
                    type="text" 
                    value={playgroundServer}
                    onChange={(e) => setPlaygroundServer(e.target.value)}
                    placeholder={playgroundEndpoint === '/bulk' ? 'hypixel.net, play.example.com' : 'e.g. hypixel.net'}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-500 mb-2 uppercase tracking-widest">Endpoint</label>
                  <select 
                    value={playgroundEndpoint}
                    onChange={(e) => setPlaygroundEndpoint(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono appearance-none"
                  >
                    <option value="/track/">/track/ (Main Tracker)</option>
                    <option value="/status/java/">/status/java/ (Java Status)</option>
                    <option value="/status/bedrock/">/status/bedrock/ (Bedrock Status)</option>
                    <option value="/ping/">/ping/ (Ping)</option>
                    <option value="/players/">/players/ (Players)</option>
                    <option value="/raw/">/raw/ (Raw Data)</option>
                    <option value="/icon/">/icon/ (Server Icon)</option>
                    <option value="/head/">/head/ (Player Head)</option>
                    <option value="/widget/">/widget/ (Server Widget)</option>
                    <option value="/bulk">/bulk (Bulk Lookup - POST)</option>
                  </select>
                </div>
                <button 
                  onClick={runPlayground}
                  disabled={isLoading}
                  className="w-full py-4 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  Execute Request
                </button>
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </div>
              <div className="bg-black/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col min-h-[400px]">
                <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Response Body</span>
                    {playgroundResult && !playgroundResult.isImage && !playgroundResult.isText && (
                      <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                        <button 
                          onClick={() => setPlaygroundView('visual')}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${playgroundView === 'visual' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'}`}
                        >
                          VISUAL
                        </button>
                        <button 
                          onClick={() => setPlaygroundView('json')}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${playgroundView === 'json' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'}`}
                        >
                          JSON
                        </button>
                      </div>
                    )}
                  </div>
                  {playgroundResult && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${playgroundResult.online || playgroundResult.isImage || playgroundResult.isText ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          {playgroundResult.online ? 'Online' : playgroundResult.isImage || playgroundResult.isText ? 'Success' : 'Offline'}
                        </span>
                      </div>
                      <CopyButton text={JSON.stringify(playgroundResult, null, 2)} />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-auto custom-scrollbar">
                  {playgroundResult ? (
                    <div className="space-y-6">
                      {playgroundResult.isImage ? (
                        <div className="flex flex-col items-center gap-4 p-8 bg-white/5 rounded-2xl border border-white/10">
                          <img 
                            src={playgroundResult.url} 
                            alt="API Result" 
                            className="max-w-full h-auto rounded-lg shadow-2xl"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Image Result ({playgroundResult.type})
                          </div>
                        </div>
                      ) : playgroundResult.isText ? (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Text Response ({playgroundResult.type})</div>
                          <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap">
                            {playgroundResult.content}
                          </pre>
                        </div>
                      ) : playgroundView === 'visual' ? (
                        <div className="space-y-6">
                          {/* Visual Status Card */}
                          <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 shadow-xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4">
                              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${playgroundResult.online ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                {playgroundResult.online ? 'Online' : 'Offline'}
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-6">
                              {playgroundResult.favicon ? (
                                <img 
                                  src={playgroundResult.favicon} 
                                  alt="Server Icon" 
                                  className="w-20 h-20 rounded-xl shadow-2xl border border-white/10"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-black/50 rounded-xl border border-white/10 flex items-center justify-center">
                                  <Server className="w-8 h-8 text-zinc-700" />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-white mb-1 truncate">{playgroundServer}</h3>
                                <div className="text-xs text-zinc-500 mb-4 font-mono">
                                  {playgroundResult.version?.name || 'Unknown Version'} • {playgroundResult.players?.online || 0}/{playgroundResult.players?.max || 0} Players
                                </div>
                                
                                {playgroundResult.motd?.html && (
                                  <div className="p-3 bg-black/50 rounded-lg border border-white/5">
                                    <div 
                                      className="minecraft-font text-sm leading-relaxed"
                                      dangerouslySetInnerHTML={{ __html: playgroundResult.motd.html }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {playgroundResult.players?.list && playgroundResult.players.list.length > 0 && (
                              <div className="mt-6 pt-6 border-t border-white/5">
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Online Players</div>
                                <div className="flex flex-wrap gap-2">
                                  {playgroundResult.players.list.slice(0, 12).map((player: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-md border border-white/5">
                                      <img 
                                        src={`/api/proxy/head/${player.name || player.uuid}/32`} 
                                        alt={player.name} 
                                        className="w-4 h-4 rounded-sm"
                                        referrerPolicy="no-referrer"
                                      />
                                      <span className="text-[10px] font-medium text-zinc-300">{player.name}</span>
                                    </div>
                                  ))}
                                  {playgroundResult.players.list.length > 12 && (
                                    <div className="px-2 py-1 bg-white/5 rounded-md border border-white/5 text-[10px] text-zinc-500">
                                      +{playgroundResult.players.list.length - 12} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Latency</div>
                              <div className="text-lg font-bold text-emerald-400">{playgroundResult.latency || 0}ms</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Protocol</div>
                              <div className="text-lg font-bold text-emerald-400">{playgroundResult.version?.protocol || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {playgroundResult.favicon && (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                              <img 
                                src={playgroundResult.favicon} 
                                alt="Server Favicon" 
                                className="w-12 h-12 rounded shadow-lg"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Server Icon</div>
                                <div className="text-xs text-zinc-400">Base64 Encoded PNG</div>
                              </div>
                            </div>
                          )}
                          
                          {playgroundResult.motd?.html && (
                            <div className="p-4 bg-black rounded-xl border border-white/10">
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Visual MOTD</div>
                              <div 
                                className="minecraft-font text-sm leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: playgroundResult.motd.html }}
                              />
                            </div>
                          )}

                          <div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Raw JSON</div>
                            <pre className="text-emerald-400 leading-relaxed">
                              {JSON.stringify(playgroundResult, null, 2)}
                            </pre>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                      <Code2 className="w-12 h-12 opacity-20" />
                      <p>Run a request to see the response</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints Section */}
        <section id="endpoints" className="mb-32 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Endpoints</h2>
              <p className="text-zinc-400">Explore our comprehensive list of available API routes.</p>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-64 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 space-y-2">
              {endpoints.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveTab(cat.category)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeTab === cat.category 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {cat.icon}
                  <span className="font-medium">{cat.category}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {endpoints.find(e => e.category === activeTab)?.items.map((item, i) => (
                    <div key={i} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            item.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                          }`}>
                            {item.method}
                          </span>
                          <h3 className="text-lg font-bold">{item.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={item.example} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <CopyButton text={item.example} />
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm mb-4">{item.description}</p>
                      <div className="bg-black/50 rounded-lg p-3 font-mono text-sm border border-white/5 flex items-center justify-between group-hover:border-emerald-500/30 transition-colors">
                        <span className="text-zinc-300 truncate mr-4">{item.path}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      {item.body && (
                        <div className="mt-4">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2 tracking-widest">Request Body</div>
                          <pre className="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-white/5 overflow-x-auto">
                            {item.body}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-12 pb-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="font-bold tracking-tight">ANIK <span className="text-emerald-500">API</span></span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <a href="https://discord.gg/CY7DQAGCp5" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
              <a href="https://github.com/a1bp/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <div className="text-sm text-zinc-600">
              © 2026 ANIK API. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @font-face {
          font-family: 'Minecraft';
          src: url('https://fonts.cdnfonts.com/s/14893/Minecraftia-Regular.woff') format('woff');
        }
        .minecraft-font {
          font-family: 'Minecraft', 'Courier New', Courier, monospace;
        }
        .minecraft-font span {
          display: inline !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

