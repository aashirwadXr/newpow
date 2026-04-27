import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import React, { useRef, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe, CheckCircle2 } from 'lucide-react';

const FadeUp = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const LineReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap justify-center gap-x-[0.3em]">
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden">
          <motion.span
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
};

const ParallaxImage = ({ src, alt, className = "" }: { src: string, alt: string, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-sm ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ scale: 1.2, y }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default function Mission() {
  const timelineRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  const scaleY = useSpring(timelineProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="bg-white text-dark selection:bg-primary selection:text-dark font-sans overflow-x-hidden">
      
      {/* 1. Hero Mission Statement */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508514177221-188b1c77eca2?q=80&w=2000&auto=format&fit=crop" 
            alt="Solar Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-gray-100/80 backdrop-blur-[2px]"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(179,230,0,0.05)_0%,transparent_70%)] z-0" />
        
        <div className="max-w-[1000px] relative z-10">
          <h1 className="text-[48px] md:text-[84px] lg:text-[96px] font-display font-bold leading-[1.1] tracking-tight mb-8 text-balance">
            <LineReveal text="Engineering the Future of Indian Energy Independence." />
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-lg md:text-2xl text-gray-500 font-light max-w-[720px] mx-auto leading-relaxed"
          >
            We are on a mission to transition 10,000 Indian businesses to 100% clean, predictable, and self-owned solar power by 2030.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* 2. Vision Statement Section */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              A Vision for a <br /> <span className="bg-primary text-dark px-2 rounded-sm inline-block">Decarbonized Industry.</span>
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed mb-10">
              For decades, Indian commercial and industrial sectors have relied on volatile grid power. We envision a future where every factory roof is a high-yield power plant, turning a background utility into a strategic financial asset.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-dark font-bold rounded-sm hover:bg-[#b3e600] transition-all hover:scale-105">
                Our Solutions
              </button>
              <button className="px-8 py-4 border border-dark text-dark font-bold rounded-sm hover:bg-dark hover:text-white transition-all">
                View Projects
              </button>
            </div>
          </FadeUp>
          
          <div className="relative aspect-square rounded-sm overflow-hidden shadow-2xl group">
            <motion.img 
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              src="https://images.unsplash.com/photo-1508514177221-188b1c77eca2?q=80&w=1000&auto=format&fit=crop" 
              alt="Solar Vision"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* 3. Mission Impact Section */}
      <section className="bg-dark py-32 px-6 lg:px-8 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <FadeUp>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Measurable Impact.</h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                We don't just install panels; we deliver long-term financial and environmental outcomes that scale with your business.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "Energy Sovereignty", 
                desc: "Eliminate dependency on grid fluctuations and rising tariff costs with self-owned generation." 
              },
              { 
                icon: Shield, 
                title: "Asset Longevity", 
                desc: "Engineering systems designed for 25+ years of peak performance in harsh Indian climates." 
              },
              { 
                icon: Globe, 
                title: "Carbon Leadership", 
                desc: "Directly contributing to India's Net Zero targets while improving your ESG ratings." 
              }
            ].map((card, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="p-10 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all group h-full">
                  <card.icon className="w-12 h-12 text-primary mb-8 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-display font-bold mb-4">{card.title}</h3>
                  <p className="text-base text-gray-400 font-light leading-relaxed">{card.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Storytelling Scroll Section */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-32">
          
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <h3 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">
                The Problem: <br /> <span className="text-gray-400">Passive Consumption.</span>
              </h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Most businesses view electricity as an unavoidable overhead. This passive approach leaves them vulnerable to policy changes, grid failures, and unpredictable operational costs.
              </p>
            </FadeUp>
            <ParallaxImage 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" 
              alt="Industrial Grid"
              className="aspect-video lg:aspect-square"
            />
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ParallaxImage 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop" 
              alt="Solar Transformation"
              className="aspect-video lg:aspect-square order-2 lg:order-1"
            />
            <FadeUp className="order-1 lg:order-2">
              <h3 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">
                The Solution: <br /> <span className="bg-primary text-dark px-2 rounded-sm inline-block">Active Generation.</span>
              </h3>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Powermore transforms your rooftop into a high-performance asset. We use advanced TOPCon technology and site-specific engineering to ensure every square meter of your facility produces maximum value.
              </p>
            </FadeUp>
          </div>

        </div>
      </section>

      {/* 5. Roadmap Timeline Section */}
      <section className="py-32 px-6 lg:px-8 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <FadeUp>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Roadmap</h2>
              <p className="text-lg text-gray-500 font-light">The journey to 10,000 solar-powered businesses.</p>
            </FadeUp>
          </div>

          <div ref={timelineRef} className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute left-1/2 top-0 bottom-0 w-px bg-primary -translate-x-1/2 z-10"
            />

            <div className="space-y-32">
              {[
                { 
                  year: "2021", 
                  title: "The Foundation", 
                  desc: "Powermore was established with a focus on high-precision EPC for industrial rooftops in Northern India.",
                  img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=400&auto=format&fit=crop"
                },
                { 
                  year: "2023", 
                  title: "Scaling Excellence", 
                  desc: "Reached 50+ C&I sites across 5 states, introducing automated O&M and real-time monitoring for all clients.",
                  img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=400&auto=format&fit=crop"
                },
                { 
                  year: "2025", 
                  title: "Technological Leap", 
                  desc: "Standardizing TOPCon and Bifacial modules across all projects, achieving 23%+ system efficiency.",
                  img: "https://images.unsplash.com/photo-1559302995-f09f61839977?q=80&w=400&auto=format&fit=crop"
                },
                { 
                  year: "2030", 
                  title: "The 10k Goal", 
                  desc: "Powering 10,000 businesses across India, contributing to 5GW of decentralized clean energy.",
                  img: "https://images.unsplash.com/photo-1466611653911-95282fc3656b?q=80&w=400&auto=format&fit=crop"
                }
              ].map((item, i) => (
                <div key={i} className={`relative flex items-center justify-between ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="w-[42%]">
                    <FadeUp delay={0.2}>
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-primary text-dark font-bold text-sm mb-2 uppercase tracking-widest">{item.year}</div>
                      <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                      <p className="text-gray-600 font-light text-sm leading-relaxed mb-6">{item.desc}</p>
                      <div className="aspect-video rounded-sm overflow-hidden shadow-md">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    </FadeUp>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-primary z-20" />

                  {/* Spacer */}
                  <div className="w-[42%]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call-to-Action Section */}
      <section className="py-48 px-6 lg:px-8 text-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(179,230,0,0.1)_0%,transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeUp>
            <h2 className="text-5xl md:text-[84px] font-display font-bold leading-[1.1] tracking-tight mb-8">
              Ready to Own Your <br /> <span className="bg-primary text-dark px-2 rounded-sm inline-block">Energy Future?</span>
            </h2>
            <p className="text-lg md:text-2xl text-gray-500 font-light mb-12 max-w-2xl mx-auto">
              Join the hundreds of Indian businesses already saving millions with Powermore.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="px-10 py-5 bg-primary text-dark font-bold rounded-sm hover:bg-[#b3e600] transition-all hover:scale-105 shadow-[0_0_20px_rgba(179,230,0,0.3)]">
                Get a Free Quote
              </Link>
              <Link to="/products" className="px-10 py-5 border border-dark text-dark font-bold rounded-sm hover:bg-dark hover:text-white transition-all">
                Explore Technology
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
