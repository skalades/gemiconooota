import React, { useState } from 'react';
import { 
  Code2, 
  Cpu, 
  Map as MapIcon, 
  ShoppingBag, 
  ExternalLink, 
  Mail, 
  Instagram, 
  MessageSquare,
  ChevronRight,
  Globe,
  Database,
  Layers,
  ArrowUpRight,
  Zap,
  Box,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Types ---
interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

interface Product {
  name: string;
  description: string;
  status: 'Pre-Order' | 'Tersedia';
  price?: string;
}

interface PortfolioItem {
  title: string;
  description: string;
  tags: string[];
  year: string;
}

// --- Data ---
const SERVICES: Service[] = [
  {
    id: '01',
    title: 'Custom Web Development',
    description: 'Membangun ekosistem digital yang responsif dan cepat, mulai dari landing page hingga sistem manajemen kompleks.',
    icon: <Code2 className="w-6 h-6" />,
    features: ['Responsive Design', 'Fast Performance', 'Custom Logic']
  },
  {
    id: '02',
    title: 'AI-Powered Systems',
    description: 'Integrasi kecerdasan buatan untuk meningkatkan interaksi pengguna dan efisiensi bisnis.',
    icon: <Cpu className="w-6 h-6" />,
    features: ['Virtual Try-On (VTX)', 'AI Smart Mirror', 'Chatbots']
  },
  {
    id: '03',
    title: 'WebGIS & Land Surveying',
    description: 'Solusi pemetaan berbasis web yang menggabungkan keahlian geologi dan teknologi digital.',
    icon: <MapIcon className="w-6 h-6" />,
    features: ['Spatial Visualization', 'Regional Mapping', 'Geology']
  }
];

const PRODUCTS: Product[] = [
  { name: 'PDL GEMICONOTA', description: 'Kemeja lapangan berkualitas tinggi untuk rimbawan & miner.', status: 'Pre-Order', price: 'IDR 249K' },
  { name: 'Official T-Shirt', description: 'Kaos katun premium dengan desain ikonik Geologi.', status: 'Tersedia', price: 'IDR 129K' },
  { name: 'Merchandise Set', description: 'Gantungan kunci, stiker, dan mug alumni.', status: 'Tersedia', price: 'IDR 89K' }
];

const PORTFOLIO: PortfolioItem[] = [
  { title: 'Nutrizi', description: 'Web-based management system untuk program Makan Bergizi Gratis.', tags: ['Management', 'Web App'], year: '2025' },
  { title: 'ROXY-VTX', description: 'AI Hairstyle recommendation & Virtual Try-On.', tags: ['AI', 'Computer Vision'], year: '2024' },
  { title: 'PANDA Foundation', description: 'Platform digital untuk Yayasan Penolong Janda dan Duafa Garut.', tags: ['Non-Profit', 'Community'], year: '2024' }
];

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-dark/5">
    <div className="max-w-[1800px] mx-auto px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
          <Zap className="w-5 h-5 fill-white" />
        </div>
        <span className="font-bold tracking-tight text-xl text-brand-dark">SKALADES</span>
      </div>
      <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-dark/60">
        <a href="#about" className="hover:text-brand-primary transition-colors">About</a>
        <a href="#services" className="hover:text-brand-primary transition-colors">Services</a>
        <a href="#store" className="hover:text-brand-primary transition-colors">Store</a>
        <a href="#portfolio" className="hover:text-brand-primary transition-colors">Portfolio</a>
        <a href="#contact" className="hover:text-brand-primary transition-colors">Contact</a>
      </div>
      <button className="bg-brand-dark text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-primary transition-all shadow-lg shadow-brand-dark/10">
        Get Started
      </button>
    </div>
  </nav>
);

