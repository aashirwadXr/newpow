import { motion } from 'motion/react';
import { ArrowRight, Briefcase, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Careers() {
  return (
    <div className="bg-white pt-32 pb-24 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/10 text-dark font-medium text-sm mb-8 border border-primary/20">
            Careers at PowerMore
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-bold text-dark leading-[0.9] tracking-tight mb-8">
            Build the <br />
            <span className="text-gray-400">Clean Future.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl text-balance">
            Join a team of passionate engineers, innovators, and sustainability advocates working to power India's industrial growth with renewable energy.
          </p>
        </motion.div>
      </section>

      {/* Why Join Us */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Zap className="w-8 h-8 text-primary" />,
              title: "Impactful Work",
              desc: "Every project you touch directly reduces carbon emissions and helps Indian industries become more sustainable."
            },
            {
              icon: <Users className="w-8 h-8 text-primary" />,
              title: "Collaborative Culture",
              desc: "Work alongside industry veterans in a flat, open environment that values innovation and continuous learning."
            },
            {
              icon: <Briefcase className="w-8 h-8 text-primary" />,
              title: "Rapid Growth",
              desc: "As one of India's fastest-growing solar EPCs, we offer unparalleled opportunities for career advancement."
            }
          ].map((perk, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 rounded-sm p-8 lg:p-12 border border-gray-100 flex flex-col"
            >
              <div className="w-16 h-16 rounded-sm bg-white flex items-center justify-center mb-8 shadow-sm">
                {perk.icon}
              </div>
              <h3 className="text-3xl font-display font-bold text-dark mb-4">{perk.title}</h3>
              <p className="text-gray-600 leading-relaxed flex-grow">{perk.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <h2 className="text-5xl lg:text-7xl font-display font-bold text-dark mb-12 tracking-tight">Open Positions</h2>
        <div className="flex flex-col gap-4">
          
          {[
            {
              role: "Senior Solar Design Engineer",
              dept: "Engineering",
              location: "Pune, Maharashtra",
              type: "Full-Time"
            },
            {
              role: "Project Manager (C&I Solar)",
              dept: "Operations",
              location: "Ahmedabad, Gujarat",
              type: "Full-Time"
            },
            {
              role: "Business Development Executive",
              dept: "Sales",
              location: "Bengaluru, Karnataka",
              type: "Full-Time"
            },
            {
              role: "O&M Technician",
              dept: "Service",
              location: "Multiple Locations",
              type: "Full-Time"
            }
          ].map((job, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50 rounded-sm p-8 lg:p-10 border border-gray-100 hover:border-primary/30 hover:bg-white transition-all group"
            >
              <div>
                <h3 className="text-3xl font-display font-bold text-dark mb-4 group-hover:text-primary transition-colors">{job.role}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                  <span className="px-4 py-2 bg-white border border-gray-100 rounded-sm shadow-sm">{job.dept}</span>
                  <span className="px-4 py-2 bg-white border border-gray-100 rounded-sm shadow-sm">{job.location}</span>
                  <span className="px-4 py-2 bg-white border border-gray-100 rounded-sm shadow-sm">{job.type}</span>
                </div>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white rounded-sm font-medium hover:bg-primary hover:text-dark transition-colors whitespace-nowrap">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}

        </div>
      </section>
    </div>
  );
}
