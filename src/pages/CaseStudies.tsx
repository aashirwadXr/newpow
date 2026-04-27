import { motion } from 'motion/react';
import { ArrowRight, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CaseStudies() {
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
            Case Studies
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-bold text-dark leading-[0.9] tracking-tight mb-8">
            Proven <br />
            <span className="text-gray-400">Performance.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl text-balance">
            Explore how we've helped Indian industries drastically cut energy costs and achieve their sustainability goals.
          </p>
        </motion.div>
      </section>

      {/* Case Studies Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="flex flex-col gap-16">
          
          {[
            {
              title: "5MW Ground Mount for Rathore Steel",
              category: "Utility Scale",
              stats: [
                { label: "Annual Savings", value: "₹4.2 Cr" },
                { label: "Carbon Offset", value: "6,500 Tons" },
                { label: "Payback Period", value: "3.2 Years" }
              ],
              desc: "Rathore Steel needed a massive energy offset for their energy-intensive foundry. We designed and executed a 5MW ground-mount solar park on unused land adjacent to their facility, completing the project 3 weeks ahead of schedule.",
              img: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=1200&auto=format&fit=crop"
            },
            {
              title: "1.2MW Rooftop for Desai Textiles",
              category: "Industrial Rooftop",
              stats: [
                { label: "Annual Savings", value: "₹1.1 Cr" },
                { label: "Carbon Offset", value: "1,800 Tons" },
                { label: "Payback Period", value: "2.8 Years" }
              ],
              desc: "Faced with rising grid tariffs, Desai Textiles partnered with PowerMore to utilize their expansive factory roof. We deployed lightweight, ALMM-compliant monocrystalline panels with zero roof penetration.",
              img: "https://images.unsplash.com/photo-1611365892502-8e59b647e8c6?q=80&w=1200&auto=format&fit=crop"
            }
          ].map((study, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50 rounded-sm p-8 lg:p-16 border border-gray-100 group hover:border-primary/30 transition-colors"
            >
              <div className={`order-2 ${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white text-dark font-medium text-sm mb-8 shadow-sm">
                  <Factory className="w-4 h-4 text-primary" />
                  {study.category}
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-dark mb-6 leading-tight">{study.title}</h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  {study.desc}
                </p>
                <div className="grid grid-cols-3 gap-6 mb-12">
                  {study.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-2">
                      <span className="text-3xl font-display font-bold text-dark">{stat.value}</span>
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white rounded-sm font-medium hover:bg-primary hover:text-dark transition-colors">
                  Read Full Study <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`order-1 aspect-square lg:aspect-[4/3] rounded-sm overflow-hidden ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                <img 
                  src={study.img} 
                  alt={study.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}

        </div>
      </section>
    </div>
  );
}
