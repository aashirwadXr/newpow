import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Zap, Shield, BarChart3, Sun, Factory, Leaf, Quote, CheckCircle2, Calculator, Building2, MapPin, IndianRupee, Grid3X3, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "../lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function DesignedForPerformanceFeatures() {
  const features = [
    {
      title: "High-Efficiency 720 Wp Panels",
      description: "Maximum generation per square foot. More output from the same roof.",
      icon: <Sun className="w-8 h-8 text-gray-800 group-hover/feature:text-primary group-hover/feature:scale-110 transition-all duration-300" />,
    },
    {
      title: "Strong Engineering Standards",
      description: "Designed for heavy-load commercial and industrial use.",
      icon: <Shield className="w-8 h-8 text-gray-800 group-hover/feature:text-primary group-hover/feature:scale-110 transition-all duration-300" />,
    },
    {
      title: "Complete System Installation",
      description: "From planning to final system activation — handled by our team.",
      icon: <Settings className="w-8 h-8 text-gray-800 group-hover/feature:text-primary group-hover/feature:scale-110 transition-all duration-300" />,
    },
    {
      title: "Hybrid & On-Grid Systems",
      description: "Flexible system options based on your power needs.",
      icon: <Zap className="w-8 h-8 text-gray-800 group-hover/feature:text-primary group-hover/feature:scale-110 transition-all duration-300" />,
    },
    {
      title: "Smooth Net Metering Support",
      description: "We handle approvals and utility coordination.",
      icon: <FileText className="w-8 h-8 text-gray-800 group-hover/feature:text-primary group-hover/feature:scale-110 transition-all duration-300" />,
    },
    {
      title: "Loan & Financing Assistance",
      description: "Structured financing support to make installation easier.",
      icon: <IndianRupee className="w-8 h-8 text-gray-800 group-hover/feature:text-primary group-hover/feature:scale-110 transition-all duration-300" />,
    },
  ];
  return (
    <div className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary text-dark font-bold px-3 py-1 rounded-[2px] text-sm mb-4">
            Designed for Performance
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark tracking-tight">
            Why Businesses Choose PowerMore Solar
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Feature: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}> = ({
  title,
  description,
  icon,
  index,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-gray-200 hover:bg-black transition-colors duration-300",
        (index === 0 || index === 3) && "lg:border-l",
        index < 3 && "lg:border-b"
      )}
    >
      <div className="mb-4 relative z-10 px-10 text-neutral-600 group-hover/feature:text-primary transition-colors duration-300">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-200 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-dark group-hover/feature:text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-600 group-hover/feature:text-gray-400 max-w-xs relative z-10 px-10 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};

const projects = [
  {
    size: "750 kWp",
    industry: "Manufacturing",
    title: "Manufacturing Factory",
    desc: "A comprehensive rooftop solar deployment designed to sustain high-demand heavy machinery operations 24/7, significantly reducing dependence on grid power while optimizing operational overhead.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"
  },
  {
    size: "1.2 MWp",
    industry: "Logistics",
    title: "Logistics Warehouse",
    desc: "Large-scale solar installation spanning multiple warehouse blocks, implementing smart energy management to power automated sorting systems and cross-docking operations with zero carbon footprint.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8ed7c50a63?q=80&w=1200&auto=format&fit=crop"
  },
  {
    size: "500 kWp",
    industry: "Commercial",
    title: "Commercial Spaces",
    desc: "Intelligent solar grid integration for a premium office complex, achieving 100% renewable energy uptime for mission-critical systems and enhancing the facility's sustainability rating to Platinum.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
  },
  {
    size: "350 kWp",
    industry: "Hospitality",
    title: "Hospitality Hotels",
    desc: "Custom ground-mounted solar farm designed for minimal environmental impact, providing consistent clean energy to auxiliary facilities and guest villas while promoting eco-tourism excellence.",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
  },
  {
    size: "2.5 MWp",
    industry: "Data Infrastructure",
    title: "Data Infra & Data Centres",
    desc: "High-redundancy solar array protecting sensitive data processing units, ensuring power stability and reducing PUE through direct renewable energy injection into the cooling infrastructure.",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop"
  }
];

function OurSolarProjectsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-dark font-medium text-sm mb-6 border border-primary/30 uppercase tracking-widest">
            Project Portfolio
          </div>
          <h2 className="text-5xl lg:text-6xl font-display font-bold text-dark mb-4 tracking-tight">
            Our Solar Projects
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Commitment to a sustainable future through clean, renewable energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500">
              <img 
                src={project.img} 
                alt={project.industry} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">
                  {project.size}
                </h3>
                <h4 className="text-lg font-bold text-primary mb-3">
                  {project.industry}
                </h4>
                <p className="text-sm text-gray-200 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                  {project.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [heroCalc, setHeroCalc] = useState({ type: 'Industrial/commercial', bill: '10,000 to 50,000' });
  
  const [detailedCalc, setDetailedCalc] = useState({
    type: 'Industrial/commercial',
    bill: 100000,
    space: 5000,
    city: 'Maharashtra'
  });

  // Simple calculation logic for detailed calculator
  const systemSize = Math.max(1, Math.round(detailedCalc.bill / 1000)); // rough estimate: 1kW per 1000 Rs bill
  const annualSavings = systemSize * 1000 * 12; // rough estimate
  const payback = 3.5;
  const adPayback = 2.8;

  const chartData = Array.from({ length: 15 }, (_, i) => {
    const year = i + 1;
    const cumulativeSavings = annualSavings * year;
    return {
      year: `Yr ${year}`,
      savings: Number((cumulativeSavings / 100000).toFixed(2)) // in Lakhs
    };
  });

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden min-h-screen flex items-center">
        {/* Background Image & Texture */}
        <div className="absolute inset-0 z-0 bg-[#f8f9fa]">
          {/* Solar Panel Texture */}
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h120M0 30h120M0 90h120M0 0v120M30 0v120M90 0v120' fill='none' stroke='%23000' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M0 60h120M60 0v120' fill='none' stroke='%23000' stroke-width='0.5' opacity='0.8'/%3E%3Cpath d='M56 60h8M60 56v8' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Copy and Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <div className="mb-6">
                <div className="inline-block bg-primary text-dark font-bold px-3 py-1 rounded-[2px] text-sm mb-6">
                  India's #1
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-dark leading-[1.1] tracking-tight uppercase">
                  SOLAR PARTNER FOR<br />BUSINESSES
                </h1>
              </div>
              <p className="text-lg lg:text-xl text-gray-700 font-medium mb-10">
                Seamless Integration | End-to-End Service |<br />Industrial-Grade Quality
              </p>

              {/* Hero Calculator */}
              <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary p-1.5 rounded-[2px]">
                    <Calculator className="w-5 h-5 text-dark" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-dark">ROI Solar Calculator</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">Discover your potential savings in seconds.</p>
                
                <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-dark uppercase tracking-wider">Who are you?</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 rounded-[2px] border border-gray-200 focus:outline-none focus:border-gray-300 bg-white text-dark text-sm appearance-none"
                        value={heroCalc.type}
                        onChange={(e) => setHeroCalc({...heroCalc, type: e.target.value})}
                      >
                        <option>Industrial/commercial</option>
                        <option>Hotels</option>
                        <option>Hospitals</option>
                        <option>Schools</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-dark uppercase tracking-wider">Electricity bill (Monthly)</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 rounded-[2px] border border-gray-200 focus:outline-none focus:border-gray-300 bg-white text-dark text-sm appearance-none"
                        value={heroCalc.bill}
                        onChange={(e) => setHeroCalc({...heroCalc, bill: e.target.value})}
                      >
                        <option>₹1,00,000 - ₹5,00,000</option>
                        <option>₹5,00,000 - ₹10,00,000</option>
                        <option>₹10,00,000 - ₹25,00,000</option>
                        <option>₹25,00,000+</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('detailed-calculator');
                      if(el) el.scrollIntoView({behavior: 'smooth'});
                    }}
                    className="mt-2 w-full bg-black text-primary font-bold py-4 rounded-[2px] hover:bg-gray-900 transition-colors text-sm uppercase tracking-wider"
                  >
                    Know your savings
                  </button>
                </form>
              </div>
            </motion.div>
            
            {/* Right Side: Isometric Image */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex justify-center items-center"
            >
              <img 
                src="https://i.ibb.co/pvFkt2Jm/Home-Page-Image.png" 
                alt="Solar Energy Isometric" 
                className="w-full max-w-2xl object-contain mix-blend-multiply opacity-90"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section className="py-12 border-y border-gray-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Trusted By</h3>
        </div>
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-16 px-8"
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 text-2xl font-display font-bold text-gray-300 uppercase tracking-widest">
                <span>Waaree</span>
                <span className="w-2 h-2 rounded-sm bg-primary" />
                <span>Tata Steel</span>
                <span className="w-2 h-2 rounded-sm bg-primary" />
                <span>Sungrow</span>
                <span className="w-2 h-2 rounded-sm bg-primary" />
                <span>Luminous</span>
                <span className="w-2 h-2 rounded-sm bg-primary" />
                <span>Schneider</span>
                <span className="w-2 h-2 rounded-sm bg-primary" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Impact / Projects */}
      <section className="relative py-24 bg-dark text-white overflow-hidden">
        {/* Solar Panel Texture */}
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h120M0 30h120M0 90h120M0 0v120M30 0v120M90 0v120' fill='none' stroke='%23fff' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M0 60h120M60 0v120' fill='none' stroke='%23fff' stroke-width='0.5' opacity='0.8'/%3E%3Cpath d='M56 60h8M60 56v8' fill='none' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary text-dark font-bold px-3 py-1 rounded-[2px] text-sm mb-4">
              Across Industries. Across India.
            </div>
            <h2 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6">Our Solar Projects</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Accelerating India's shift to SOLAR energy adoption.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "12.4 MW+", label: "Solar Capacity Installed", icon: Sun },
              { value: "8.9 GWh", label: "Clean Energy Generated", icon: Zap },
              { value: "15,500+", label: "Tonnes CO₂ Offset", icon: Leaf },
              { value: "99%+", label: "Average Plant Uptime", icon: Factory }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-sm border border-white/20 shadow-xl text-center cursor-pointer hover:bg-white/15 hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/20 rounded-full text-primary">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-4xl lg:text-5xl font-display font-bold text-primary mb-4">{stat.value}</div>
                  <div className="text-gray-300 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed ROI Calculator */}
      <section id="detailed-calculator" className="relative py-24 bg-gray-50 overflow-hidden">
        {/* Solar Panel Texture */}
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h120M0 30h120M0 90h120M0 0v120M30 0v120M90 0v120' fill='none' stroke='%23000' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M0 60h120M60 0v120' fill='none' stroke='%23000' stroke-width='0.5' opacity='0.8'/%3E%3Cpath d='M56 60h8M60 56v8' fill='none' stroke='%23000' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }}></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-dark font-medium text-sm mb-6 border border-primary">
              Detailed ROI Calculator
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6">
              Find Out How Much Your Business <br className="hidden lg:block" />
              Can Save with Solar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter a few details and see your estimated savings instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-sm shadow-xl border border-gray-200 overflow-hidden">
            {/* Form */}
            <div className="flex flex-col gap-8 p-8 lg:p-12 border-r border-gray-100">
              <h3 className="text-2xl font-display font-bold text-dark text-center uppercase tracking-wide">Solar Savings Estimator</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Who are you?</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <select 
                      className="pl-12 pr-4 py-3 w-full rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-gray-50 text-lg appearance-none"
                      value={detailedCalc.type}
                      onChange={(e) => setDetailedCalc({...detailedCalc, type: e.target.value})}
                    >
                      <option>Industrial/commercial</option>
                      <option>Hotels</option>
                      <option>Hospitals</option>
                      <option>Schools</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Monthly Electricity Bill (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      className="pl-12 pr-4 py-3 w-full rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-gray-50 text-lg"
                      value={detailedCalc.bill}
                      onChange={(e) => setDetailedCalc({...detailedCalc, bill: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Rooftop Space (Sq.ft)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Grid3X3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      className="pl-12 pr-4 py-3 w-full rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-gray-50 text-lg"
                      value={detailedCalc.space}
                      onChange={(e) => setDetailedCalc({...detailedCalc, space: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">City / State</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select 
                      className="pl-12 pr-4 py-3 w-full rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-gray-50 text-lg appearance-none"
                      value={detailedCalc.city}
                      onChange={(e) => setDetailedCalc({...detailedCalc, city: e.target.value})}
                    >
                      {states.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                </div>
                <a 
                  href={`https://wa.me/919876543210?text=Hi, I want to know my solar savings. My monthly bill is ₹${detailedCalc.bill} and I have ${detailedCalc.space} sq.ft space in ${detailedCalc.city}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-sm font-bold hover:bg-[#128C7E] transition-colors w-full text-lg shadow-lg hover:shadow-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get this on Whatsapp
                </a>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center bg-gray-50/50 p-8 lg:p-12">
              <h3 className="text-2xl font-display font-bold text-dark mb-8 text-center uppercase tracking-wide">Your Estimated Results</h3>
              
              <div className="text-center mb-4">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">15-Year Cumulative Savings</h4>
              </div>

              {/* 15-Year Savings Graph */}
              <div className="w-full h-64 mb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}L`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '2px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`₹${value} Lakhs`, 'Cumulative Savings']}
                      cursor={{fill: '#f3f4f6'}}
                    />
                    <Bar 
                      dataKey="savings" 
                      fill="#22c55e" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Estimated System Size</div>
                  <div className="text-3xl font-display font-bold text-dark">{systemSize} kWp</div>
                </div>
                <div className="bg-[#f7fee7] p-5 rounded-sm border border-[#bef264] shadow-sm flex flex-col justify-between">
                  <div className="text-xs text-[#4d7c0f] font-bold uppercase tracking-wider mb-2">Annual Savings</div>
                  <div className="text-3xl font-display font-bold text-dark">₹{(annualSavings / 100000).toFixed(2)} Lakhs</div>
                </div>
                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">Standard Payback</div>
                  <div className="text-3xl font-display font-bold text-dark">{payback} Years</div>
                </div>
                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">With AD Benefits</div>
                  <div className="text-3xl font-display font-bold text-dark">{adPayback} Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section 1 */}
      <section className="py-24 bg-primary text-dark text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-8">Ready to power your business with Solar?</h2>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-dark text-white rounded-sm font-bold text-lg hover:bg-gray-800 transition-colors">
            Get a Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Designed for Performance */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <DesignedForPerformanceFeatures />
          <div className="mt-16 text-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-dark text-white rounded-sm font-bold text-lg hover:bg-primary hover:text-dark transition-colors border border-dark">
              Power your Business with Solar <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Solar Projects */}
      <OurSolarProjectsSection />
    </div>
  );
}
