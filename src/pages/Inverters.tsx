import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Zap, Activity, ShieldCheck, ArrowUpRight, ArrowRightLeft, Layers, Cloud, Maximize, Timer, TrendingDown, Shield, Battery, LayoutGrid, ZapOff, Award } from 'lucide-react';
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

export default function Inverters() {
  return (
    <div className="bg-white relative">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 z-10 overflow-hidden min-h-[70vh] flex items-center bg-dark text-white">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_071406_36a88065-17c2-4a14-a6d6-f0fbaa239d3e.png&w=1920&q=85" alt="Solar Inverter" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
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
                <Activity className="w-4 h-4" />
                Inverters
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-8">
                The right inverter turns <br />
                <span className="text-primary">sunlight into savings.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                We commission inverters that are matched to your plant, your grid connection, and your commercial objectives — not whatever's cheapest to install.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Inverter Selection Matters */}
      <section className="py-24 lg:py-32 relative z-10 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <FadeIn className="lg:col-span-6">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-8 tracking-tight">
                Why inverter selection is a commercial decision
              </h2>
              <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                <p>
                  An undersized inverter clips your generation. An oversized one wastes capital. One that isn't designed for Indian grid conditions trips constantly. And one that doesn't support monitoring leaves you flying blind on plant performance.
                </p>
                <p>
                  At Powermore, inverter selection happens after we've modelled your load profile, assessed your DISCOM connection type, and understood how you want to use your solar energy — whether that's pure grid offset, storage backup, peak shaving, or a combination. The inverter is then specified to match. We source from the world's leading manufacturers and commission every system in-house.
                </p>
              </div>
              <div className="mt-10 p-6 bg-gray-50 border-l-4 border-primary rounded-r-sm">
                <p className="text-xl text-dark font-medium italic">
                  "We don't carry stock or earn margins on hardware. Our recommendation is based entirely on what gives your project the best performance over its lifetime."
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden group">
                <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_071423_d4334925-534e-4135-a512-178e21e087ca.png&w=1920&q=85" alt="Inverter Installation" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Inverter Types */}
      <section className="py-24 lg:py-32 relative z-10 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-16 lg:mb-24">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 tracking-tight">Inverter types for C&I projects</h2>
          </FadeIn>

          <div className="space-y-0 relative">
            {/* On-Grid */}
            <div className="flex flex-col lg:flex-row items-start relative border-t border-gray-100 py-12 lg:py-16">
              <div className="lg:w-1/2 lg:sticky lg:top-32 lg:pr-16 mb-12 lg:mb-0 flex justify-center lg:justify-start">
                <div className="w-full max-w-[540px] aspect-[3/4] relative rounded-sm overflow-hidden shadow-xl">
                  <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_071438_a8b2771e-d80d-4cb5-a8fc-30ecd7cbceaf.png&w=1920&q=85" alt="On-Grid Inverter" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-8 lg:min-h-[80vh] flex flex-col justify-center">
                <FadeIn>
                  <h3 className="text-4xl font-display font-bold text-dark mb-6">On-Grid String Inverters</h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                    The standard for grid-connected commercial and industrial plants. On-grid inverters synchronise with the DISCOM grid, enable net metering, and are engineered for continuous operation in Indian grid conditions. If your business is connected to the grid and your primary goal is to reduce your electricity bill, this is your inverter.
                  </p>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                    We work with systems from 10 kW for smaller commercial premises all the way to 350 kW for large manufacturing plants — and we design the string architecture to maximise generation from your specific roof layout.
                  </p>
                  
                  <div className="bg-[#26282F] p-4 lg:p-6 rounded-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <ArrowRightLeft className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Net metering enabled</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Every unit you generate offsets your bill; surplus exports earn credits.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Layers className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Multi-MPPT architecture</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Handles complex rooftops with different orientations or partial shading.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Cloud className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Real-time cloud monitoring</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">You can see your plant's output from your phone, any time.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Maximize className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Range</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">10 kW to 350 kW — scalable for any C&I project size.</p>
                        </div>
                      </li>
                    </ul>
                    <div className="mt-4 px-4 pt-6 border-t border-gray-700">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Suppliers</span>
                      <p className="text-white font-medium mt-1">GoodWe, Sungrow, etc.</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Hybrid */}
            <div className="flex flex-col lg:flex-row items-start relative border-t border-gray-100 py-12 lg:py-16">
              <div className="lg:w-1/2 lg:sticky lg:top-32 lg:pr-16 mb-12 lg:mb-0 flex justify-center lg:justify-start">
                <div className="w-full max-w-[540px] aspect-[3/4] relative rounded-sm overflow-hidden shadow-xl">
                  <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_071446_2f44cbeb-cee0-4a08-855e-b4835004383c.png&w=1920&q=85" alt="Hybrid Inverter" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-8 lg:min-h-[80vh] flex flex-col justify-center">
                <FadeIn>
                  <h3 className="text-4xl font-display font-bold text-dark mb-6">Hybrid Inverters</h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                    For businesses that can't afford to stop when the grid does. A hybrid inverter combines solar conversion with battery management in one unit. During the day, it charges your batteries from surplus solar. When the grid cuts out — or when peak tariffs make drawing from the grid expensive — it switches to battery power automatically, in under 20 milliseconds.
                  </p>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                    If your manufacturing process is sensitive to power interruptions, or if you're in a region with frequent outages, a hybrid system is the architecture that protects your operations while still delivering strong energy savings.
                  </p>
                  
                  <div className="bg-[#26282F] p-4 lg:p-6 rounded-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Timer className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Backup in under 20ms</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Production equipment is protected before it even registers a fault.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <TrendingDown className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Peak shaving</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Draw from batteries during expensive peak tariff windows; charge during off-peak.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Zero-export mode</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Compliant with DISCOM restrictions in areas where export is not permitted.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Battery className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Range</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">5 kW to 33 kW per unit, stackable for higher loads.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </FadeIn>
              </div>
            </div>

            {/* Microinverters */}
            <div className="flex flex-col lg:flex-row items-start relative border-t border-gray-100 py-12 lg:py-16">
              <div className="lg:w-1/2 lg:sticky lg:top-32 lg:pr-16 mb-12 lg:mb-0 flex justify-center lg:justify-start">
                <div className="w-full max-w-[540px] aspect-[3/4] relative rounded-sm overflow-hidden shadow-xl">
                  <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_071453_3bbdc4fd-8ff2-415c-8a59-a3ccb44a1efa.png&w=1920&q=85" alt="Microinverters" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-8 lg:min-h-[80vh] flex flex-col justify-center">
                <FadeIn>
                  <h3 className="text-4xl font-display font-bold text-dark mb-6">Microinverters</h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                    On a complex industrial rooftop — one with parapets, water tanks, ducts, or panels facing multiple directions — a standard string inverter loses output every time shade hits one module. Microinverters eliminate that problem entirely by converting DC to AC at each individual panel. One shaded panel affects only itself.
                  </p>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                    We recommend microinverters for C&I sites where rooftop geometry is complex, where maximum yield from every panel matters, and where per-panel monitoring provides operational value. The result is consistently 8–20% more annual generation than a string system on the same roof.
                  </p>
                  
                  <div className="bg-[#26282F] p-4 lg:p-6 rounded-sm">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <LayoutGrid className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Panel-level independence</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Shade, soiling, or a fault on one panel doesn't touch the rest.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Activity className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">Granular monitoring</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">See the output of every individual panel — identify issues immediately.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <ZapOff className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">No high-voltage DC on the roof</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">Safer installation, simpler electrical compliance.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 p-4 rounded-sm">
                        <Award className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">25-year product warranty</h4>
                          <p className="text-gray-300 text-sm leading-relaxed">On leading models — aligned with your plant's lifetime.</p>
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

      {/* Manufacturers */}
      <section className="py-24 lg:py-32 relative z-10 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <FadeIn className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 tracking-tight">Inverter brands we commission</h2>
            <p className="text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
              We commission inverters from the world's leading manufacturers, each selected for their performance in Indian grid and climate conditions and their ability to support long-term C&I operations.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-6 border-b-2 border-gray-200 font-bold text-dark text-lg bg-gray-50">Brand</th>
                    <th className="p-6 border-b-2 border-primary font-bold text-dark text-lg bg-gray-50">What We Source</th>
                    <th className="p-6 border-b-2 border-gray-800 font-bold text-dark text-lg bg-gray-50">Why It Matters for Your Project</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-light">
                  {[
                    { brand: "GoodWe", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoJEjyzy2dkiRtvuDzVdQAhr2bK80p6Y2I1w&s", source: "On-grid: 10–350 kW (SDT, GT, SMT, UT Series)", why: "Widest C&I model range; SEMS cloud platform; extensively deployed in Indian industrial projects" },
                    { brand: "Sungrow", logo: "https://i0.wp.com/solarquarter.com/wp-content/uploads/2022/04/Sungrow-Logo-FINAL.jpeg?fit=10833%2C4213&ssl=1", source: "On-grid: 3–350 kW (SG String Series)", why: "Global #1 by shipments; excellent grid fault ride-through; strong Indian service network" },
                    { brand: "Deye", logo: "https://cdn.enfsolar.com/z/s/logos/461606539b3250b2.png?v=1", source: "On-grid & hybrid: 30–110 kW", why: "Competitive performance on large C&I projects; reliable hybrid with LiFePO4 battery support" },
                    { brand: "SolarEdge", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SolarEdge_logo.svg", source: "On-grid, hybrid & optimisers: 5–100 kW", why: "DC-optimised architecture with module-level monitoring; our recommendation for complex C&I rooftops" },
                    { brand: "Growatt", logo: "https://www.vrmenergy.com/img/product/growatt.png", source: "On-grid & hybrid: 3–80 kW", why: "Strong value on mid-size commercial projects; global spares and service network" },
                    { brand: "Enphase", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiIrV9hRKpAkzgMpJz8RjuUU7I7QxeGkECCw&s", source: "Microinverters: IQ8 Series", why: "World's #1 microinverter brand; 25-year product warranty; IQ8 provides sunlight backup without batteries" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="p-6 font-bold text-dark whitespace-nowrap">
                        <img 
                          src={row.logo} 
                          alt={row.brand} 
                          className="h-8 w-auto object-contain" 
                        />
                      </td>
                      <td className="p-6">{row.source}</td>
                      <td className="p-6">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 relative z-10 overflow-hidden bg-dark">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260401_071506_828025f2-66ee-4769-8330-aea2b369c75b.png&w=1920&q=85" alt="Solar installation" className="w-full h-full object-cover" />
        </div>
        
        {/* Gradient Overlay (Lime green fading to dark) */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-dark/80 to-dark" />
        
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight">
              Let's design the right inverter architecture for your plant.
            </h2>
            <p className="text-xl text-gray-300 font-light mb-10 max-w-2xl mx-auto">
              We model your load profile before we recommend anything.
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
