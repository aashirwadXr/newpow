import { motion } from 'motion/react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Newsroom() {
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
            Newsroom
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-bold text-dark leading-[0.9] tracking-tight mb-8">
            PowerMore <br />
            <span className="text-gray-400">in the Press.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl text-balance">
            Read the latest announcements, press releases, and media coverage about our mission to accelerate India's industrial energy transition.
          </p>
        </motion.div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {[
            {
              title: "PowerMore Secures ₹500 Crore Funding to Expand C&I Solar Operations",
              date: "April 10, 2026",
              source: "Economic Times",
              img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
              desc: "The Series B funding will accelerate the deployment of ALMM-compliant solar solutions for manufacturing hubs across Maharashtra and Gujarat."
            },
            {
              title: "India's Top 10 Solar EPC Companies for Industrial Rooftops",
              date: "March 22, 2026",
              source: "Mercom India",
              img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
              desc: "PowerMore recognized for its rapid execution speed and adherence to stringent safety standards in large-scale commercial installations."
            },
            {
              title: "PowerMore Completes 10MW Ground Mount Project in Record Time",
              date: "February 05, 2026",
              source: "Renewable Watch",
              img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
              desc: "The utility-scale project in Rajasthan was commissioned three weeks ahead of schedule, setting a new benchmark for EPC efficiency."
            }
          ].map((news, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 rounded-sm overflow-hidden border border-gray-100 group hover:border-primary/30 transition-colors flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-sm text-xs font-bold text-dark uppercase tracking-wider">
                  {news.source}
                </div>
                <img 
                  src={news.img} 
                  alt={news.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4 font-medium">
                  <Newspaper className="w-4 h-4" />
                  {news.date}
                </div>
                <h3 className="text-2xl font-display font-bold text-dark mb-4 group-hover:text-primary transition-colors leading-tight">
                  {news.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                  {news.desc}
                </p>
                <Link to="#" className="inline-flex items-center gap-2 text-dark font-medium hover:text-primary transition-colors mt-auto">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
      </section>
    </div>
  );
}