const Marquee = () => (
  <div className="bg-brand-dark py-6 overflow-hidden border-y border-white/5">
    <div className="flex whitespace-nowrap animate-marquee">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-12 px-6">
          <span className="text-2xl md:text-4xl font-serif italic font-medium text-white/40 uppercase tracking-tighter">SKALADES STUDIO</span>
          <div className="w-2 h-2 bg-brand-primary rounded-full" />
          <span className="text-2xl md:text-4xl font-serif italic font-medium text-white/40 uppercase tracking-tighter">CRAFTING CODE</span>
          <div className="w-2 h-2 bg-brand-primary rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-brand-surface selection:bg-brand-primary selection:text-white">
      <Navbar />

      {/* Hero Section - Modern Professional */}
      <header className="pt-40 pb-20 px-8 max-w-[1800px] mx-auto relative">
        <div className="absolute top-40 right-0 w-1/3 h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="w-12 h-px bg-brand-primary" />
                <span className="font-mono text-[10px] text-brand-primary font-bold tracking-[0.3em] uppercase">Digital Solution Studio</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif italic leading-[1.1] tracking-tight text-brand-dark mb-10">
                Elevating <span className="text-brand-primary">Digital</span> <br />
                Presence with <br />
                Precision.
              </h1>
              <p className="text-xl text-brand-gray max-w-xl leading-relaxed mb-12">
                SKALADES adalah studio pengembangan digital yang berfokus pada solusi web kustom, integrasi AI, dan sistem informasi geografis. Kami membangun ekosistem digital yang siap tumbuh bersama visi Anda.
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="#contact" className="px-10 py-4 bg-brand-primary text-white font-bold uppercase tracking-widest text-xs rounded-full flex items-center gap-3 hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 group">
                  Start a Project <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <a href="#portfolio" className="px-10 py-4 border border-brand-dark/10 text-brand-dark font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all">
                  Our Works
                </a>
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10 aspect-square bg-white rounded-3xl p-12 shadow-2xl border border-brand-dark/5"
            >
              <div className="technical-grid absolute inset-0 opacity-20 rounded-3xl" />
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-brand-gray uppercase tracking-widest">System Status</div>
                    <div className="flex items-center gap-2 text-brand-accent font-bold text-xs uppercase">
                      <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
                      Operational
                    </div>
                  </div>
                  <Box className="w-8 h-8 text-brand-primary opacity-20" />
                </div>
                
                <div className="space-y-6">
                  <div className="h-2 bg-brand-primary/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-surface rounded-xl border border-brand-dark/5">
                      <div className="text-[10px] font-mono text-brand-gray uppercase mb-2">Projects</div>
                      <div className="text-2xl font-bold text-brand-dark">42+</div>
                    </div>
                    <div className="p-4 bg-brand-surface rounded-xl border border-brand-dark/5">
                      <div className="text-[10px] font-mono text-brand-gray uppercase mb-2">Efficiency</div>
                      <div className="text-2xl font-bold text-brand-dark">99%</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-8 border-t border-brand-dark/5">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-medium text-brand-dark/60">
                    Trusted by 20+ communities <br /> across Indonesia.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <Marquee />

      {/* Services Section - Modern Grid */}
      <section id="services" className="py-32 px-8 max-w-[1800px] mx-auto">
        <div className="text-center mb-20">
          <span className="font-mono text-[10px] text-brand-primary font-bold tracking-[0.3em] uppercase mb-4 block">Our Expertise</span>
          <h2 className="text-5xl md:text-6xl font-serif italic tracking-tight text-brand-dark">Professional Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {SERVICES.map((service) => (
            <div key={service.id} className="group bg-white p-12 rounded-3xl border border-brand-dark/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-brand-surface rounded-2xl flex items-center justify-center mb-10 group-hover:bg-brand-primary group-hover:text-white transition-colors shadow-inner">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-6 text-brand-dark">{service.title}</h3>
              <p className="text-brand-gray mb-10 leading-relaxed">{service.description}</p>
              <div className="space-y-4">
                {service.features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm font-medium text-brand-dark/70">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Store Section - Sophisticated Dark */}
      <section id="store" className="py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full technical-grid-dark opacity-10" />
        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] text-brand-primary font-bold tracking-[0.3em] uppercase mb-4 block">Community Store</span>
              <h2 className="text-6xl md:text-8xl font-serif italic tracking-tight mb-8">GEMICONOTA</h2>
              <p className="text-xl text-white/60 leading-relaxed">Dukung komunitas Geology and Mining Community of North Tarogong. Tunjukkan identitasmu dengan merchandise eksklusif.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((product, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 hover:border-brand-primary/50 transition-all group">
                <div className="flex justify-between items-start mb-12">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    product.status === 'Pre-Order' ? 'border-blue-500/50 text-blue-400' : 'border-brand-accent/50 text-brand-accent'
                  }`}>
                    {product.status}
                  </span>
                  <span className="text-2xl font-bold text-brand-primary">{product.price}</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">{product.name}</h3>
                <p className="text-white/40 mb-10 h-16">{product.description}</p>
                <button className="w-full py-4 bg-white/10 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-primary transition-all flex items-center justify-center gap-3">
                  <ShoppingBag className="w-4 h-4" /> Order Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section - Clean & Modern */}
      <section id="portfolio" className="py-32 px-8 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="font-mono text-[10px] text-brand-primary font-bold tracking-[0.3em] uppercase mb-4 block">Case Studies</span>
            <h2 className="text-5xl md:text-6xl font-serif italic tracking-tight text-brand-dark">Selected Works</h2>
          </div>
          <a href="#" className="text-brand-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
            View All Projects <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PORTFOLIO.map((project, idx) => (
            <div key={idx} className="group bg-white rounded-3xl border border-brand-dark/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="aspect-video bg-brand-surface flex items-center justify-center relative overflow-hidden">
                <div className="technical-grid absolute inset-0 opacity-20" />
                <div className="text-6xl font-serif italic font-black text-brand-dark/5 group-hover:scale-110 transition-transform duration-700">{project.title[0]}</div>
                <div className="absolute top-6 right-6 font-mono text-[10px] text-brand-gray">{project.year}</div>
              </div>
              <div className="p-10">
                <div className="flex gap-2 mb-6">
                  {project.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono bg-brand-surface text-brand-gray px-2 py-1 rounded-md uppercase">{t}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-brand-dark group-hover:text-brand-primary transition-colors">{project.title}</h3>
                <p className="text-brand-gray mb-8 line-clamp-2">{project.description}</p>
                <button className="flex items-center gap-2 text-brand-dark font-bold text-xs uppercase tracking-widest group-hover:text-brand-primary transition-all">
                  View Project <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section - Professional & Trustworthy */}
      <footer id="contact" className="bg-brand-dark text-white pt-32 pb-12 px-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
            <div className="lg:col-span-5">
              <h2 className="text-6xl font-serif italic tracking-tight mb-10">Ready to <br /> <span className="text-brand-primary underline decoration-brand-primary/30 underline-offset-8">scale</span> your <br /> business?</h2>
              <p className="text-xl text-white/50 mb-12 leading-relaxed">Hubungi kami untuk konsultasi gratis mengenai proyek digital Anda. Kami siap membantu dari Garut untuk dunia.</p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-primary transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Email Us</div>
                    <div className="text-lg font-medium">business@skalades.id</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-primary transition-all">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">WhatsApp</div>
                    <div className="text-lg font-medium">+62 8XX XXXX XXXX</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="bg-white/5 p-12 rounded-3xl border border-white/10">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-brand-primary transition-all" placeholder="John Doe" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
                      <input type="email" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-brand-primary transition-all" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Message</label>
                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-brand-primary transition-all resize-none" placeholder="How can we help you?" />
                  </div>
                  <button className="w-full py-5 bg-brand-primary text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-brand-dark transition-all shadow-xl shadow-brand-primary/20">
                    Send Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold tracking-tight text-lg">SKALADES</span>
            </div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">© 2026 CRAFTING CODE, BUILDING COMMUNITY.</p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-brand-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-brand-primary transition-colors"><Mail className="w-5 h-5" /></a>
              <a href="#" className="text-white/40 hover:text-brand-primary transition-colors"><MessageSquare className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
