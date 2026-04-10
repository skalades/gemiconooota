import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Code2, Cpu, ShoppingBag, ExternalLink, Mail, Instagram, MessageSquare,
  ChevronRight, Globe, ArrowUpRight, Zap, CheckCircle2, Menu, X, Twitter, Github, ArrowRight,
  Pickaxe, Mountain
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

// Images (since these were imported, I'll keep them to avoid broken image links on first load)
// For dynamic images, we'll try to just load the path returned by the API if it's external, 
// but since the original imported them, I'll stick to dynamic string paths or the API can provide full URL.
import heroMain from '../assets/hero_main.png';
// We'll use the API for data, but fallbacks for images if needed.

const Box = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
)

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500 ${
      scrolled ? 'top-4' : 'top-8'
    }`}>
      <div className="glass-card px-6 md:px-10 py-4 flex items-center justify-between border-white/5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gem-gold rounded-xl flex items-center justify-center text-obsidian gem-glow-gold">
            <Pickaxe className="w-5 h-5" />
          </div>
          <span className="font-display font-bold tracking-tight text-xl text-white">GEMICONOTA</span>

        </div>

        <div className="hidden lg:flex items-center gap-10">
          {['About', 'Services', 'Store', 'Works'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-gem-gold transition-colors"

            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="/admin/dashboard" className="hidden sm:block glass-button px-4">Admin UI</a>
          <button className="hidden sm:block neon-button">Start Project</button>
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white/70"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden glass-card mt-4 p-8 flex flex-col gap-6 items-center"
          >
            {['About', 'Services', 'Store', 'Works', 'Admin UI'].map((item) => (
              <a 
                key={item} 
                href={item === 'Admin UI' ? '/admin/dashboard' : `#${item.toLowerCase()}`} 
                className="text-xs font-bold uppercase tracking-widest text-white/60"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <button className="neon-button w-full">Start Project</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionTitle = ({ subtitle, title, centered = false }: { subtitle: string, title: string, centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <motion.span 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-gem-gold font-mono text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block"

    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-6xl font-display font-bold leading-tight"
    >
      {title}
    </motion.h2>
  </div>
);

export default function LandingPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Fetch data from backend
    axios.get('http://localhost:3001/api/content')
      .then(res => setData(res.data))
      .catch(err => console.error(err));

    // Fetch config and setup Midtrans script dynamically
    axios.get('http://localhost:3001/api/config')
      .then(res => {
        const { isProduction, midtransClientKey } = res.data;
        const scriptId = 'midtrans-script';
        
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = isProduction 
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
          script.setAttribute('data-client-key', midtransClientKey);
          document.head.appendChild(script);
        }
      })
      .catch(err => console.error('Failed to load Midtrans config', err));
  }, []);

  const handleCheckout = async (product: any) => {
    try {
      const res = await axios.post('http://localhost:3001/api/checkout', { product });
      const { token } = res.data;
      if (token && window.snap) {
        window.snap.pay(token);
      } else {
        alert("Payment module is not loaded yet.");
      }
    } catch (err) {
      console.error(err);
      alert('Failed to init checkout');
    }
  };

  if (!data) {
    return <div className="min-h-screen bg-obsidian flex items-center justify-center text-gem-gold">Loading system...</div>;

  }

  return (
    <div className="bg-obsidian min-h-screen text-slate-300 selection:bg-gem-gold selection:text-obsidian">

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-mesh">
        <div className="technical-grid absolute inset-0 opacity-20" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gem-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gem-copper/10 blur-[120px] rounded-full" />


        <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card mb-8 border-white/5">
                  <span className="w-2 h-2 bg-gem-gold rounded-full gem-glow-gold" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{data.hero.subtitle}</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-8 text-white" 
                    dangerouslySetInnerHTML={{__html: data.hero.title}} />
                <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-12">
                  {data.hero.description}
                </p>
                <div className="flex flex-wrap gap-6">
                  <button className="neon-button flex items-center gap-3 group px-10 py-5">
                    {data.hero.buttonPrimary} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button className="glass-button px-10 py-5">{data.hero.buttonSecondary}</button>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-6 relative">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-auto lg:h-[700px] border border-white/10 shadow-2xl">
                <img src={heroMain} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 md:px-10 max-w-[1400px] mx-auto">
        <SectionTitle subtitle="Our Expertise" title="Engineered for Impact." />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {data.services.map((service: any, index: number) => {
             // For brevity, mapping dynamic services into our cool bento layout!
             if(index === 0) {
              return (
                <motion.div key={service.id} className="md:col-span-8 glass-card overflow-hidden group min-h-[500px] relative">
                  <img src={service.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent p-12 flex flex-col justify-end">
                    <h3 className="text-4xl font-bold mb-4">{service.title}</h3>
                    <p className="text-white/50 max-w-md mb-8">{service.description}</p>
                    <div className="flex gap-4">
                      {service.features.map((f:string) => (
                        <span key={f} className="px-4 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40 border border-white/5">{f}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
             }
             if(index === 1) {
               return (
                <motion.div key={service.id} className="md:col-span-4 glass-card border-white/5 overflow-hidden group min-h-[500px]">
                  <div className="h-2/3 overflow-hidden relative">
                    <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">{service.description}</p>
                  </div>
                </motion.div>
               )
             }
             return (
              <motion.div key={service.id} className="md:col-span-12 glass-card border-white/5 overflow-hidden group p-12 bg-obsidian-light/50 flex">
                <div className="w-1/2">
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-white/40 text-sm mb-6">{service.description}</p>
                  <div className="space-y-3">
                    {service.features.map((f:string) => (
                      <div key={f} className="flex items-center gap-3 text-xs font-bold text-white/30"><CheckCircle2 className="w-4 h-4 text-neon-emerald" /> {f}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
             )
          })}
        </div>
      </section>

       {/* Store Section */}
       <section id="store" className="py-32 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="glass-card bg-mesh border-white/5 p-12 md:p-20 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <SectionTitle subtitle="The Community Goods" title="GEMICONOTA." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {data.products.map((product: any) => (
              <motion.div key={product.id} className="glass-card bg-obsidian-light/30 border-white/5 p-8 group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-8 border border-white/5">
                  <img src={product.image} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500" />
                </div>
                <div className="flex justify-between items-start mb-6">
                   <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-neon-cyan/50 text-neon-cyan">{product.status}</span>
                   <span className="text-xl font-bold text-white">{product.priceDisplay}</span>
                </div>
                <h4 className="text-xl font-bold mb-2">{product.name}</h4>
                <p className="text-white/30 text-xs mb-8">{product.description}</p>
                <button onClick={() => handleCheckout(product)} className="w-full py-4 glass-button hover:bg-gem-gold hover:text-obsidian hover:border-gem-gold transition-all flex items-center justify-center gap-3">

                   <ShoppingBag className="w-4 h-4" /> Order Drop
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer... (kept abbreviated for simplicity) */}
      <footer className="bg-obsidian pt-12 pb-12 border-t border-white/5 text-center">
         <p className="text-xs text-white/30">© 2026 GEMICONOTA NETWORK.</p>

      </footer>
    </div>
  );
}
