import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useInView, animate, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Sun, Zap, Shield, Battery, Factory, Building2, Warehouse, Hotel, ChevronDown, ChevronUp, Activity, LineChart, Leaf, Settings, ArrowUpRight, ShieldCheck, BarChart, Wrench, Server, Plug, LayoutGrid, Moon, Clock, TrendingDown, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// --- Reusable Animation Components ---

const FadeIn: React.FC<{ children: React.ReactNode, delay?: number, className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const AnimatedNumber = ({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => prefix + Math.round(latest) + suffix);

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 2.5, ease: [0.16, 1, 0.3, 1] });
    }
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const ParallaxSunlight = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.05, 0]);

  return (
    <motion.div 
      className="fixed top-[-20%] left-[60%] w-[800px] h-[800px] rounded-full pointer-events-none z-0"
      style={{ 
        y, 
        opacity,
        background: 'radial-gradient(circle, rgba(179,230,0,0.12) 0%, rgba(179,230,0,0) 70%)',
        filter: 'blur(80px)'
      }}
    />
  );
};

const SystemSelectorForm = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const challenges = [
    {
      id: 'on-grid',
      title: 'High electricity bills, stable grid',
      desc: 'You want to reduce costs and export excess power.',
      icon: Activity,
      target: 'on-grid-section',
      img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'hybrid',
      title: 'Frequent power cuts',
      desc: 'You need backup power and want to reduce diesel costs.',
      icon: Battery,
      target: 'hybrid-section',
      img: 'https://images.unsplash.com/photo-1559302504-cea134e626e3?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'off-grid',
      title: 'No grid access',
      desc: 'You need complete energy independence for a remote site.',
      icon: Zap,
      target: 'off-grid-section',
      img: 'https://images.unsplash.com/photo-1548611635-b6e7827d7d4a?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const handleSelect = (challenge: any) => {
    setSelectedChallenge(challenge.id);
    setTimeout(() => {
      const element = document.getElementById(challenge.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  };

  return (
    <div className="mt-24 max-w-6xl mx-auto">
      <div className="bg-white/50 backdrop-blur-xl p-12 rounded-sm border border-gray-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-2xl lg:text-3xl font-display font-medium text-dark mb-12 text-center tracking-wide">What is your primary energy challenge?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((challenge, idx) => (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              key={challenge.id}
              onClick={() => handleSelect(challenge)}
              className={`text-left rounded-sm border transition-all duration-700 flex flex-col overflow-hidden group ${
                selectedChallenge === challenge.id 
                  ? 'border-primary bg-dark text-white shadow-2xl scale-[1.02]' 
                  : 'border-gray-100 bg-white hover:border-primary/50 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className="h-40 w-full relative overflow-hidden">
                <img 
                  src={challenge.img} 
                  alt={challenge.title} 
                  className={`w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] ${selectedChallenge === challenge.id ? 'scale-105 opacity-80' : 'group-hover:scale-110 opacity-90'}`}
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 transition-opacity duration-700 ${selectedChallenge === challenge.id ? 'bg-dark/40' : 'bg-dark/5 group-hover:bg-dark/20'}`} />
                <div className={`absolute top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-700 ${selectedChallenge === challenge.id ? 'bg-primary text-dark' : 'bg-white/90 backdrop-blur-sm text-dark group-hover:text-primary'}`}>
                  <challenge.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-8">
                <span className={`font-medium text-lg block mb-3 transition-colors duration-700 tracking-wide ${selectedChallenge === challenge.id ? 'text-white' : 'text-dark'}`}>
                  {challenge.title}
                </span>
                <span className={`text-sm leading-relaxed block transition-colors duration-700 ${selectedChallenge === challenge.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  {challenge.desc}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Experiment2() {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState<number | null>(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const deliverySteps = [
    { title: "Site & Load Assessment", desc: "We visit your site and study your bills. Everything measured — nothing assumed." },
    { title: "Design & Proposal", desc: "Detailed design, generation estimates, savings, payback, operating loads, space availability specific to your site." },
    { title: "Procurement & Construction", desc: "Panels are sourced from trusted manufacturers and installed by our in-house trained teams to ensure reliable execution and quality." },
    { title: "Commissioning & Handover", desc: "We commission, handle your net metering application, and hand over live monitoring access." },
    { title: "5 Years of O&M", desc: "We monitor your plant and maintain it for 5 years. Issues flagged and resolved proactively." }
  ];

  return (
    <div className="bg-[#fafafa] relative overflow-hidden selection:bg-primary/30 selection:text-dark">
      <ParallaxSunlight />

      {/* Hero Section - Sticky & Immersive */}
      <section className="relative h-[100vh] z-10 overflow-hidden flex items-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 w-full h-full">
          <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2000&auto=format&fit=crop" alt="Solar Panels" className="absolute inset-0 w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-dark/60 backdrop-blur-[2px]" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 text-white font-medium text-xs mb-10 border border-white/10 backdrop-blur-md uppercase tracking-[0.2em]"
              >
                <Sun className="w-4 h-4 text-primary" />
                Solar Solutions
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.1] tracking-tight mb-10"
              >
                Cut Your Energy Costs.<br />
                <span className="text-primary font-light italic">Own Your Power.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl lg:text-2xl text-white/70 leading-[1.8] max-w-2xl font-light tracking-wide"
              >
                End-to-end solar EPC for Indian businesses. We design, source, and build — you save from Day 1.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="bg-white/5 backdrop-blur-xl p-10 rounded-sm border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-display font-medium text-white mb-3 tracking-wide">Get your free solar assessment</h3>
                <p className="text-white/60 mb-10 font-light text-sm tracking-wide">Tell us about your site. We'll show you the numbers.</p>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <input type="text" placeholder="Your Name" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary/50 text-white placeholder-white/40 transition-all duration-500 font-light text-sm" />
                    <input type="text" placeholder="Company Name" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary/50 text-white placeholder-white/40 transition-all duration-500 font-light text-sm" />
                  </div>
                  <select defaultValue="" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary/50 text-white appearance-none transition-all duration-500 font-light text-sm">
                    <option value="" disabled className="text-dark">Monthly Electricity Bill</option>
                    <option value="50k-1L" className="text-dark">₹50,000 - ₹1,00,000</option>
                    <option value="1L-5L" className="text-dark">₹1,00,000 - ₹5,00,000</option>
                    <option value="5L+" className="text-dark">₹5,00,000+</option>
                  </select>
                  <div className="grid grid-cols-2 gap-6">
                    <input type="text" placeholder="City / Location" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary/50 text-white placeholder-white/40 transition-all duration-500 font-light text-sm" />
                    <input type="tel" placeholder="Phone Number" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary/50 text-white placeholder-white/40 transition-all duration-500 font-light text-sm" />
                  </div>
                  <button type="button" className="w-full py-5 bg-primary text-dark font-medium text-sm tracking-widest uppercase rounded-sm hover:bg-white transition-all duration-500 mt-6 flex items-center justify-center gap-3 group">
                    Request Free Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Section - Clean & Spaced */}
      <section className="relative z-20 py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            <FadeIn delay={0.1} className="flex flex-col items-center justify-center text-center group">
              <Clock className="w-6 h-6 text-gray-400 group-hover:text-primary mb-8 transition-colors duration-500" strokeWidth={1.5} />
              <div className="text-5xl lg:text-6xl font-display font-light text-dark mb-4 tracking-tight">
                <AnimatedNumber value={18} />-<AnimatedNumber value={24} suffix="mo" />
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em] leading-relaxed">Typical payback<br/>period</div>
            </FadeIn>
            <FadeIn delay={0.2} className="flex flex-col items-center justify-center text-center group">
              <TrendingDown className="w-6 h-6 text-gray-400 group-hover:text-primary mb-8 transition-colors duration-500" strokeWidth={1.5} />
              <div className="text-5xl lg:text-6xl font-display font-light text-dark mb-4 tracking-tight">
                <AnimatedNumber value={25} />-<AnimatedNumber value={40} suffix="%" />
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em] leading-relaxed">Reduction in<br/>electricity costs</div>
            </FadeIn>
            <FadeIn delay={0.3} className="flex flex-col items-center justify-center text-center group">
              <Calendar className="w-6 h-6 text-gray-400 group-hover:text-primary mb-8 transition-colors duration-500" strokeWidth={1.5} />
              <div className="text-5xl lg:text-6xl font-display font-light text-dark mb-4 tracking-tight">
                <AnimatedNumber value={25} suffix="y" />
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em] leading-relaxed">Guaranteed<br/>performance life</div>
            </FadeIn>
            <FadeIn delay={0.4} className="flex flex-col items-center justify-center text-center group">
              <Wrench className="w-6 h-6 text-gray-400 group-hover:text-primary mb-8 transition-colors duration-500" strokeWidth={1.5} />
              <div className="text-5xl lg:text-6xl font-display font-light text-dark mb-4 tracking-tight">
                <AnimatedNumber value={5} suffix="y" />
              </div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em] leading-relaxed">O&M included with<br/>every project</div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* System Types Intro - Editorial Spacing */}
      <section className="py-40 relative z-10 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl lg:text-[3.5rem] font-display font-medium text-dark mb-10 tracking-tight leading-[1.1]">
              Choose the right solar system <br className="hidden lg:block" /> for your business
            </h2>
            <p className="text-lg lg:text-xl text-gray-500 font-light leading-[1.8] tracking-wide">
              Every site is different. We assess your grid connection, load profile, and uptime needs — then recommend the system that delivers the best return for your situation.
            </p>
          </FadeIn>
        </div>
        <SystemSelectorForm />
      </section>

      {/* System 1: On-Grid - Layered Storytelling */}
      <section id="on-grid-section" className="py-40 relative z-10 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center mb-32">
            <div className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              On-Grid Solar
            </div>
            <h3 className="text-4xl lg:text-[3.5rem] font-display font-medium text-dark mb-10 leading-[1.1] tracking-tight">Stay connected. Pay less.</h3>
            <p className="text-lg lg:text-xl text-gray-500 font-light leading-[1.8] tracking-wide">
              The most cost-effective starting point for businesses with a stable grid connection. Your panels generate power during the day. Your facility runs on solar first. Surplus is exported to the DISCOM grid and credited to your bill via net metering.
            </p>
          </FadeIn>

          {/* How it Works - Rhythmic Blocks */}
          <FadeIn delay={0.1}>
            <div className="mb-40">
              <h4 className="font-medium text-dark/40 mb-16 uppercase tracking-[0.2em] text-xs text-center">How it works</h4>
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0 relative">
                {[
                  { step: "01", title: "Panels generate DC power", desc: "Sunlight is converted to DC electricity throughout the day", icon: Sun },
                  { step: "02", title: "Inverter converts to AC", desc: "DC is converted to 415V AC — the standard your facility already runs on", icon: Server },
                  { step: "03", title: "Solar powers your site", desc: "Panels feed your electrical panel directly. Equipment on solar in real time", icon: Plug },
                  { step: "04", title: "Surplus goes to the grid", desc: "Excess generation is exported and credited to your account via net metering", icon: LayoutGrid },
                  { step: "05", title: "Grid covers the rest", desc: "After sunset or on low-generation days, the grid supplies the shortfall as normal", icon: Moon }
                ].map((item, i, arr) => {
                  const isHovered = hoveredStep === i;
                  const isAnyHovered = hoveredStep !== null;
                  const opacity = isHovered ? 1 : (isAnyHovered ? 0.3 : 1);

                  return (
                    <React.Fragment key={i}>
                      <motion.div 
                        className="relative z-10 flex flex-col items-center text-center w-full lg:flex-1 cursor-pointer"
                        onMouseEnter={() => setHoveredStep(i)}
                        onMouseLeave={() => setHoveredStep(null)}
                        animate={{ opacity }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="text-xs font-mono text-gray-300 mb-6 tracking-widest">
                          {item.step}
                        </div>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 transition-all duration-700 ${isHovered ? 'bg-dark text-primary scale-110' : 'bg-gray-50 text-dark'}`}>
                          <item.icon className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm leading-[1.8] text-gray-500 font-light max-w-[200px]">
                          <strong className="font-medium block mb-2 text-dark">{item.title}</strong>
                          {item.desc}
                        </p>
                      </motion.div>
                      
                      {i < arr.length - 1 && (
                        <div className="hidden lg:flex items-center justify-center mt-[4.5rem] text-gray-200 shrink-0 w-12">
                          <div className="w-full h-px bg-gray-200" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-32">
            <FadeIn delay={0.2} className="lg:col-span-5">
              <h4 className="font-medium text-dark/40 uppercase tracking-[0.2em] text-xs mb-10">Why it works for your business</h4>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} />
                  <p className="text-gray-500 font-light leading-[1.8]"><strong className="text-dark font-medium">Lowest installation cost</strong> — no batteries required — fastest payback.</p>
                </div>
                <div className="flex items-start gap-5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} />
                  <p className="text-gray-500 font-light leading-[1.8]"><strong className="text-dark font-medium">Immediate bill savings</strong> — every unit generated is a unit not bought from the DISCOM.</p>
                </div>
                <div className="flex items-start gap-5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} />
                  <p className="text-gray-500 font-light leading-[1.8]"><strong className="text-dark font-medium">Net metering credits</strong> — surplus generation earns bill credits — nothing is wasted.</p>
                </div>
                <div className="flex items-start gap-5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} />
                  <p className="text-gray-500 font-light leading-[1.8]"><strong className="text-dark font-medium">Right for:</strong> businesses with a reliable grid and a primary goal of reducing monthly bills.</p>
                </div>
              </div>
              <div className="mt-12">
                <Link to="/contact" className="inline-flex items-center gap-3 text-sm font-medium text-dark uppercase tracking-widest hover:text-primary transition-colors group">
                  Get a free assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} className="lg:col-span-7">
              <div className="relative aspect-[4/3] w-full rounded-sm overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop" alt="On-Grid Solar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* System 2: Off-Grid - Minimal & Focused */}
      <section id="off-grid-section" className="py-40 relative z-10 bg-[#fafafa] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <FadeIn className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop" alt="Off-Grid Solar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105" />
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="lg:col-span-6 order-1 lg:order-2">
              <div className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Off-Grid Solar
              </div>
              <h3 className="text-4xl lg:text-[3.5rem] font-display font-medium text-dark mb-10 leading-[1.1] tracking-tight">No grid dependency.<br/>Complete independence.</h3>
              <p className="text-lg text-gray-500 font-light mb-16 leading-[1.8] tracking-wide">
                For sites where the grid is absent, unreliable, or too costly to connect to. A self-contained system. Solar panels generate power, a battery bank stores it, and your facility draws from storage as needed — day or night.
              </p>
              
              <div className="mb-16">
                <h4 className="font-medium text-dark/40 mb-8 uppercase tracking-[0.2em] text-xs">How it works</h4>
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Panels generate DC power", desc: "The system's only energy input — solar generation throughout the day." },
                    { step: "02", title: "Charge controller manages flow", desc: "Regulates electricity into the battery bank, protecting battery health and lifespan." },
                    { step: "03", title: "Battery bank stores energy", desc: "Surplus generation is stored for use at night or during low-sun periods." },
                    { step: "04", title: "Inverter converts when needed", desc: "DC from batteries is converted to 415V AC to power your equipment on demand." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <span className="font-mono text-xs text-gray-300 tracking-widest mt-1">{item.step}</span>
                      <div>
                        <strong className="text-dark font-medium block mb-2">{item.title}</strong>
                        <span className="text-gray-500 font-light text-sm leading-[1.8]">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 mb-16">
                <h4 className="font-medium text-dark/40 uppercase tracking-[0.2em] text-xs mb-8">Why it works for your business</h4>
                <div className="flex items-start gap-5"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} /><p className="text-gray-500 font-light leading-[1.8]"><strong className="text-dark font-medium">Complete grid independence</strong> — no exposure to tariff hikes, outages, or grid instability.</p></div>
                <div className="flex items-start gap-5"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} /><p className="text-gray-500 font-light leading-[1.8]"><strong className="text-dark font-medium">Power anywhere</strong> — viable for remote sites where grid infrastructure is absent or expensive.</p></div>
                <div className="flex items-start gap-5"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} /><p className="text-gray-500 font-light leading-[1.8]"><strong className="text-dark font-medium">Zero ongoing utility bills</strong> — once commissioned, your energy cost is fixed and minimal.</p></div>
              </div>

              <Link to="/contact" className="inline-flex items-center gap-3 text-sm font-medium text-dark uppercase tracking-widest hover:text-primary transition-colors group">
                Talk to us about off-grid <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* System 3: Hybrid - Premium Dark Mode */}
      <section id="hybrid-section" className="py-40 relative z-10 bg-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <FadeIn className="lg:col-span-6 order-2 lg:order-1">
              <div className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Hybrid Solar
              </div>
              <h3 className="text-4xl lg:text-[3.5rem] font-display font-medium text-white mb-10 leading-[1.1] tracking-tight">Maximum savings.<br/>Uninterrupted operations.</h3>
              <p className="text-lg text-white/60 font-light mb-16 leading-[1.8] tracking-wide">
                For businesses that need both cost savings and full power security — no compromise. A hybrid system combines solar generation, battery storage, and a live grid connection.
              </p>
              
              <div className="mb-16">
                <h4 className="font-medium text-white/30 mb-8 uppercase tracking-[0.2em] text-xs">How it works</h4>
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Panels power your facility", desc: "Solar generation meets your real-time load first — grid and batteries are secondary." },
                    { step: "02", title: "Surplus charges batteries", desc: "Excess generation fills the battery bank before anything is exported to the grid." },
                    { step: "03", title: "Batteries discharge intelligently", desc: "During peak tariff hours or grid outages, batteries discharge automatically." },
                    { step: "04", title: "Grid backs up when needed", desc: "When solar and batteries are both insufficient, the grid supplies the shortfall." },
                    { step: "05", title: "Seamless switchover in <20ms", desc: "On a grid fault, the system moves to battery in under 20 milliseconds." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <span className="font-mono text-xs text-white/30 tracking-widest mt-1">{item.step}</span>
                      <div>
                        <strong className="text-white font-medium block mb-2">{item.title}</strong>
                        <span className="text-white/50 font-light text-sm leading-[1.8]">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 mb-16">
                <h4 className="font-medium text-white/30 uppercase tracking-[0.2em] text-xs mb-8">Why it works for your business</h4>
                <div className="flex items-start gap-5"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} /><p className="text-white/60 font-light leading-[1.8]"><strong className="text-white font-medium">Uninterrupted operations</strong> — battery backup kicks in before production equipment registers a fault.</p></div>
                <div className="flex items-start gap-5"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} /><p className="text-white/60 font-light leading-[1.8]"><strong className="text-white font-medium">Peak tariff avoidance</strong> — discharge batteries during expensive peak windows; recharge on cheap solar.</p></div>
                <div className="flex items-start gap-5"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" strokeWidth={1.5} /><p className="text-white/60 font-light leading-[1.8]"><strong className="text-white font-medium">Right for:</strong> manufacturers, cold storage, hospitals — any business where a power cut is a financial event.</p></div>
              </div>

              <Link to="/contact" className="inline-flex items-center gap-3 text-sm font-medium text-primary uppercase tracking-widest hover:text-white transition-colors group">
                Talk to us about hybrid <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
            </FadeIn>
            
            <FadeIn delay={0.2} className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=1000&auto=format&fit=crop" alt="Hybrid Solar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105" />
                <div className="absolute inset-0 bg-dark/20" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Comparison Table - Clean Editorial */}
      <section className="py-40 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="mb-20">
              <h2 className="text-4xl lg:text-5xl font-display font-medium text-dark mb-6 tracking-tight">System Comparison</h2>
              <p className="text-lg text-gray-500 font-light tracking-wide">Compare features to find the right fit for your facility.</p>
            </div>
            
            <div className="overflow-x-auto pb-10">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-8 border-b border-gray-200 font-medium text-dark/40 text-xs uppercase tracking-[0.2em] bg-white w-1/4">Feature</th>
                    <th className="p-8 border-b border-gray-200 font-medium text-dark text-sm uppercase tracking-[0.1em] bg-[#fafafa] w-1/4">On-Grid</th>
                    <th className="p-8 border-b border-gray-200 font-medium text-dark text-sm uppercase tracking-[0.1em] bg-white w-1/4">Off-Grid</th>
                    <th className="p-8 border-b border-gray-200 font-medium text-dark text-sm uppercase tracking-[0.1em] bg-[#fafafa] w-1/4">Hybrid</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 font-light text-sm">
                  <tr className="transition-colors hover:bg-gray-50/50">
                    <td className="p-8 border-b border-gray-100 font-medium text-dark">Grid Connection</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50">Always connected</td>
                    <td className="p-8 border-b border-gray-100">Fully independent</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50">Connected + battery backup</td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50/50">
                    <td className="p-8 border-b border-gray-100 font-medium text-dark">Battery Storage</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50">Not required</td>
                    <td className="p-8 border-b border-gray-100">Essential</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50">Required</td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50/50">
                    <td className="p-8 border-b border-gray-100 font-medium text-dark">Works During Outage</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50 text-gray-400">No — shuts down</td>
                    <td className="p-8 border-b border-gray-100 text-dark font-medium">Yes — runs on battery</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50 text-dark font-medium">Yes — runs on battery</td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50/50">
                    <td className="p-8 border-b border-gray-100 font-medium text-dark">Net Metering</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50 text-dark font-medium">Yes</td>
                    <td className="p-8 border-b border-gray-100 text-gray-400">No</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50 text-dark font-medium">Yes</td>
                  </tr>
                  <tr className="transition-colors hover:bg-gray-50/50">
                    <td className="p-8 border-b border-gray-100 font-medium text-dark">Installation Cost</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50">Lowest</td>
                    <td className="p-8 border-b border-gray-100">Higher</td>
                    <td className="p-8 border-b border-gray-100 bg-[#fafafa]/50">Moderate to high</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-20 max-w-3xl">
              <p className="text-2xl text-dark font-light leading-[1.6] tracking-wide italic">
                "Most clients start with on-grid. Businesses with critical loads or frequent outages go straight to hybrid. Off-grid is for remote or poorly-connected sites. One site visit is all we need to tell you which is right for yours."
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why Solar Now & What You Get - Rhythm & Space */}
      <section className="py-40 bg-[#fafafa] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            <FadeIn className="lg:col-span-6">
              <h2 className="text-4xl lg:text-5xl font-display font-medium text-dark mb-8 tracking-tight leading-[1.1]">Why businesses are switching to solar now</h2>
              <p className="text-lg text-gray-500 font-light mb-16 tracking-wide">The financial case has never been clearer.</p>
              <div className="space-y-12">
                {[
                  { title: "Electricity tariffs keep rising", desc: "C&I rates have increased 30–40% over the last decade. Every year you wait, the gap widens.", icon: LineChart },
                  { title: "Payback in 18–24 months", desc: "Most of our projects recover full investment in under two years. After that, power is near-free.", icon: Battery },
                  { title: "Your load profile is ideal", desc: "Factories and commercial buildings consume the most power during daylight — exactly when solar peaks.", icon: Factory },
                  { title: "Grid independence is a real advantage", desc: "Power cuts and demand charges hit your margins. Solar reduces or eliminates both.", icon: Zap },
                  { title: "25 years of guaranteed output", desc: "A plant commissioned today is still performing in 2050.", icon: Shield }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 items-start group">
                    <div className="shrink-0 mt-1">
                      <item.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <strong className="text-dark block text-lg font-medium mb-3 tracking-wide">{item.title}</strong>
                      <span className="text-gray-500 font-light leading-[1.8] block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="lg:col-span-6">
              <div className="bg-dark p-16 rounded-sm text-white h-full flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <h3 className="text-3xl font-display font-medium mb-16 relative z-10 tracking-tight">What you get with Powermore</h3>
                
                <div className="space-y-12 relative z-10">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4 tracking-wide">Cut your electricity costs from Day 1</h4>
                    <p className="text-white/60 font-light leading-[1.8]">Solar offsets 30–60% of your consumption immediately. Every unit your plant generates is a unit not purchased from the grid.</p>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4 tracking-wide">Reduce your grid exposure</h4>
                    <p className="text-white/60 font-light leading-[1.8]">Power cuts, tariff hikes, demand charges — solar with storage keeps operations running regardless of what the grid does.</p>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4 tracking-wide">Own your energy for 25 years</h4>
                    <p className="text-white/60 font-light leading-[1.8]">Captive solar costs ₹2.50–4.00/unit. Grid tariffs run ₹7–12/unit and rising. The gap compounds in your favour every year.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Choose Powermore - Bento Grid Refined */}
      <section className="py-40 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-24">
            <h2 className="text-4xl lg:text-5xl font-display font-medium text-dark tracking-tight">Why businesses choose Powermore</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "We work for your project, not a brand", desc: "No margins on hardware. We specify what's right for your site and take full responsibility for the outcome.", icon: ShieldCheck },
              { title: "Numbers from your data, not averages", desc: "Your savings estimate is built from your actual bills and your actual site — not an industry template.", icon: BarChart },
              { title: "One team, end to end", desc: "Engineering, procurement, installation, commissioning, DISCOM applications, monitoring — one company, one accountability.", icon: Settings },
              { title: "5 years of O&M, included", desc: "Every plant comes with 5 years of maintenance from Powermore. We monitor performance and act before you need to call us.", icon: Wrench }
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="p-12 bg-[#fafafa] rounded-sm hover:bg-dark transition-all duration-700 group h-full cursor-pointer">
                  <item.icon className="w-8 h-8 text-gray-400 mb-10 group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                  <h3 className="text-2xl font-medium text-dark group-hover:text-white transition-colors duration-500 mb-6 tracking-wide">{item.title}</h3>
                  <p className="text-gray-500 group-hover:text-gray-400 text-base font-light leading-[1.8] transition-colors duration-500">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How We Deliver - Minimal Accordion */}
      <section className="py-40 bg-dark text-white relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeIn className="mb-24">
            <h2 className="text-4xl lg:text-5xl font-display font-medium mb-8 tracking-tight">How we deliver your solar plant</h2>
            <p className="text-lg text-white/50 font-light tracking-wide">A structured five-step process. Most projects are commissioned within 4–8 weeks of contract signing.</p>
          </FadeIn>
          
          <div className="space-y-0 border-t border-white/10">
            {deliverySteps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="border-b border-white/10">
                  <button 
                    className="w-full py-10 flex items-center justify-between text-left focus:outline-none group"
                    onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-10">
                      <span className={`text-sm font-mono tracking-widest transition-colors duration-500 ${activeStep === idx ? 'text-primary' : 'text-white/30 group-hover:text-white/50'}`}>0{idx + 1}</span>
                      <h3 className={`text-2xl font-medium tracking-wide transition-colors duration-500 ${activeStep === idx ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{step.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: activeStep === idx ? 180 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChevronDown className={`w-5 h-5 transition-colors duration-500 ${activeStep === idx ? 'text-primary' : 'text-white/30 group-hover:text-white/50'}`} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeStep === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-10 pl-[4.5rem] text-white/50 text-lg font-light leading-[1.8] max-w-2xl">
                          {step.desc}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With - Editorial Grid */}
      <section className="py-40 bg-[#fafafa] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-24 max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-display font-medium text-dark leading-[1.1] tracking-tight">We work with businesses where energy bills are a real cost</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Manufacturers & Factories", desc: "Steel, textiles, food processing, pharma, chemicals, auto", icon: Factory, img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" },
              { title: "Warehouses & Logistics", desc: "Cold storage, distribution centres, fulfilment hubs", icon: Warehouse, img: "https://images.unsplash.com/photo-1586528116311-ad8ed7c508c0?q=80&w=800&auto=format&fit=crop" },
              { title: "Commercial Offices & Campuses", desc: "IT parks, hospitals, educational institutions, retail", icon: Building2, img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" },
              { title: "Industrial Estates", desc: "Large factory compounds and industrial zones", icon: Activity, img: "https://images.unsplash.com/photo-1504333638930-c8787321fee0?q=80&w=800&auto=format&fit=crop" }
            ].map((sector, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <Link to="/customers" className="relative h-[400px] rounded-sm overflow-hidden group cursor-pointer block">
                  <img src={sector.img} alt={sector.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/60 transition-colors duration-700" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <sector.icon className="w-6 h-6 text-white/50 group-hover:text-primary transition-colors duration-500" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3 tracking-wide">{sector.title}</h3>
                      <div className="overflow-hidden">
                        <p className="text-white/70 text-sm font-light leading-[1.6] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
                          {sector.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA - Minimal & Impactful */}
      <section className="bg-primary py-40 relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl lg:text-[4.5rem] font-display font-medium text-dark mb-10 tracking-tight leading-[1.1]">
              Find out what solar saves your business.
            </h2>
            <p className="text-xl text-dark/70 font-light mb-16 max-w-2xl mx-auto leading-[1.8] tracking-wide">
              Share your electricity bill and site details. We'll return a savings projection and plant design — for free. Real numbers. No generic estimates.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-dark text-white rounded-sm font-medium text-sm tracking-widest uppercase hover:bg-black transition-all duration-500 hover:scale-[1.02] group">
              Get Your Free Projection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
