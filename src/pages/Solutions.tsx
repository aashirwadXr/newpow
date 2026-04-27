import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useInView, animate, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Sun, Zap, Shield, Battery, Factory, Building2, Warehouse, Hotel, ChevronDown, ChevronUp, Activity, LineChart, Leaf, Settings, ArrowUpRight, ShieldCheck, BarChart, Wrench, Server, Plug, LayoutGrid, Moon, Clock, TrendingDown, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// --- Reusable Animation Components ---

const StickyScrollSection = ({ children, id, className = "", stacked = false }: { children: React.ReactNode, id?: string, className?: string, stacked?: boolean }) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMeasurements = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
        setViewportHeight(window.innerHeight);
      }
    };

    // Initial measurement
    updateMeasurements();
    
    // Slight delay to ensure images/fonts are loaded
    const timeoutId = setTimeout(updateMeasurements, 100);
    
    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements();
    });
    
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    window.addEventListener('resize', updateMeasurements);
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMeasurements);
    };
  }, [children]);

  // Calculate the top position so the section sticks when its bottom reaches the viewport bottom
  const stickyTop = Math.min(0, viewportHeight - contentHeight);

  return (
    <section 
      id={id} 
      ref={contentRef}
      style={{ 
        position: stacked ? 'sticky' : 'relative',
        top: stacked ? stickyTop : 'auto',
      }} 
      className={`z-10 ${className}`}
    >
      {children}
    </section>
  );
};

