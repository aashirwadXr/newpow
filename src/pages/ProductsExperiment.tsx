import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export default function ProductsExperiment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress for more cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Desktop Transforms
  const xDesktop = useTransform(smoothProgress, [0, 0.4, 0.8, 1], ["-25vw", "25vw", "0vw", "0vw"]);
  const yDesktop = useTransform(smoothProgress, [0, 0.4, 0.8, 1], ["0vh", "0vh", "15vh", "15vh"]);
  
  // Mobile Transforms
  const xMobile = useTransform(smoothProgress, [0, 0.4, 0.8, 1], ["0vw", "0vw", "0vw", "0vw"]);
  const yMobile = useTransform(smoothProgress, [0, 0.4, 0.8, 1], ["-25vh", "0vh", "20vh", "20vh"]);

  const x = isMobile ? xMobile : xDesktop;
  const y = isMobile ? yMobile : yDesktop;

  // 3D Rotations
  const rotateY = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [35, -35, 0, 0]);
  const rotateX = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [25, 25, 65, 65]);
  const rotateZ = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [-10, 10, 0, 0]);
  
  // Scale
  const scale = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [1, 1.15, 1, 1]);

  // Lighting & Effects
  const reflectionX = useTransform(smoothProgress, [0, 1], ["-100%", "50%"]);
  const sunOpacity = useTransform(smoothProgress, [0.2, 0.4, 0.6], [0, 1, 0]);
  const particlesOpacity = useTransform(smoothProgress, [0.7, 0.85], [0, 1]);

  return (
    <div className="bg-white text-dark selection:bg-primary selection:text-dark">
      
      {/* Main Scroll Container */}
      <div ref={containerRef} className="relative w-full h-[300vh]">
        
        {/* Sticky 3D Scene */}
        <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none flex items-center justify-center" style={{ perspective: 1200 }}>
          
          {/* Animated Sun Rays (Section 2) */}
          <motion.div
            style={{ opacity: sunOpacity }}
            className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-[#b3e600]/30 to-transparent blur-[100px] z-0"
          />

          {/* 3D Solar Panel */}
          <motion.div
            style={{
              x, y, rotateX, rotateY, rotateZ, scale,
              transformStyle: "preserve-3d",
              '--panel-w': isMobile ? '260px' : '380px',
              '--panel-h': isMobile ? '420px' : '600px',
              '--panel-d': '30px',
            } as React.CSSProperties}
            className="relative z-10 w-[var(--panel-w)] h-[var(--panel-h)]"
          >
            {/* 3D Shadow */}
            <div 
              className="absolute inset-0 bg-black/40 blur-2xl rounded-sm" 
              style={{ transform: 'translateZ(calc(var(--panel-d) * -1 - 60px)) scale(0.9)' }} 
            />

            {/* Front Face */}
            <div 
              className="absolute inset-0 bg-[#0f172a] border-[4px] border-[#94a3b8] overflow-hidden rounded-sm" 
              style={{ transform: 'translateZ(calc(var(--panel-d) / 2))' }}
            >
              {/* Panel Grid Lines */}
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#94a3b8 2px, transparent 2px), linear-gradient(90deg, #94a3b8 2px, transparent 2px)', backgroundSize: '12.5% 10%' }} />
              
              {/* Busbars (Thick vertical lines) */}
              <div className="absolute inset-0 flex justify-evenly px-4 opacity-60">
                <div className="w-1 h-full bg-[#cbd5e1]"></div>
                <div className="w-1 h-full bg-[#cbd5e1]"></div>
                <div className="w-1 h-full bg-[#cbd5e1]"></div>
                <div className="w-1 h-full bg-[#cbd5e1]"></div>
              </div>

              {/* Moving Light Reflection */}
              <motion.div
                style={{ x: reflectionX }}
                className="absolute inset-0 w-[200%] bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 mix-blend-overlay"
              />
            </div>

            {/* Back Face */}
            <div 
              className="absolute inset-0 bg-[#e2e8f0] border-[2px] border-[#cbd5e1] rounded-sm flex items-center justify-center" 
              style={{ transform: 'rotateY(180deg) translateZ(calc(var(--panel-d) / 2))' }}
            >
              {/* Junction Box */}
              <div className="w-16 h-20 bg-[#cbd5e1] rounded-sm border border-[#94a3b8] shadow-inner flex items-center justify-center">
                <div className="w-12 h-1 bg-[#94a3b8] rounded-full"></div>
              </div>
            </div>

            {/* Right Face */}
            <div 
              className="absolute top-0 bg-gradient-to-b from-[#f8fafc] to-[#94a3b8] border-y border-[#94a3b8]" 
              style={{ 
                width: 'var(--panel-d)', 
                height: 'var(--panel-h)', 
                left: 'calc(50% - var(--panel-d) / 2)', 
                transform: 'rotateY(90deg) translateZ(calc(var(--panel-w) / 2))' 
              }} 
            />

            {/* Left Face */}
            <div 
              className="absolute top-0 bg-gradient-to-b from-[#f8fafc] to-[#94a3b8] border-y border-[#94a3b8]" 
              style={{ 
                width: 'var(--panel-d)', 
                height: 'var(--panel-h)', 
                left: 'calc(50% - var(--panel-d) / 2)', 
                transform: 'rotateY(-90deg) translateZ(calc(var(--panel-w) / 2))' 
              }} 
            />

            {/* Top Face */}
            <div 
              className="absolute left-0 bg-gradient-to-r from-[#f8fafc] to-[#94a3b8] border-x border-[#94a3b8]" 
              style={{ 
                width: 'var(--panel-w)', 
                height: 'var(--panel-d)', 
                top: 'calc(50% - var(--panel-d) / 2)', 
                transform: 'rotateX(90deg) translateZ(calc(var(--panel-h) / 2))' 
              }} 
            />

            {/* Bottom Face */}
            <div 
              className="absolute left-0 bg-gradient-to-r from-[#f8fafc] to-[#94a3b8] border-x border-[#94a3b8]" 
              style={{ 
                width: 'var(--panel-w)', 
                height: 'var(--panel-d)', 
                top: 'calc(50% - var(--panel-d) / 2)', 
                transform: 'rotateX(-90deg) translateZ(calc(var(--panel-h) / 2))' 
              }} 
            />
          </motion.div>

          {/* Energy Particles (Section 3) */}
          <motion.div style={{ opacity: particlesOpacity }} className="absolute inset-0 flex flex-col items-center justify-center pt-64 z-0">
             <motion.div animate={{ y: [0, 150], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-2 h-8 bg-primary rounded-full mb-4 shadow-[0_0_15px_#b3e600]" />
             <motion.div animate={{ y: [0, 150], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "linear" }} className="w-2 h-8 bg-primary rounded-full mb-4 shadow-[0_0_15px_#b3e600]" />
             <motion.div animate={{ y: [0, 150], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.2, ease: "linear" }} className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_#b3e600]" />
          </motion.div>

          {/* Factory Silhouette (Section 3) */}
          <motion.div style={{ opacity: particlesOpacity }} className="absolute bottom-0 left-0 w-full z-0">
            <svg className="w-full h-auto text-gray-100" viewBox="0 0 1440 320" fill="currentColor" preserveAspectRatio="none">
              <path d="M0,320 L1440,320 L1440,160 L1300,160 L1300,80 L1150,80 L1150,180 L1000,180 L1000,100 L850,100 L850,200 L700,200 L700,120 L550,120 L550,220 L400,220 L400,140 L250,140 L250,240 L100,240 L100,180 L0,180 Z"></path>
            </svg>
          </motion.div>

        </div>

        {/* Scrollable Text Sections */}
        <div className="relative z-20 -mt-[100vh] pointer-events-none">
          
          {/* Section 1 */}
          <section className="h-screen flex items-end pb-32 md:pb-0 md:items-center justify-center md:justify-end w-full px-6 md:px-24">
            <div className="w-full md:w-5/12 pointer-events-auto bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-6 md:p-0 rounded-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-primary text-dark font-bold text-[10px] mb-4 uppercase tracking-widest">Introduction</div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6 leading-[1.1] tracking-tight">
                  Solar That Works <br /> All Day
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  Powermore solar systems generate clean electricity during the day while reducing operational electricity costs for factories and commercial buildings.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="h-screen flex items-end pb-32 md:pb-0 md:items-center justify-center md:justify-start w-full px-6 md:px-24">
            <div className="w-full md:w-5/12 pointer-events-auto bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-6 md:p-0 rounded-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-primary text-dark font-bold text-[10px] mb-4 uppercase tracking-widest">Energy Generation</div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6 leading-[1.1] tracking-tight">
                  Generating Power <br /> Throughout the Day
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  High-efficiency solar modules capture sunlight from morning to evening, producing clean electricity for your facility with maximum yield.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="h-screen flex items-start pt-32 justify-center w-full px-6 md:px-24 text-center">
            <div className="w-full md:w-6/12 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-primary text-dark font-bold text-[10px] mb-4 uppercase tracking-widest">Power Storage & Usage</div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-dark mb-6 leading-[1.1] tracking-tight">
                  Power Your Operations <br /> Even After Sunset
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
                  Energy generated during the day supports factory operations, warehouses, and offices, reducing dependency on grid electricity and protecting against outages.
                </p>
              </motion.div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
