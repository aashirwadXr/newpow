import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sun, ThermometerSun, Zap, CheckCircle2, Shield, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export default function SolarPanels() {
  return (
    <div className="bg-white relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 z-10 overflow-hidden min-h-[70vh] flex items-center bg-dark text-white">
        <div className="absolute inset-0 opacity-20">
          <img src="https://i.ibb.co/6c3m0Q0h/Image-2.jpg" alt="Solar Panels Close Up" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
        </div>
        
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/20 text-primary font-medium text-sm mb-8 border border-primary/30 backdrop-blur-sm uppercase tracking-widest">
                <Sun className="w-4 h-4" />
                Solar Panels
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-8">
                We source panels that <br />
                <span className="text-primary">work as hard as you do.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                We don't sell solar panels — we select, procure, and install the ones your project actually needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Panel Choice Matters */}
      <section className="py-24 lg:py-32 relative z-10 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <FadeIn className="lg:col-span-6">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-8 tracking-tight">
                Why the panel choice matters more than you think
              </h2>
              <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                <p>
                  A solar panel is a 25-year commitment on your roof. The wrong choice — under-specified for your roof type, oversized for your inverter string, or simply not suited to Indian summer heat — costs you in generation, in maintenance, and eventually in early replacement.
                </p>
                <p>
                  As your EPC partner, we assess your site first: available area, structural load, orientation, shading profile, and your target ROI. Then we recommend and procure the panel technology that fits. We work with India's leading manufacturers and have the procurement relationships to get you the right module at the right price — without the sales pressure of being tied to one brand.
                </p>
              </div>
              <div className="mt-10 p-6 bg-gray-50 border-l-4 border-primary rounded-r-sm">
                <p className="text-xl text-dark font-medium italic">
                  "We are technology-agnostic. Our only bias is what performs best on your specific site."
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="lg:col-span-6">
              <div className="relative aspect rounded-sm overflow-hidden group">
                <img src="https://i.ibb.co/0pkQh847/Image-22.jpg" />
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Panel Technologies */}
      <section className="py-24 lg:py-32 relative z-10 bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <FadeIn className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 tracking-tight">Panel technologies we work with</h2>
            <p className="text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
              Every C&I project is different. A 2 MW ground-mounted captive plant calls for a different module than a 300 kW factory rooftop. Here's how we think about it.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "MOST POPULAR", title: "Mono PERC", desc: "The reliable choice for large industrial and commercial rooftops. Proven technology, strong performance across Indian conditions, and the best cost-per-kW for straightforward projects.", img: "https://i.ibb.co/zTgT237p/Mono-PERC.jpg" },
              { label: "HIGHEST YIELD", title: "TOPCon", desc: "The premium standard for new C&I installations. Industry-leading efficiency above 23%, near-zero degradation over 30 years, and the lowest Levelised Cost of Energy available today.", img: "https://i.ibb.co/y93MYsF/TOPCon.jpg" },
              { label: "GROUND & OPEN SITES", title: "Bifacial", desc: "Generates from both faces. Rear-side energy harvest adds 10–25% more annual generation — making it the strongest choice for ground-mounted captive plants and elevated arrays.", img: "https://i.ibb.co/mFg51WYh/Bifacial.jpg" },
              { label: "SPACE-CONSTRAINED PLANTS", title: "High-Wattage (720Wp)", desc: "When your roof is smaller than your load. Fewer panels, fewer rails, less cabling — a higher watt-per-module means a lower total installed cost per kW on large projects.", img: "https://i.ibb.co/Q3VGqhb8/High-Wattage-Modules.jpg" }
            ].map((tech, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="relative h-[400px] rounded-sm overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                  {/* Background Image */}
                  <img src={tech.img} alt={tech.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Gradient Overlay - Darkens on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">{tech.label}</span>
                    </div>
                    
                    <h3 className="text-3xl font-display font-bold text-white mb-0 group-hover:mb-4 transition-all duration-500 ease-out">{tech.title}</h3>
                    
                    {/* Expandable Description */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-gray-200 text-lg font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {tech.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* What we look for */}
      <section className="py-24 lg:py-32 relative z-10 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <FadeIn className="mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 tracking-tight">What we look for when we specify a panel</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              We don't pick by brand. We pick by what the project demands. These are the criteria we evaluate before recommending any module.
            </p>
          </FadeIn>
            
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { title: "Temperature coefficient", desc: "Indian summers routinely push rooftop temperatures past 45°C. A panel's output falls with heat — we select modules that lose the least.", icon: ThermometerSun, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_071052_6339ad73-27a4-4e8e-b62e-d7969905be59.png&w=1280&q=85" },
              { title: "Power tolerance", desc: "We only work with modules that carry zero or positive power tolerance. You get what the nameplate says — or more.", icon: Zap, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_071103_7a0d6487-3ec3-4e1e-8007-d1c0044142f6.png&w=1280&q=85" },
              { title: "Degradation warranty", desc: "Year 1 degradation and the annual rate from Year 2 onwards determines how much energy your plant actually produces in Year 20. We read the fine print.", icon: CheckCircle2, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_071113_bc646b0e-d292-4c49-ae10-5f77b38a71ce.png&w=1280&q=85" },
              { title: "Durability You Trust", desc: "From heavy monsoon winds to extreme heat, solar panels must perform reliably year after year. That's why we prioritize high wind-load ratings and hail resistance.", icon: Shield, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_071121_b269c272-4ff9-4b83-827b-f8bac740c94f.png&w=1280&q=85" },
              { title: "Supply chain reliability", desc: "A great panel is useless if it can't be delivered on time. We work with manufacturers who have proven supply track records for C&I project volumes.", icon: Factory, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_071131_adcba221-229d-41de-a73d-426eca93dc0d.png&w=1280&q=85" }
            ].map((criteria, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <div className="relative h-[320px] rounded-sm overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                  {/* Background Image always visible */}
                  <img src={criteria.img} alt={criteria.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Overlay - 40% default, darker on hover */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/80 transition-colors duration-500" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <criteria.icon className="w-8 h-8 text-primary mb-4" />
                    <h4 className="text-2xl font-bold text-white mb-2">{criteria.title}</h4>
                    
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-gray-200 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pt-2">
                          {criteria.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturers */}
      <section className="py-16 lg:py-20 relative z-10 bg-white overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 mb-12">
          <FadeIn className="text-center">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 tracking-tight">Manufacturers we source from</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              We have procurement partnerships with India's top solar panel manufacturers. All are pre-qualified against our C&I quality standards.
            </p>
          </FadeIn>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full max-w-[1800px] mx-auto">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
          
          <div className="flex overflow-hidden group">
            {[0, 1].map((trackIdx) => (
              <div key={trackIdx} className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap min-w-full shrink-0 items-center justify-around gap-6 px-3" aria-hidden={trackIdx === 1 ? "true" : "false"}>
                {[
                  { brand: "Vikram Solar", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/76/Vikram_Solar_logo.svg/1280px-Vikram_Solar_logo.svg.png", source: "TOPCon (HYPERSOL Series), Mono PERC", why: "Zero negative power tolerance; superior hail test performance; strong C&I track record" },
                  { brand: "Tata Power Solar", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Nce5skwV1-x4P3byd1McLtD0petYNO57Dw&s", source: "Mono PERC, TOPCon", why: "Fully integrated Indian manufacturer; BIS certified; trusted for institutional and industrial projects" },
                  { brand: "Waaree", logo: "https://companieslogo.com/img/orig/WAAREEENER.NS_BIG-5db0d002.png?t=1752238920", source: "TOPCon (Elite BiN Series), Mono PERC", why: "India's largest manufacturing capacity; consistent quality at scale; low LCOE across project life" },
                  { brand: "Avaada", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Avaada_Energy_Logo.png", source: "TOPCon Glass-Glass (720W), Bifacial", why: "Engineered specifically for high-temperature Indian C&I operating conditions" },
                  { brand: "Adani Solar", logo: "https://i0.wp.com/solarquarter.com/wp-content/uploads/2021/05/Adani-Solar-Logo_Four-Colour-Sq.png?fit=1403%2C1150&ssl=1", source: "TOPCon Glass-to-Glass, Mono PERC", why: "Fully integrated in-house manufacturing; strong supply chain for large project volumes" },
                  { brand: "Premier Energies", logo: "https://www.premierenergies.com/static/media/ftrlogo.989a9157a4e3bafc285b.png", source: "Mono PERC, TOPCon", why: "Fast-scaling Indian manufacturer with utility-grade quality standards" },
                  { brand: "RenewSys", logo: "https://sednaenergy.in/assets/img/clients/brand4.png", source: "DESERV Mono PERC Series", why: "Cost-competitive, BIS certified — reliable choice for value-focused C&I projects" }
                ].map((row, idx) => (
                  <div key={idx} className="relative w-[320px] h-[220px] bg-transparent rounded-xl overflow-hidden group/card transition-all duration-500 cursor-pointer hover:-translate-y-1 shrink-0 whitespace-normal">
                    {/* Logo Container */}
                    <div className="absolute inset-0 flex items-center justify-center p-8 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:-translate-y-10 group-hover/card:scale-90">
                      <img 
                        src={row.logo} 
                        alt={row.brand} 
                        className="max-h-16 w-auto max-w-[160px] object-contain grayscale opacity-50 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-500" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.classList.remove('hidden');
                          }
                        }}
                      />
                      <h3 className="hidden text-2xl font-display font-bold text-gray-400 tracking-tight group-hover/card:text-dark transition-all duration-500">{row.brand}</h3>
                    </div>
                    
                    {/* Hover Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-8 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center text-center bg-gradient-to-t from-white via-white to-transparent pt-12">
                      <div className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-widest border border-primary/20">
                        {row.source}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-3">
                        {row.why}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative z-10 overflow-hidden bg-dark">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_071151_ede311f0-71ab-4c64-87eb-432ed7a67914.png&w=1280&q=85" alt="Solar installation" className="w-full h-full object-cover" />
        </div>
        
        {/* Gradient Overlay (Lime green fading to dark) */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-dark/80 to-dark" />
        
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight">
              Not sure which panel is right for your project?
            </h2>
            <p className="text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto">
              Tell us your site details and we'll come back with a recommendation — and why.
            </p>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-primary text-dark rounded-sm font-bold text-lg hover:bg-primary/90 transition-colors shadow-2xl hover:shadow-xl hover:-translate-y-1 transform duration-200">
              Get a Free Assessment <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