const FadeIn: React.FC<{ children: React.ReactNode, delay?: number, className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const AnimatedNumber = ({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => prefix + Math.round(latest) + suffix);

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const ParallaxSunlight = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.1, 0]);

  return (
    <motion.div 
      className="fixed top-[-20%] left-[60%] w-[800px] h-[800px] rounded-full pointer-events-none z-0"
      style={{ 
        y, 
        opacity,
        background: 'radial-gradient(circle, rgba(179,230,0,0.15) 0%, rgba(179,230,0,0) 70%)',
        filter: 'blur(60px)'
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
    }, 400);
  };

  return (
    <div className="mt-16 max-w-5xl mx-auto">
      <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
        <h3 className="text-2xl font-display font-bold text-dark mb-8 text-center">What is your primary energy challenge?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => handleSelect(challenge)}
              className={`text-left rounded-sm border transition-all duration-300 flex flex-col overflow-hidden group ${
                selectedChallenge === challenge.id 
                  ? 'border-primary bg-dark text-white shadow-xl scale-105' 
                  : 'border-gray-200 bg-white hover:border-primary hover:shadow-md'
              }`}
            >
              <div className="h-32 w-full relative overflow-hidden">
                <img 
                  src={challenge.img} 
                  alt={challenge.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${selectedChallenge === challenge.id ? 'scale-110 opacity-80' : 'group-hover:scale-110 opacity-90'}`}
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${selectedChallenge === challenge.id ? 'bg-dark/40' : 'bg-dark/10 group-hover:bg-dark/20'}`} />
                <div className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${selectedChallenge === challenge.id ? 'bg-primary text-dark' : 'bg-white text-dark group-hover:text-primary'}`}>
                  <challenge.icon className="w-5 h-5" strokeWidth={2} />
                </div>
              </div>
              <div className="p-6">
                <span className={`font-bold block mb-2 transition-colors duration-300 ${selectedChallenge === challenge.id ? 'text-white' : 'text-dark'}`}>
                  {challenge.title}
                </span>
                <span className={`text-sm block transition-colors duration-300 ${selectedChallenge === challenge.id ? 'text-gray-300' : 'text-gray-600'}`}>
                  {challenge.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Solutions() {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState<number | null>(0);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

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
    <div className="bg-white relative">
      <ParallaxSunlight />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 z-10 overflow-hidden min-h-[90vh] flex items-center">
        <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2000&auto=format&fit=crop" alt="Solar Panels" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/40 backdrop-blur-[2px]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/20 text-primary font-medium text-sm mb-8 border border-primary/30 backdrop-blur-sm uppercase tracking-widest">
                <Sun className="w-4 h-4" />
                Solar Solutions
              </div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.05] tracking-tight mb-8">
                Cut Your Energy Costs.<br />
                <span className="text-primary">Own Your Power.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                End-to-end solar EPC for Indian businesses. We design, source, and build — you save from Day 1.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-sm border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-display font-bold text-white mb-2">Get your free solar assessment</h3>
                <p className="text-gray-300 mb-8 font-light">Tell us about your site. We'll show you the numbers.</p>
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                    <input type="text" placeholder="Company Name" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                  </div>
                  <select defaultValue="" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white appearance-none transition-colors">
                    <option value="" disabled className="text-gray-800">Monthly Electricity Bill</option>
                    <option value="50k-1L" className="text-gray-800">₹50,000 - ₹1,00,000</option>
                    <option value="1L-5L" className="text-gray-800">₹1,00,000 - ₹5,00,000</option>
                    <option value="5L+" className="text-gray-800">₹5,00,000+</option>
                  </select>
                  <div className="grid grid-cols-2 gap-5">
                    <input type="text" placeholder="City / Location" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                    <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                  </div>
                  <button type="button" className="w-full py-4 bg-primary text-dark font-bold text-lg rounded-sm hover:bg-white transition-colors mt-4 flex items-center justify-center gap-2 group">
                    Request Free Assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl border border-gray-100 p-4 lg:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
              <div className="text-center px-4 group hover:bg-dark transition-colors duration-300 p-6 rounded-sm cursor-pointer flex flex-col items-center justify-center">
                <Clock className="w-8 h-8 text-dark group-hover:text-primary mb-4 transition-colors duration-300" strokeWidth={1.5} />
                <div className="text-4xl lg:text-5xl font-display font-bold text-dark group-hover:text-white mb-2 transition-colors duration-300 flex items-center justify-center">
                  <AnimatedNumber value={18} />-<AnimatedNumber value={24} suffix=" mo" />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-gray-300 font-medium uppercase tracking-wider transition-colors duration-300">Typical payback period</div>
              </div>
              <div className="text-center px-4 group hover:bg-dark transition-colors duration-300 p-6 rounded-sm cursor-pointer flex flex-col items-center justify-center">
                <TrendingDown className="w-8 h-8 text-dark group-hover:text-primary mb-4 transition-colors duration-300" strokeWidth={1.5} />
                <div className="text-4xl lg:text-5xl font-display font-bold text-dark group-hover:text-white mb-2 transition-colors duration-300 flex items-center justify-center">
                  <AnimatedNumber value={25} />-<AnimatedNumber value={40} suffix="%" />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-gray-300 font-medium uppercase tracking-wider transition-colors duration-300">Reduction in electricity costs</div>
              </div>
              <div className="text-center px-4 group hover:bg-dark transition-colors duration-300 p-6 rounded-sm cursor-pointer flex flex-col items-center justify-center">
                <Calendar className="w-8 h-8 text-dark group-hover:text-primary mb-4 transition-colors duration-300" strokeWidth={1.5} />
                <div className="text-4xl lg:text-5xl font-display font-bold text-dark group-hover:text-white mb-2 transition-colors duration-300 flex items-center justify-center">
                  <AnimatedNumber value={25} suffix=" yrs" />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-gray-300 font-medium uppercase tracking-wider transition-colors duration-300">Guaranteed performance life</div>
              </div>
              <div className="text-center px-4 group hover:bg-dark transition-colors duration-300 p-6 rounded-sm cursor-pointer flex flex-col items-center justify-center">
                <Wrench className="w-8 h-8 text-dark group-hover:text-primary mb-4 transition-colors duration-300" strokeWidth={1.5} />
                <div className="text-4xl lg:text-5xl font-display font-bold text-dark group-hover:text-white mb-2 transition-colors duration-300 flex items-center justify-center">
                  <AnimatedNumber value={5} suffix=" yrs" />
                </div>
                <div className="text-sm text-gray-500 group-hover:text-gray-300 font-medium uppercase tracking-wider transition-colors duration-300">O&M included with every project</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Types Intro */}
      <section className="pt-32 pb-16 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-dark mb-6 tracking-tight">
              Choose the right solar system <br className="hidden lg:block" /> for your business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Every site is different. We assess your grid connection, load profile, and uptime needs — then recommend the system that delivers the best return for your situation.
            </p>
            <SystemSelectorForm />
          </FadeIn>
        </div>
      </section>

      {/* System 1: On-Grid */}
      <StickyScrollSection id="on-grid-section" className="bg-gray-50" stacked={true}>
        <div className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              On-Grid Solar
            </div>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 text-center">Stay connected. Pay less.</h3>
            <p className="text-xl text-gray-600 font-light mb-16 max-w-4xl mx-auto text-center">
              The most cost-effective starting point for businesses with a stable grid connection. Your panels generate power during the day. Your facility runs on solar first. Surplus is exported to the DISCOM grid and credited to your bill via net metering.
            </p>
          </FadeIn>

          {/* New How it Works Horizontal Layout */}
          <FadeIn delay={0.1}>
            <div className="mb-20">
              <h4 className="font-bold text-dark mb-12 uppercase tracking-wider text-sm text-center">How it works</h4>
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0 relative">
                {[
                  { step: "01", title: "Panels generate DC power", desc: "Sunlight is converted to DC electricity throughout the day", icon: Sun },
                  { step: "02", title: "Inverter converts to AC", desc: "DC is converted to 415V AC — the standard your facility already runs on", icon: Server },
                  { step: "03", title: "Solar powers your site", desc: "Panels feed your electrical panel directly. Equipment on solar in real time", icon: Plug },
                  { step: "04", title: "Surplus goes to the grid", desc: "Excess generation is exported and credited to your account via net metering", icon: LayoutGrid },
                  { step: "05", title: "Grid covers the rest", desc: "After sunset or on low-generation days, the grid supplies the shortfall as normal", icon: Moon }
                ].map((item, i, arr) => {
                  const isHovered = hoveredStep === `ongrid-${i}`;
                  const isAnyHovered = hoveredStep !== null && hoveredStep.startsWith('ongrid-');
                  const scale = isHovered ? 1.1 : (isAnyHovered ? 0.95 : 1);
                  const opacity = isHovered ? 1 : (isAnyHovered ? 0.5 : 1);

                  return (
                    <React.Fragment key={i}>
                      <motion.div 
                        className={`relative z-10 flex flex-col items-center text-center w-full lg:flex-1 p-6 rounded-sm cursor-pointer transition-colors duration-300 ${isHovered ? 'bg-dark' : 'bg-transparent'}`}
                        onMouseEnter={() => setHoveredStep(`ongrid-${i}`)}
                        onMouseLeave={() => setHoveredStep(null)}
                        animate={{ scale, opacity }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className={`text-3xl lg:text-4xl font-light mb-3 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-gray-400'}`}>
                          {item.step}
                        </div>
                        <div className={`w-3 h-3 rounded-full mb-4 transition-colors duration-300 ${isHovered ? 'bg-primary' : 'bg-blue-600'}`} />
                        <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full border flex items-center justify-center mb-6 transition-all duration-300 ${isHovered ? 'border-primary shadow-xl bg-dark' : 'bg-white border-gray-300'}`}>
                          <item.icon className={`w-8 h-8 lg:w-10 lg:h-10 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-dark'}`} strokeWidth={1.5} />
                        </div>
                        <p className={`text-sm lg:text-sm leading-relaxed transition-colors duration-300 ${isHovered ? 'text-gray-300' : 'text-gray-600'}`}>
                          <strong className={`font-medium block mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-dark'}`}>{item.title}:</strong>
                          {item.desc}
                        </p>
                      </motion.div>
                      
                      {i < arr.length - 1 && (
                        <div className="hidden lg:flex items-center justify-center mt-[8.5rem] text-gray-300 shrink-0 w-8">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <FadeIn delay={0.2}>
              <div className="space-y-4">
                <h4 className="font-bold text-dark uppercase tracking-wider text-sm mb-4">Why it works for your business</h4>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Lowest installation cost</strong> — no batteries required — fastest payback.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Immediate bill savings</strong> — every unit generated is a unit not bought from the DISCOM.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Net metering credits</strong> — surplus generation earns bill credits — nothing is wasted.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Right for:</strong> businesses with a reliable grid and a primary goal of reducing monthly bills.</p></div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} className="flex justify-start lg:justify-end items-center">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-dark font-bold hover:bg-dark hover:text-white transition-colors rounded-sm group">
                Get a free on-grid assessment <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>

          {/* Wide Image Below */}
          <FadeIn delay={0.4}>
            <div className="relative h-[400px] lg:h-[500px] w-full rounded-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop" alt="On-Grid Solar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </FadeIn>
        </div>
      </StickyScrollSection>

      {/* System 2: Off-Grid */}
      <StickyScrollSection id="off-grid-section" className="bg-white" stacked={true}>
        <div className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Off-Grid Solar
            </div>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 text-center">No grid dependency. Complete independence.</h3>
            <p className="text-xl text-gray-600 font-light mb-16 max-w-4xl mx-auto text-center">
              For sites where the grid is absent, unreliable, or too costly to connect to. A self-contained system. Solar panels generate power, a battery bank stores it, and your facility draws from storage as needed — day or night.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mb-20">
              <h4 className="font-bold text-dark mb-12 uppercase tracking-wider text-sm text-center">How it works</h4>
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0 relative">
                {[
                  { step: "01", title: "Panels generate DC power", desc: "The system's only energy input — solar generation throughout the day.", icon: Sun },
                  { step: "02", title: "Charge controller manages flow", desc: "Regulates electricity into the battery bank, protecting battery health and lifespan.", icon: Activity },
                  { step: "03", title: "Battery bank stores energy", desc: "Surplus generation is stored for use at night or during low-sun periods.", icon: Battery },
                  { step: "04", title: "Inverter converts when needed", desc: "DC from batteries is converted to 415V AC to power your equipment on demand.", icon: Server }
                ].map((item, i, arr) => {
                  const isHovered = hoveredStep === `offgrid-${i}`;
                  const isAnyHovered = hoveredStep !== null && hoveredStep.startsWith('offgrid-');
                  const scale = isHovered ? 1.1 : (isAnyHovered ? 0.95 : 1);
                  const opacity = isHovered ? 1 : (isAnyHovered ? 0.5 : 1);

                  return (
                    <React.Fragment key={i}>
                      <motion.div 
                        className={`relative z-10 flex flex-col items-center text-center w-full lg:flex-1 p-6 rounded-sm cursor-pointer transition-colors duration-300 ${isHovered ? 'bg-dark' : 'bg-transparent'}`}
                        onMouseEnter={() => setHoveredStep(`offgrid-${i}`)}
                        onMouseLeave={() => setHoveredStep(null)}
                        animate={{ scale, opacity }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className={`text-3xl lg:text-4xl font-light mb-3 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-gray-400'}`}>
                          {item.step}
                        </div>
                        <div className={`w-3 h-3 rounded-full mb-4 transition-colors duration-300 ${isHovered ? 'bg-primary' : 'bg-blue-600'}`} />
                        <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full border flex items-center justify-center mb-6 transition-all duration-300 ${isHovered ? 'border-primary shadow-xl bg-dark' : 'bg-gray-50 border-gray-200'}`}>
                          <item.icon className={`w-8 h-8 lg:w-10 lg:h-10 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-dark'}`} strokeWidth={1.5} />
                        </div>
                        <p className={`text-sm lg:text-sm leading-relaxed transition-colors duration-300 ${isHovered ? 'text-gray-300' : 'text-gray-600'}`}>
                          <strong className={`font-medium block mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-dark'}`}>{item.title}:</strong>
                          {item.desc}
                        </p>
                      </motion.div>
                      
                      {i < arr.length - 1 && (
                        <div className="hidden lg:flex items-center justify-center mt-[8.5rem] text-gray-300 shrink-0 w-8">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <FadeIn delay={0.2}>
              <div className="space-y-4">
                <h4 className="font-bold text-dark uppercase tracking-wider text-sm mb-4">Why it works for your business</h4>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Complete grid independence</strong> — no exposure to tariff hikes, outages, or grid instability.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Power anywhere</strong> — viable for remote sites where grid infrastructure is absent or expensive.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Zero ongoing utility bills</strong> — once commissioned, your energy cost is fixed and minimal.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-700"><strong className="text-dark">Right for:</strong> remote industrial sites, mining operations, agri-processing units with no reliable grid.</p></div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} className="flex justify-start lg:justify-end items-center">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-dark font-bold hover:bg-dark hover:text-white transition-colors rounded-sm group">
                Talk to us about off-grid solar <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="relative h-[400px] lg:h-[500px] w-full rounded-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2000&auto=format&fit=crop" alt="Off-Grid Solar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </FadeIn>
        </div>
      </StickyScrollSection>

      {/* System 3: Hybrid */}
      <StickyScrollSection id="hybrid-section" className="bg-dark text-white" stacked={true}>
        <div className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Hybrid Solar
            </div>
            <h3 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 text-center">Maximum savings. Uninterrupted operations.</h3>
            <p className="text-xl text-gray-300 font-light mb-16 max-w-4xl mx-auto text-center">
              For businesses that need both cost savings and full power security — no compromise. A hybrid system combines solar generation, battery storage, and a live grid connection.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mb-20">
              <h4 className="font-bold text-white mb-12 uppercase tracking-wider text-sm text-center">How it works</h4>
              
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0 relative">
                {[
                  { step: "01", title: "Panels power your facility", desc: "Solar generation meets your real-time load first — grid and batteries are secondary.", icon: Sun },
                  { step: "02", title: "Surplus charges batteries", desc: "Excess generation fills the battery bank before anything is exported to the grid.", icon: Battery },
                  { step: "03", title: "Batteries discharge intelligently", desc: "During peak tariff hours or grid outages, batteries discharge automatically.", icon: Activity },
                  { step: "04", title: "Grid backs up when needed", desc: "When solar and batteries are both insufficient, the grid supplies the shortfall.", icon: LayoutGrid },
                  { step: "05", title: "Seamless switchover in <20ms", desc: "On a grid fault, the system moves to battery in under 20 milliseconds.", icon: Zap }
                ].map((item, i, arr) => {
                  const isHovered = hoveredStep === `hybrid-${i}`;
                  const isAnyHovered = hoveredStep !== null && hoveredStep.startsWith('hybrid-');
                  const scale = isHovered ? 1.1 : (isAnyHovered ? 0.95 : 1);
                  const opacity = isHovered ? 1 : (isAnyHovered ? 0.5 : 1);

                  return (
                    <React.Fragment key={i}>
                      <motion.div 
                        className={`relative z-10 flex flex-col items-center text-center w-full lg:flex-1 p-6 rounded-sm cursor-pointer transition-colors duration-300 ${isHovered ? 'bg-black' : 'bg-transparent'}`}
                        onMouseEnter={() => setHoveredStep(`hybrid-${i}`)}
                        onMouseLeave={() => setHoveredStep(null)}
                        animate={{ scale, opacity }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className={`text-3xl lg:text-4xl font-light mb-3 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-gray-500'}`}>
                          {item.step}
                        </div>
                        <div className={`w-3 h-3 rounded-full mb-4 transition-colors duration-300 ${isHovered ? 'bg-primary' : 'bg-blue-600'}`} />
                        <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full border flex items-center justify-center mb-6 transition-all duration-300 ${isHovered ? 'border-primary shadow-xl bg-black' : 'bg-white/5 border-white/10'}`}>
                          <item.icon className={`w-8 h-8 lg:w-10 lg:h-10 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-white'}`} strokeWidth={1.5} />
                        </div>
                        <p className={`text-sm lg:text-sm leading-relaxed transition-colors duration-300 ${isHovered ? 'text-gray-300' : 'text-gray-400'}`}>
                          <strong className={`font-medium block mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-200'}`}>{item.title}:</strong>
                          {item.desc}
                        </p>
                      </motion.div>
                      
                      {i < arr.length - 1 && (
                        <div className="hidden lg:flex items-center justify-center mt-[8.5rem] text-gray-500 shrink-0 w-8">
                          <ArrowRight className="w-6 h-6" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <FadeIn delay={0.2}>
              <div className="space-y-4">
                <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Why it works for your business</h4>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-300"><strong className="text-white">Uninterrupted operations</strong> — battery backup kicks in before production equipment registers a fault.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-300"><strong className="text-white">Peak tariff avoidance</strong> — discharge batteries during expensive peak windows; recharge on cheap solar.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-300"><strong className="text-white">Demand charge reduction</strong> — cap your peak demand recording — one of the largest hidden costs on a C&I bill.</p></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><p className="text-gray-300"><strong className="text-white">Right for:</strong> manufacturers, cold storage, hospitals — any business where a power cut is a financial event.</p></div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} className="flex justify-start lg:justify-end items-center">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-dark font-bold hover:bg-white transition-colors rounded-sm group">
                Talk to us about hybrid solar <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="relative h-[400px] lg:h-[500px] w-full rounded-sm overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2000&auto=format&fit=crop" alt="Hybrid Solar" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-colors duration-500" />
            </div>
          </FadeIn>
        </div>
      </StickyScrollSection>

      {/* Comparison Table */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-dark mb-4">System Comparison at a Glance</h2>
              <p className="text-xl text-gray-600">Compare features to find the right fit for your facility.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-6 border-b-2 border-gray-200 font-bold text-dark text-lg bg-white">Feature</th>
                    <th className="p-6 border-b-2 border-primary font-bold text-dark text-lg bg-gray-50">On-Grid</th>
                    <th className="p-6 border-b-2 border-gray-800 font-bold text-dark text-lg bg-gray-50">Off-Grid</th>
                    <th className="p-6 border-b-2 border-primary font-bold text-dark text-lg bg-gray-50">Hybrid</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-b border-gray-100 font-bold text-dark">Grid Connection</td>
                    <td className="p-6 border-b border-gray-100">Always connected</td>
                    <td className="p-6 border-b border-gray-100">Fully independent</td>
                    <td className="p-6 border-b border-gray-100">Connected + battery backup</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-b border-gray-100 font-bold text-dark">Battery Storage</td>
                    <td className="p-6 border-b border-gray-100">Not required</td>
                    <td className="p-6 border-b border-gray-100">Essential</td>
                    <td className="p-6 border-b border-gray-100">Required</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-b border-gray-100 font-bold text-dark">Works During Outage</td>
                    <td className="p-6 border-b border-gray-100 text-gray-400">No — shuts down</td>
                    <td className="p-6 border-b border-gray-100 font-medium text-dark">Yes — runs on battery</td>
                    <td className="p-6 border-b border-gray-100 font-medium text-dark">Yes — runs on battery</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-b border-gray-100 font-bold text-dark">Net Metering</td>
                    <td className="p-6 border-b border-gray-100 font-medium text-dark">Yes</td>
                    <td className="p-6 border-b border-gray-100 text-gray-400">No</td>
                    <td className="p-6 border-b border-gray-100 font-medium text-dark">Yes</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-b border-gray-100 font-bold text-dark">Best For</td>
                    <td className="p-6 border-b border-gray-100">Stable grid, cost saving</td>
                    <td className="p-6 border-b border-gray-100">Remote / low-grid sites</td>
                    <td className="p-6 border-b border-gray-100">Outage-prone, peak tariff businesses</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-b border-gray-100 font-bold text-dark">Installation Cost</td>
                    <td className="p-6 border-b border-gray-100">Lowest</td>
                    <td className="p-6 border-b border-gray-100">Higher</td>
                    <td className="p-6 border-b border-gray-100">Moderate to high</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-12 bg-gray-50 p-8 rounded-sm border-l-4 border-primary flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-lg text-gray-700 font-light italic max-w-3xl">
                "Most clients start with on-grid. Businesses with critical loads or frequent outages go straight to hybrid. Off-grid is for remote or poorly-connected sites. One site visit is all we need to tell you which is right for yours."
              </p>
              <Link to="/contact" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-dark text-white rounded-sm font-bold hover:bg-primary hover:text-dark transition-colors">
                Assess my site <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why Solar Now & What You Get */}
      <section className="py-24 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <FadeIn>
              <h2 className="text-4xl font-display font-bold text-dark mb-6">Why businesses are switching to solar now</h2>
              <p className="text-xl text-gray-600 font-light mb-8">The financial case has never been clearer.</p>
              <ul className="space-y-6">
                {[
                  { title: "Electricity tariffs keep rising", desc: "C&I rates have increased 30–40% over the last decade. Every year you wait, the gap widens.", icon: LineChart },
                  { title: "Payback in 18–24 months", desc: "Most of our projects recover full investment in under two years. After that, power is near-free.", icon: Battery },
                  { title: "Your load profile is ideal", desc: "Factories and commercial buildings consume the most power during daylight — exactly when solar peaks.", icon: Factory },
                  { title: "Grid independence is a real advantage", desc: "Power cuts and demand charges hit your margins. Solar reduces or eliminates both.", icon: Zap },
                  { title: "25 years of guaranteed output", desc: "A plant commissioned today is still performing in 2050.", icon: Shield }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-sm shadow-sm border border-gray-100 shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <strong className="text-dark block text-lg">{item.title}</strong>
                      <span className="text-gray-600">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="bg-dark p-10 rounded-sm text-white h-full flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-150" />
                <h3 className="text-3xl font-display font-bold mb-8 relative z-10">What you get with Powermore</h3>
                
                <div className="space-y-8 relative z-10">
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-2">Cut your electricity costs from Day 1</h4>
                    <p className="text-gray-300 font-light">Solar offsets 30–60% of your consumption immediately. Every unit your plant generates is a unit not purchased from the grid.</p>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-2">Reduce your grid exposure</h4>
                    <p className="text-gray-300 font-light">Power cuts, tariff hikes, demand charges — solar with storage keeps operations running regardless of what the grid does.</p>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-2">Own your energy for 25 years</h4>
                    <p className="text-gray-300 font-light">Captive solar costs ₹2.50–4.00/unit. Grid tariffs run ₹7–12/unit and rising. The gap compounds in your favour every year.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Choose Powermore - Bento Grid */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-4">Why businesses choose Powermore</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "We work for your project, not a brand", desc: "No margins on hardware. We specify what's right for your site and take full responsibility for the outcome.", icon: ShieldCheck },
              { title: "Numbers from your data, not averages", desc: "Your savings estimate is built from your actual bills and your actual site — not an industry template.", icon: BarChart },
              { title: "One team, end to end", desc: "Engineering, procurement, installation, commissioning, DISCOM applications, monitoring — one company, one accountability.", icon: Settings },
              { title: "5 years of O&M, included", desc: "Every plant comes with 5 years of maintenance from Powermore. We monitor performance and act before you need to call us.", icon: Wrench }
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="p-10 bg-gray-50 rounded-sm border border-gray-100 hover:bg-dark transition-all duration-300 group h-full cursor-pointer">
                  <item.icon className="w-10 h-10 text-dark mb-6 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold text-dark group-hover:text-white transition-colors duration-300 mb-4">{item.title}</h3>
                  <p className="text-gray-600 group-hover:text-gray-300 text-lg font-light leading-relaxed transition-colors duration-300">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How We Deliver */}
      <section className="py-24 bg-dark text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">How we deliver your solar plant</h2>
            <p className="text-xl text-gray-400 font-light">A structured five-step process. Most projects are commissioned within 4–8 weeks of contract signing.</p>
          </FadeIn>
          
          <div className="space-y-4">
            {deliverySteps.map((step, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div 
                  className={`border rounded-sm overflow-hidden transition-all duration-300 ${activeStep === idx ? 'border-primary bg-white/10 backdrop-blur-md' : 'border-white/10 bg-transparent hover:border-white/30'}`}
                >
                  <button 
                    className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none group"
                    onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`text-2xl font-mono font-bold transition-colors ${activeStep === idx ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`}>0{idx + 1}</span>
                      <h3 className={`text-2xl font-bold transition-colors ${activeStep === idx ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{step.title}</h3>
                    </div>
                    {activeStep === idx ? <ChevronUp className="w-6 h-6 text-primary" /> : <ChevronDown className="w-6 h-6 text-gray-500 group-hover:text-gray-300" />}
                  </button>
                  <AnimatePresence>
                    {activeStep === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-8 pb-8 pl-[5.5rem] text-gray-300 text-lg font-light leading-relaxed">
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

      {/* Who We Work With */}
      <section className="py-24 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-4">We work with businesses where energy bills are a real cost</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Manufacturers & Factories", desc: "Steel, textiles, food processing, pharma, chemicals, auto", icon: Factory, img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop" },
              { title: "Warehouses & Logistics", desc: "Cold storage, distribution centres, fulfilment hubs", icon: Warehouse, img: "https://images.unsplash.com/photo-1586528116311-ad8ed7c508c0?q=80&w=800&auto=format&fit=crop" },
              { title: "Commercial Offices & Campuses", desc: "IT parks, hospitals, educational institutions, retail", icon: Building2, img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" },
              { title: "Industrial Estates", desc: "Large factory compounds and industrial zones", icon: Activity, img: "https://images.unsplash.com/photo-1504333638930-c8787321fee0?q=80&w=800&auto=format&fit=crop" }
            ].map((sector, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <Link to="/customers" className="relative h-80 rounded-sm overflow-hidden group cursor-pointer block">
                  <img src={sector.img} alt={sector.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <sector.icon className="w-10 h-10 text-primary mb-4 transform group-hover:-translate-y-2 transition-transform duration-300" />
                    <h3 className="text-xl font-bold text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">{sector.title}</h3>
                    <div className="overflow-hidden">
                      <p className="text-gray-300 text-sm font-light transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 h-0 group-hover:h-auto">
                        {sector.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-dark to-transparent" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl lg:text-6xl font-display font-bold text-dark mb-8 tracking-tight">
              Find out what solar saves your business.
            </h2>
            <p className="text-xl text-dark/80 font-medium mb-10 max-w-2xl mx-auto">
              Share your electricity bill and site details. We'll return a savings projection and plant design — for free | Real numbers. No generic estimates.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-dark text-white rounded-sm font-bold text-lg hover:bg-black transition-colors shadow-2xl hover:shadow-xl hover:-translate-y-1 transform duration-200">
              Get Your Free Projection <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
