import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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

const CategoryCard = ({ title, text, image, link }: { title: string, text: string, image: string, link?: string }) => {
  const CardContent = (
    <div className="relative aspect-[16/10] sm:aspect-video rounded-sm overflow-hidden group cursor-pointer">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-300 flex items-center gap-2">
          {title}
          {link && <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </h3>
        <div className="overflow-hidden">
          <p className="text-gray-300 text-sm font-light transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 h-0 group-hover:h-auto mt-2">
            {text}
          </p>
        </div>
      </div>
    </div>
  );

  if (link) {
    return <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">{CardContent}</a>;
  }

  return <div className="h-full">{CardContent}</div>;
};

export default function Products() {
  const location = useLocation();

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

  return (
    <div className="bg-white relative overflow-hidden">
      {/* 1) Heading with copy and form */}
      <section className="relative pt-40 pb-32 z-10 overflow-hidden min-h-[80vh] flex items-center bg-dark">
        <img src="https://i.ibb.co/Y45s7rzs/Hero-Banner.jpg" alt="Products Hero" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/40 backdrop-blur-[2px]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6">
                High-Performance <br />
                <span className="text-primary">Solar Products.</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl font-light">
                We partner with tier-1 manufacturers to supply the most reliable, efficient, and durable solar components for commercial and industrial applications.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-sm border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-display font-bold text-white mb-2">Request Product Details</h3>
                <p className="text-gray-300 mb-8 font-light">Get specifications and pricing for your project.</p>
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                    <input type="text" placeholder="Company Name" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                  </div>
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                  <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:border-primary text-white placeholder-gray-400 transition-colors" />
                  <button type="button" className="w-full py-4 bg-primary text-dark font-bold text-lg rounded-sm hover:bg-white transition-colors mt-4 flex items-center justify-center gap-2 group">
                    Submit Inquiry <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2) Solar Section */}
      <section className="py-24 bg-white relative z-10" id="solar-panels">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6">Solar Panels Built for Commercial Generation</h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl leading-relaxed">
              Panel selection impacts generation output, degradation, and financial returns. We work with proven module technologies matched to roof type, exposure, and operating loads.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <FadeIn delay={0.1}>
              <CategoryCard 
                title="Mono PERC" 
                text="Reliable, cost-efficient modules suited for standard commercial rooftops with predictable load profiles."
                image="https://i.ibb.co/zTgT237p/Mono-PERC.jpg"
                link="https://bluebirdsolar.com/pages/mono-perc-solar-panels"
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <CategoryCard 
                title="TOPCon" 
                text="High-efficiency cells with better temperature coefficients for maximum yield in limited space."
                image="https://i.ibb.co/y93MYsF/TOPCon.jpg"
                link="https://bluebirdsolar.com/pages/topcon-solar-panels"
              />
            </FadeIn>
            <FadeIn delay={0.3}>
              <CategoryCard 
                title="Bifacial" 
                text="Captures albedo (reflected light) from the rear side, ideal for flat roofs with reflective surfaces."
                image="https://i.ibb.co/mFg51WYh/Bifacial.jpg"
                link="https://bluebirdsolar.com/pages/bifacial-solar-panels"
              />
            </FadeIn>
            <FadeIn delay={0.4}>
              <CategoryCard 
                title="High-Wattage Modules" 
                text="Fewer modules, faster installation, and optimized BOS costs for large rooftops and open sites."
                image="https://i.ibb.co/Q3VGqhb8/High-Wattage-Modules.jpg"
              />
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4} className="flex justify-center">
            <Link to="/solar-panels" className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white font-bold hover:bg-primary hover:text-dark transition-colors rounded-sm group">
              Explore Solar Solutions <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 3) Inverter Section */}
      <section className="py-24 bg-gray-50 relative z-10" id="inverters">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6">Inverter Systems Designed Around Load & Control</h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl leading-relaxed">
              Inverters are selected based on grid interaction, redundancy needs, and monitoring requirements—ensuring stable power conversion and predictable performance.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FadeIn delay={0.1}>
              <CategoryCard 
                title="On-Grid" 
                text="Ideal for net-metered systems where grid availability is stable and export is permitted."
                image="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260325_103224_3d8b0370-e6bf-4e47-af39-2644bc4a9163.jpeg&w=1920&q=85"
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <CategoryCard 
                title="Hybrid" 
                text="Enable integration of batteries for backup, peak management, or future scalability."
                image="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260325_103217_300b34e6-b855-4398-9a7c-2e6d1fc8b766.jpeg&w=1920&q=85"
              />
            </FadeIn>
            <FadeIn delay={0.3}>
              <CategoryCard 
                title="Microinverters" 
                text="Module-level control for complex rooftops, shading challenges, or enhanced monitoring needs."
                image="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260326_084845_974e429c-78d9-404d-bf07-8d3cb4fbdb92.jpeg&w=1920&q=85"
              />
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4} className="flex justify-center">
            <Link to="/inverters" className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white font-bold hover:bg-primary hover:text-dark transition-colors rounded-sm group">
              Explore Inverter Solutions <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 4) Mounting Structures Section */}
      <section className="py-24 bg-white relative z-10" id="mounting-structures">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6">Mounting Structures: Engineered for Stability</h2>
            <p className="text-xl text-gray-600 font-light max-w-3xl leading-relaxed">
              Mounting systems are engineered for wind load, corrosion resistance, and roof integrity ensuring long-term system security.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FadeIn delay={0.1}>
              <CategoryCard 
                title="Tin Shed Structures" 
                text="Lightweight, optimized designs minimizing roof stress"
                image="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260326_090138_03eb024b-0485-4b63-be90-3d8127a27377.jpeg&w=1920&q=85"
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <CategoryCard 
                title="RCC Rooftop Structures" 
                text="Anchored systems designed for stability and long-term durability"
                image="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260326_090528_a7e1465f-e4b6-4d3e-a08c-19e4ff2da3b7.jpeg&w=1920&q=85"
              />
            </FadeIn>
            <FadeIn delay={0.3}>
              <CategoryCard 
                title="Ground-Mounted Systems" 
                text="Used for open land or industrial campuses requiring scalable installations."
                image="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260326_090539_c60237cc-9d45-406b-a623-6fdc6f27357b.png&w=1920&q=85"
              />
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4} className="flex justify-center">
            <Link to="/mounting-structures" className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white font-bold hover:bg-primary hover:text-dark transition-colors rounded-sm group">
              Explore Mounting Structures <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
