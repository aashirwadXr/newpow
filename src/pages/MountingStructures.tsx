import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Shield, Wrench, Wind, FileText, ArrowUpRight, Zap } from 'lucide-react';
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

export default function MountingStructures() {
  return (
    <div className="bg-white relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 z-10 overflow-hidden min-h-[70vh] flex items-center bg-dark text-white">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_073118_181ce382-f52f-40a7-a86d-d108413ae9d8.png&w=1920&q=85" alt="Solar Mounting Structure" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
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
                <Wrench className="w-4 h-4" />
                Mounting Structures
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-8">
                The foundation of a <br />
                <span className="text-primary">25-year asset.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                Solar panels get the glory, but the mounting structure takes the load. We engineer structures that survive Indian monsoons, high wind zones, and decades of thermal expansion.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Structure Matters */}
      <section className="py-24 lg:py-32 relative z-10 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <FadeIn className="lg:col-span-6">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-8 tracking-tight">
                Why the structure is the most critical component
              </h2>
              <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                <p>
                  If an inverter fails, it's a warranty claim. If a mounting structure fails during a cyclone, it's a catastrophic loss of the entire plant — and potentially the roof beneath it.
                </p>
                <p>
                  In the push for cheaper solar, the mounting structure is where corners are cut first. Thinner steel, inadequate galvanisation, and generic designs that ignore local wind loads are common.
                </p>
                <p>
                  At Powermore, we treat the mounting structure as a structural engineering project, not a commodity. Every structure we install is site-specific, load-tested, and built from premium materials designed to outlast the panels they hold.
                </p>
              </div>
              <div className="mt-10 p-6 bg-gray-50 border-l-4 border-primary rounded-r-sm">
                <p className="text-xl text-dark font-medium italic">
                  "A solar plant is only as secure as the steel holding it down."
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden group">
                <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_073144_99b9cfff-ae82-49b9-90c8-712b5f6d9ea7.png&w=1920&q=85" alt="Structural Engineering" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mounting Solutions */}
      <section className="py-24 lg:py-32 relative z-10 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 tracking-tight">Mounting solutions for every C&I site</h2>
          </FadeIn>

          <div className="space-y-0">
            {/* Tin Shed */}
            <div className="flex flex-col lg:flex-row items-start relative border-t border-gray-100 py-12 lg:py-16">
              <div className="lg:w-1/2 lg:sticky lg:top-32 lg:pr-16 mb-12 lg:mb-0 flex justify-center lg:justify-start">
                <div className="w-full max-w-[540px] aspect-[3/4] relative rounded-sm overflow-hidden shadow-xl">
                  <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_073201_06d15b1a-0fe6-4b54-90c9-326dddcb8833.png&w=1920&q=85" alt="Tin Shed Roofs" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-8 lg:min-h-[80vh] flex flex-col justify-center">
                <FadeIn>
                  <h3 className="text-4xl font-display font-bold text-dark mb-6">Tin Shed / Trapezoidal Roofs</h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                    The most common industrial roof type requires the most careful engineering to prevent leaks and structural fatigue.
                  </p>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                    We use non-penetrative clamps wherever possible, attaching directly to the standing seam or trapezoidal rib. Where penetration is required, we use EPDM rubber gaskets and specialized fasteners to guarantee waterproofing.
                  </p>
                  
                  <div className="bg-[#26282F] p-4 lg:p-6 rounded-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Non-penetrative options</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Preserves your roof warranty and eliminates leak risks.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Aluminium short rails</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Lightweight, corrosion-resistant, and fast to install.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Walkways integrated</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Safe O&M access without stepping on fragile roof sheets.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* RCC Flat Roofs */}
            <div className="flex flex-col lg:flex-row items-start relative border-t border-gray-100 py-12 lg:py-16">
              <div className="lg:w-1/2 lg:sticky lg:top-32 lg:pr-16 mb-12 lg:mb-0 flex justify-center lg:justify-start">
                <div className="w-full max-w-[540px] aspect-[3/4] relative rounded-sm overflow-hidden shadow-xl">
                  <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_073210_9efaef12-0ff5-4612-b103-8fdf41513126.png&w=1920&q=85" alt="RCC Flat Roofs" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-8 lg:min-h-[80vh] flex flex-col justify-center">
                <FadeIn>
                  <h3 className="text-4xl font-display font-bold text-dark mb-6">RCC Flat Roofs</h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                    Flat roofs offer flexibility but require careful management of wind uplift and building load limits.
                  </p>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                    Depending on your roof's load-bearing capacity, we design either penetrative structures (anchored to the slab) or ballasted structures (weighed down by concrete blocks, requiring zero drilling).
                  </p>
                  
                  <div className="bg-[#26282F] p-4 lg:p-6 rounded-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Aerodynamic ballasted designs</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Minimizes wind uplift without puncturing the waterproofing.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Elevated structures</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Available if you need to use the roof space below the panels.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Optimal tilt angles</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Custom-designed to maximize generation for your specific latitude.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Ground-Mounted */}
            <div className="flex flex-col lg:flex-row items-start relative border-t border-gray-100 py-12 lg:py-16">
              <div className="lg:w-1/2 lg:sticky lg:top-32 lg:pr-16 mb-12 lg:mb-0 flex justify-center lg:justify-start">
                <div className="w-full max-w-[540px] aspect-[3/4] relative rounded-sm overflow-hidden shadow-xl">
                  <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_080321_9342bbb4-ef94-4de2-a04b-d07aee68f5d4.png&w=1920&q=85" alt="Ground-Mounted Plants" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-8 lg:min-h-[80vh] flex flex-col justify-center">
                <FadeIn>
                  <h3 className="text-4xl font-display font-bold text-dark mb-6">Ground-Mounted Plants</h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                    For large captive plants on open land, the structure must handle uneven terrain, soil variations, and significant wind loads.
                  </p>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                    We conduct geotechnical surveys before driving a single pile. Our ground-mount structures are typically hot-dip galvanized steel, engineered for the specific soil chemistry and wind zone of your site.
                  </p>
                  
                  <div className="bg-[#26282F] p-4 lg:p-6 rounded-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Rammed pile or concrete foundation</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Based on geotechnical soil reports.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Seasonal tilt options</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Manually adjustable structures to increase yield by 4–5% annually.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">High ground clearance</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Prevents shading from vegetation and protects against waterlogging.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What goes into every structure */}
      <section className="py-24 lg:py-32 relative z-10 bg-dark text-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <FadeIn className="lg:col-span-4">
              <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">What goes into every Powermore structure</h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                We don't use "off-the-shelf" kits for commercial projects. Every structure is engineered for the site.
              </p>
            </FadeIn>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "STAAD.Pro Load Analysis", desc: "We simulate wind speeds up to 200 km/h (depending on the IS code for your zone) to ensure structural integrity before manufacturing begins.", icon: Wind, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_103715_0705c200-6e09-4e00-ac34-6ac5b2ddab65.png&w=1920&q=85" },
                { title: "Premium Materials", desc: "We use Hot-Dip Galvanized (HDG) steel (minimum 80 microns) or Galvalume (AZ150) for exceptional corrosion resistance, even in coastal or industrial environments.", icon: Shield, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_103722_75ef4f3e-2bae-47b5-949b-193f01ebe72c.png&w=1920&q=85" },
                { title: "IS Code Compliance", desc: "Every design complies with IS 875 (Part 3) for wind loads and IS 800 for general steel construction.", icon: FileText, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_103729_3d8e4672-c6d8-40a8-8afe-0259cdc699a3.png&w=1920&q=85" },
                { title: "10-Year Structural Warranty", desc: "We stand behind the steel. Our structures carry a 10-year warranty against manufacturing defects and corrosion.", icon: Shield, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_103734_3568bfa6-0589-47ad-9d8d-a1a65bc0fd81.png&w=1920&q=85" },
                { title: "Integrated Cable Management", desc: "We don't leave cables hanging. Our structures include built-in cable trays and routing to protect wiring from rodents and UV degradation.", icon: Zap, img: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_103743_75ef0c8a-4d0e-423b-b91f-7a3c36fe2dc6.png&w=1920&q=85" }
              ].map((feature, idx) => (
                <FadeIn key={idx} delay={idx * 0.1} className={idx === 4 ? "md:col-span-2" : ""}>
                  <div className="relative h-[320px] rounded-sm overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                    {/* Background Image always visible */}
                    <img src={feature.img} alt={feature.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    {/* Overlay - 40% default, darker on hover */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/80 transition-colors duration-500" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                      <feature.icon className="w-8 h-8 text-primary mb-4" />
                      <h4 className="text-2xl font-bold text-white mb-2">{feature.title}</h4>
                      
                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                        <div className="overflow-hidden">
                          <p className="text-gray-200 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pt-2">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative z-10 overflow-hidden bg-dark">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_103754_ec4eb96c-6770-448a-9857-b1c80a828367.png&w=1920&q=85" alt="Solar installation" className="w-full h-full object-cover" />
        </div>
        
        {/* Gradient Overlay (Lime green fading to dark) */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-dark/80 to-dark" />
        
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight">
              Don't compromise on the foundation of your solar plant.
            </h2>
            <p className="text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto">
              Get a free structural assessment for your roof today.
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
