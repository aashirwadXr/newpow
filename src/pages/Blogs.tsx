import { motion } from 'motion/react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blogs() {
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
            Our Blog
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-bold text-dark leading-[0.9] tracking-tight mb-8">
            Insights & <br />
            <span className="text-gray-400">Industry News.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl text-balance">
            Stay updated with the latest trends in commercial solar, ALMM policies, and sustainability in the Indian manufacturing sector.
          </p>
        </motion.div>
      </section>

      {/* Blogs Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {[
            {
              title: "Understanding ALMM: What Indian Manufacturers Need to Know",
              date: "March 15, 2026",
              category: "Policy",
              img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop",
              desc: "A deep dive into the Approved List of Models and Manufacturers (ALMM) and how it impacts commercial solar procurement."
            },
            {
              title: "Maximizing ROI on Industrial Rooftop Solar in 2026",
              date: "February 28, 2026",
              category: "Finance",
              img: "https://images.unsplash.com/photo-1611365892502-8e59b647e8c6?q=80&w=800&auto=format&fit=crop",
              desc: "Discover the financial incentives, accelerated depreciation benefits, and financing models available for Indian businesses."
            },
            {
              title: "Monsoon-Ready Solar: Engineering for Extreme Weather",
              date: "January 12, 2026",
              category: "Engineering",
              img: "https://images.unsplash.com/photo-1584484433100-344c20790897?q=80&w=800&auto=format&fit=crop",
              desc: "How PowerMore designs mounting structures and selects PID-resistant panels to withstand India's severe monsoon season."
            }
          ].map((blog, idx) => (
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
                  {blog.category}
                </div>
                <img 
                  src={blog.img} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4 font-medium">
                  <Calendar className="w-4 h-4" />
                  {blog.date}
                </div>
                <h3 className="text-2xl font-display font-bold text-dark mb-4 group-hover:text-primary transition-colors leading-tight">
                  {blog.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                  {blog.desc}
                </p>
                <Link to="#" className="inline-flex items-center gap-2 text-dark font-medium hover:text-primary transition-colors mt-auto">
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
      </section>
    </div>
  );
}
