import React, { useEffect, useRef, ReactNode, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useInView, animate } from 'motion/react';
import { ArrowRight, Target, Eye, Users, Briefcase, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Reusable Animation Components ---
const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string, key?: React.Key }) => (
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

export default function About() {
  const [activeStat, setActiveStat] = useState(0);
  const [activeValue, setActiveValue] = useState(0);

  const stats = [
    { value: 12, suffix: "+", label: "MW Installed", img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop" },
    { value: 30, suffix: "+", label: "Indian Cities Served", img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" },
    { value: 100, suffix: "+ Cr", label: "Saved for Indian Businesses", img: "https://images.unsplash.com/photo-1508514177221-188b1c77eca2?q=80&w=1000&auto=format&fit=crop" },
    { value: 100, suffix: "+ C&I", label: "Sites Executed", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop" },
    { value: null, text: "India's #1", label: "Commercial & Industrial Solar Company", img: "https://images.unsplash.com/photo-1504333638930-c8787321fee0?q=80&w=1000&auto=format&fit=crop" }
  ];

  const values = [
    { letter: "S", title: "Safety", desc: "We put the safety of our employees, partners, customers, and the communities around our sites above all else. Every decision and process begins with protecting people and environments." },
    { letter: "O", title: "Ownership", desc: "We encourage our people to take ownership of their work, their decisions, and their impact—supporting accountability while empowering teams to do the right thing." },
    { letter: "L", title: "Long-Term Thinking", desc: "We make decisions that consider employees' well-being, customer outcomes, and community impact—focusing on sustainable progress rather than short-term gains." },
    { letter: "I", title: "Integrity", desc: "We operate with transparency and honesty in every interaction. We build trust by delivering on our promises and maintaining the highest ethical standards." },
    { letter: "D", title: "Discipline", desc: "We execute with precision and consistency. Our rigorous approach to engineering, project management, and operations ensures reliable performance." }
  ];

  return (
    <div className="bg-white pt-20 pb-0 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] mb-24">
        <img 
          src="https://images.unsplash.com/photo-1504333638930-c8787321fee0?q=80&w=2000&auto=format&fit=crop" 
          alt="PowerMore Engineers" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="bg-primary inline-block px-6 py-3 mb-6">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-dark">
                About Us
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white font-medium max-w-3xl leading-relaxed">
              PowerMore engineers solar energy systems for India's businesses.<br className="hidden md:block" />
              We design, build, and deliver high-performance solar solutions<br className="hidden md:block" />
              so you can focus on your business, while we power it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Vision */}
          <FadeIn delay={0.1} className="flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark">Our Vision</h2>
              <div className="text-primary text-4xl font-light">+</div>
            </div>
            <p className="text-lg text-gray-700 font-medium leading-relaxed mb-8">
              To help Indian businesses take control of their power infrastructure and turn energy into a long-term financial advantage.
            </p>
            <div className="mt-auto aspect-[16/9] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1508514177221-188b1c77eca2?q=80&w=1200&auto=format&fit=crop" 
                alt="Solar Vision" 
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          {/* Mission */}
          <FadeIn delay={0.2} className="flex flex-col">
            <div className="aspect-[16/9] overflow-hidden mb-8">
              <img 
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop" 
                alt="Solar Mission" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4 mt-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-dark">Our Mission</h2>
              <div className="text-primary text-4xl font-light">+</div>
            </div>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              To be the subcontinent's most trusted partner for clean energy infrastructure, setting the benchmark for engineering excellence, ALMM compliance, and operational performance in the solar industry.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Our Goal */}
      <section className="relative py-32 mb-32">
        <img 
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2000&auto=format&fit=crop" 
          alt="Solar Engineer" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="md:w-1/2">
            <FadeIn>
              <div className="bg-white p-10 md:p-14 shadow-sm border-t-4 border-primary">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-dark mb-8">Our Goal</h2>
                <p className="text-lg text-gray-700 font-medium leading-relaxed mb-6">
                  PowerMore engineers solar energy systems for India's businesses. We design, build, and deliver high-performance solar solutions—so you can focus on your business, while we power it.
                </p>
                <p className="text-lg text-gray-700 font-medium leading-relaxed">
                  Make solar energy adoption effortless—so businesses pay less for power, gain energy independence, and never think about their solar system again.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Left Column - Stats */}
          <div className="md:w-1/2 flex flex-col gap-4 relative">
             {/* Vertical dashed line */}
             <div className="absolute left-0 top-0 bottom-0 w-px border-l border-dashed border-gray-400 hidden md:block" />
             
             {stats.map((stat, idx) => (
               <React.Fragment key={idx}>
                 {idx > 0 && <div className={`absolute left-[-6px] w-3 h-px bg-dark hidden md:block`} style={{ top: `${(idx / stats.length) * 100}%` }} />}
                 <FadeIn delay={0.1 * (idx + 1)}>
                   <div 
                     className={`p-8 flex flex-col justify-center border border-gray-200 md:ml-8 cursor-pointer transition-colors duration-300 ${activeStat === idx ? 'bg-primary' : 'bg-white hover:bg-gray-50'}`}
                     onClick={() => setActiveStat(idx)}
                   >
                     <div className="text-5xl md:text-6xl font-display font-bold text-dark mb-2">
                       {stat.value !== null ? <AnimatedNumber value={stat.value} suffix={stat.suffix} /> : stat.text}
                     </div>
                     <div className={`text-xl font-medium ${activeStat === idx ? 'text-dark' : 'text-gray-600'}`}>{stat.label}</div>
                   </div>
                 </FadeIn>
               </React.Fragment>
             ))}
          </div>
          
          {/* Right Column - Image */}
          <div className="md:w-1/2 relative min-h-[500px]">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeStat === idx ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                style={{ pointerEvents: activeStat === idx ? 'auto' : 'none' }}
              >
                <img 
                  src={stat.img} 
                  alt={stat.label} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <FadeIn>
              <div className="bg-dark text-primary inline-block px-6 py-3 mb-6">
                <h2 className="text-3xl font-display font-bold">Our Philosophy</h2>
              </div>
              <p className="text-lg text-gray-700 font-medium leading-relaxed mb-8">
                PowerMore was founded with a simple belief: power infrastructure for businesses should be predictable, scalable, and financially sound
              </p>
              <div className="aspect-[4/3] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop" alt="Solar Engineering" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          </div>
          <div className="lg:w-2/3">
            <div className="flex flex-col gap-4 mb-12">
              {[
                "More control over how power is generated.",
                "More predictability in energy costs.",
                "More reliability in daily operations.",
                "More returns from long-term investments."
              ].map((text, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="bg-white hover:bg-black hover:text-primary transition-colors duration-300 border border-gray-300 p-4 text-lg text-dark font-medium">
                    {text}
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.4}>
              <div className="prose prose-lg text-gray-700 font-medium max-w-none">
                <p className="mb-6">
                  For commercial and industrial operations, power is not a background utility—it directly affects uptime, margins, and growth. PowerMore exists to help businesses move from passive energy consumption to active power control.
                </p>
                <p className="mb-6">
                  We focus on creating on-site power systems that integrate seamlessly into operations, align with financial objectives, and perform consistently over time. Every project is approached with clarity—designed to reduce uncertainty, improve cost visibility, and support scale.
                </p>
                <p className="font-bold text-dark">
                  PowerMore is not about adding complexity. It's about enabling businesses to operate with confidence—powered by systems that deliver more value, every day.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="relative py-24 mb-32">
        <img 
          src="https://images.unsplash.com/photo-1508514177221-188b1c77eca2?q=80&w=2000&auto=format&fit=crop" 
          alt="Our Values Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Column */}
            <div className="lg:w-1/3 flex flex-col relative">
              <FadeIn>
                <div className="bg-[#141414] inline-block px-8 py-4 mb-8">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-primary">Our Values</h2>
                </div>
                <p className="text-lg text-white font-medium leading-relaxed mb-6">
                  Our values define who we are and guide how we work—every day and across every part of our operations.
                </p>
                <p className="text-lg text-white font-medium leading-relaxed">
                  Grounded in <span className="font-bold">SOLID</span> principles, we focus on doing what is right for our employees, our customers, and the communities we serve.
                </p>
              </FadeIn>
              {/* Vertical dotted line */}
              <div className="hidden lg:block absolute right-[-2rem] top-0 bottom-0 w-px border-r border-dotted border-gray-500" />
            </div>

            {/* Right Column */}
            <div className="lg:w-2/3 flex flex-col gap-2">
              {values.map((val, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div 
                    className="flex items-stretch gap-1 group cursor-pointer"
                    onMouseEnter={() => setActiveValue(idx)}
                  >
                    {/* Letter Box */}
                    <div className={`w-16 md:w-24 flex items-center justify-center shrink-0 transition-colors duration-300 ${activeValue === idx ? 'bg-black' : 'bg-[#141414]'}`}>
                      <span className="text-3xl md:text-4xl font-display font-bold text-primary">{val.letter}</span>
                    </div>
                    {/* Content Box */}
                    <div className={`flex-1 p-6 border transition-all duration-300 ${activeValue === idx ? 'bg-white/10 border-primary' : 'bg-[#141414]/80 border-white/10'}`}>
                      <h4 className="text-2xl font-bold text-white mb-2">{val.title}</h4>
                      <p className="text-gray-300 font-medium leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founders */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <FadeIn>
          <div className="bg-primary text-dark inline-block px-6 py-3 mb-12">
            <h2 className="text-3xl font-display font-bold">Meet the Founders</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              name: "Annu Talreja", 
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", 
              desc: "Founder@Accacia.ai | 2X Founder - exited @Oxfordcaps | INSEAD | BW 40 Under 40" 
            },
            { 
              name: "Piyush Chitkara", 
              img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop", 
              desc: "Co-Founder & CTO, Accacia | ET Young Achiever & Forbes Asia 100 Honoree | Driving Real Estate Decarbonization with AI | Ex-Cisco & Rakuten" 
            }
          ].map((founder, idx) => (
            <FadeIn key={idx} delay={idx * 0.2}>
              <div className="relative aspect-[3/4] overflow-hidden group bg-dark">
                <img src={founder.img} alt={founder.name} className="w-full h-full object-cover grayscale opacity-80" />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-dark via-dark/80 to-transparent">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-primary text-dark px-4 py-1 font-bold text-xl">
                      {founder.name}
                    </div>
                    <a href="#" className="flex items-center gap-1 text-white border border-white/30 px-3 py-1 text-xs hover:bg-white/10 transition-colors">
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </a>
                  </div>
                  <p className="text-sm text-white font-light leading-relaxed">
                    {founder.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Meet the team */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <FadeIn>
          <div className="bg-dark text-primary inline-block px-6 py-3 mb-6">
            <h2 className="text-3xl font-display font-bold">Meet the team</h2>
          </div>
          <p className="text-lg text-gray-700 font-medium max-w-4xl mb-12 leading-relaxed">
            Behind every project is a cross-functional team of engineers, project managers, site supervisors, and operations professionals. Our teams work on-ground, across regions, ensuring each project meets technical, operational, and commercial expectations.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Harshit Tomar", role: "Design Manager", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
            { name: "Sneha Bansal", role: "Sales Manager", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
            { name: "Harshit Tomar", role: "Marketing Manager", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
            { name: "Harshit Tomar", role: "Human Resources", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop" },
            { name: "Harshit Tomar", role: "UI UX", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" },
            { name: "Harshit Tomar", role: "Product Manager", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" },
            { name: "Harshit Tomar", role: "SaaS Head", img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=400&auto=format&fit=crop" },
            { name: "Harshit Tomar", role: "Admin Support", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" }
          ].map((member, idx) => (
            <FadeIn key={idx} delay={idx * 0.05}>
              <div className="group relative aspect-square bg-dark overflow-hidden">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark to-transparent">
                  <h4 className="text-base font-bold text-primary mb-0">{member.name}</h4>
                  <p className="text-white text-xs font-light">{member.role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Careers CTA */}
      <section className="bg-dark text-white py-0 mb-32 overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="md:w-1/2 p-12 md:p-24 flex flex-col justify-center border-r border-white/10">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
                Where You Power More<br />
                and <span className="text-primary">Grow More</span>
              </h2>
              <p className="text-base text-gray-300 font-light leading-relaxed mb-6">
                At PowerMore, you'll work on real projects that impact how businesses operate every day. From engineering and project execution to operations and support, we value people who take ownership, think long-term, and execute with discipline.
              </p>
              <p className="text-base text-gray-300 font-light leading-relaxed mb-10">
                If you're looking to build expertise in large-scale solar and infrastructure delivery, we'd like to hear from you.
              </p>
              <Link to="/careers" className="inline-block px-10 py-3 text-lg font-bold text-dark bg-primary hover:bg-[#b3e600] transition-colors w-fit">
                Join Us
              </Link>
            </FadeIn>
          </div>
          <div className="md:w-1/2 min-h-[400px]">
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" alt="Team working" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-24">
        <FadeIn>
          <h2 className="text-3xl font-display font-bold text-dark mb-12">Related Resources</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/newsroom" className="inline-flex items-center gap-2 px-8 py-4 border border-dark text-dark hover:bg-dark hover:text-white transition-colors font-medium text-lg">
              In News <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/case-studies" className="inline-flex items-center gap-2 px-8 py-4 border border-dark text-dark hover:bg-dark hover:text-white transition-colors font-medium text-lg">
              Case Studies <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/blogs" className="inline-flex items-center gap-2 px-8 py-4 border border-dark text-dark hover:bg-dark hover:text-white transition-colors font-medium text-lg">
              Blogs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
