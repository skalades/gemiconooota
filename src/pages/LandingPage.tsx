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
          <button onClick={() => setIsAlumniModalOpen(true)} className="hidden sm:block glass-button px-4 border-gem-gold/30 text-gem-gold">Join Network</button>
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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', whatsapp: '', size: 'L' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Alumni States
  const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
  const [alumniStep, setAlumniStep] = useState(1); // 1: Info, 2: Challenge, 3: Success
  const [alumniInfo, setAlumniInfo] = useState({ fullName: '', whatsapp: '', batchYear: '', location: '', job: '' });
  const [challenge, setChallenge] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [alumniLoading, setAlumniLoading] = useState(false);



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

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.whatsapp) {
      alert("Please fill in your name and WhatsApp number.");
      return;
    }
    
    setCheckoutLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/checkout', { 
        product: selectedProduct,
        customer: {
          ...customerInfo,
          size: selectedProduct.has_sizes ? customerInfo.size : '-' // Ensure clean data
        }
      });

      const { token } = res.data;
      if (token && window.snap) {
        window.snap.pay(token, {
          onSuccess: () => { setIsCheckoutOpen(false); },
          onPending: () => { setIsCheckoutOpen(false); },
          onClose: () => { setIsCheckoutOpen(false); }
        });
      } else {
        alert("Payment module is not loaded yet.");
      }
    } catch (err) {
      console.error(err);
      alert('Failed to init checkout');
    }
    setCheckoutLoading(false);
  };

  const openCheckout = (product: any) => {
    setSelectedProduct(product);
    setCustomerInfo({ ...customerInfo, size: product.has_sizes ? 'L' : '-' }); // Reset size state
    setIsCheckoutOpen(true);
  };


  const handleAlumniNext = async () => {
    if (alumniStep === 1) {
       if (!alumniInfo.fullName || !alumniInfo.whatsapp || !alumniInfo.batchYear) {
         alert("Please fill in required fields.");
         return;
       }
       setAlumniLoading(true);
       try {
         const res = await axios.get(`http://localhost:3001/api/alumni/challenge?batch=${alumniInfo.batchYear}`);
         setChallenge(res.data);
         if (res.data.required) {
            setAlumniStep(2);
         } else {
            // No challenge needed (manual verification)
            submitAlumni();
         }
       } catch (err) {
         console.error(err);
         alert("Failed to reach network server.");
       }
       setAlumniLoading(false);
    }
  };

  const submitAlumni = async () => {
    setAlumniLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/api/alumni/register', {
        ...alumniInfo,
        answers: selectedAnswers
      });
      setAlumniStep(3);
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
    setAlumniLoading(false);
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
                <button onClick={() => openCheckout(product)} className="w-full py-4 glass-button hover:bg-gem-gold hover:text-obsidian hover:border-gem-gold transition-all flex items-center justify-center gap-3">


                   <ShoppingBag className="w-4 h-4" /> Order Drop
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card p-10 border-white/5 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gem-gold" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Finalize Your Order</h3>
                  <p className="text-white/40 text-xs">Enter your details to proceed with {selectedProduct.name}</p>
                </div>
                <button onClick={() => setIsCheckoutOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 0812..."
                      value={customerInfo.whatsapp}
                      onChange={e => setCustomerInfo({...customerInfo, whatsapp: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Email (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      value={customerInfo.email}
                      onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gem-gold transition-all" 
                    />
                  </div>
                </div>

                {!!selectedProduct.has_sizes && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Shirt Size</label>
                    <div className="grid grid-cols-6 gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL', '3XL'].map(size => (
                        <button 
                          key={size}
                          onClick={() => setCustomerInfo({...customerInfo, size: size})}
                          className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${
                            customerInfo.size === size 
                              ? 'bg-gem-gold/20 border-gem-gold text-gem-gold' 
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full neon-button py-5 flex items-center justify-center gap-3 group"
                  >
                    {checkoutLoading ? 'INITIALIZING...' : (
                      <>
                        <Zap className="w-4 h-4" /> SECURE CHECKOUT (IDR {selectedProduct.priceDisplay})
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-white/20 mt-4 uppercase tracking-[0.2em]">Secure payment via Midtrans Snap</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alumni Registration Modal */}
      <AnimatePresence>
        {isAlumniModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAlumniModalOpen(false)}
              className="absolute inset-0 bg-obsidian/90 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative w-full max-w-xl glass-card p-12 border-white/5"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gem-gold" />
              
              <button onClick={() => setIsAlumniModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                 <X className="w-6 h-6" />
              </button>

              {alumniStep === 1 && (
                <div className="space-y-8">
                  <header>
                    <h3 className="text-3xl font-display font-bold text-white mb-2">Join GEMICONOTA</h3>
                    <p className="text-white/40 text-sm">Create your profile to access the alumni network.</p>
                  </header>

                  <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Full Legal Name</label>
                       <input type="text" value={alumniInfo.fullName} onChange={e => setAlumniInfo({...alumniInfo, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gem-gold outline-none" placeholder="Enter your full name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp</label>
                          <input type="tel" value={alumniInfo.whatsapp} onChange={e => setAlumniInfo({...alumniInfo, whatsapp: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gem-gold outline-none" placeholder="0812..." />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Batch Year</label>
                          <input type="number" value={alumniInfo.batchYear} onChange={e => setAlumniInfo({...alumniInfo, batchYear: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gem-gold outline-none" placeholder="Ex: 2018" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Current Location (City)</label>
                       <input type="text" value={alumniInfo.location} onChange={e => setAlumniInfo({...alumniInfo, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gem-gold outline-none" placeholder="Jakarta, Indonesia" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gem-gold/10 border border-gem-gold/20 rounded-xl">
                     <CheckCircle2 className="w-5 h-5 text-gem-gold flex-shrink-0" />
                     <p className="text-[10px] text-gem-gold font-bold leading-relaxed">
                       I declare that the data provided is accurate. Fraudulent data will result in permanent network exclusion.
                     </p>
                  </div>

                  <button 
                    onClick={handleAlumniNext}
                    disabled={alumniLoading}
                    className="w-full neon-button py-5 text-sm font-bold flex items-center justify-center gap-3"
                  >
                    {alumniLoading ? 'INITIALIZING NETWORK...' : 'CONTINUE TO VERIFICATION'}
                  </button>
                </div>
              )}

              {alumniStep === 2 && challenge && (
                <div className="space-y-8">
                  <header>
                    <h3 className="text-3xl font-display font-bold text-white mb-2">Social Challenge</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      Select 3 people who were in the <strong>Batch of {alumniInfo.batchYear}</strong> with you. 
                      Correct identification will grant auto-verification.
                    </p>
                  </header>

                  <div className="space-y-3">
                    {challenge.names.map((name: string) => (
                      <button 
                        key={name}
                        onClick={() => {
                           if (selectedAnswers.includes(name)) {
                             setSelectedAnswers(selectedAnswers.filter(a => a !== name));
                           } else if (selectedAnswers.length < 3) {
                             setSelectedAnswers([...selectedAnswers, name]);
                           }
                        }}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          selectedAnswers.includes(name) 
                            ? 'bg-gem-gold/20 border-gem-gold text-white' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                         <span className="font-bold">{name}</span>
                         {selectedAnswers.includes(name) && <CheckCircle2 className="w-4 h-4 text-gem-gold" />}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={submitAlumni}
                    disabled={alumniLoading || selectedAnswers.length < 3}
                    className="w-full neon-button py-5 text-sm font-bold disabled:opacity-50"
                  >
                    {alumniLoading ? 'VERIFYING...' : 'COMPLETE REGISTRATION'}
                  </button>
                </div>
              )}

              {alumniStep === 3 && (
                <div className="text-center space-y-8 py-10">
                   <div className="w-20 h-20 bg-gem-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-gem-emerald" />
                   </div>
                   <h3 className="text-3xl font-display font-bold text-white">Identity Logged</h3>
                   <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                     Thank you for joining. If you passed the social verification, your profile is now live. 
                     Otherwise, an admin will review your data within 24 hours.
                   </p>
                   <button onClick={() => setIsAlumniModalOpen(false)} className="px-10 py-4 glass-button w-full">CLOSE</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* Footer... (kept abbreviated for simplicity) */}
      <footer className="bg-obsidian pt-12 pb-12 border-t border-white/5 text-center">
         <p className="text-xs text-white/30">© 2026 GEMICONOTA NETWORK.</p>

      </footer>
    </div>
  );
}
