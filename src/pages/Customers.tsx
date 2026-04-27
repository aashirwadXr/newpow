import { motion } from 'motion/react';
import { Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Customers() {
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
            Our Customers
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-bold text-dark leading-[0.9] tracking-tight mb-8">
            Trusted by <br />
            <span className="text-gray-400">Industry Leaders.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl text-balance">
            From manufacturing giants to leading tech parks, India's top enterprises trust PowerMore to drive their clean energy transition.
          </p>
        </motion.div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {[
            {
              quote: "PowerMore didn't just install solar panels; they engineered a complete energy strategy for our textile plant. Our power costs dropped by 45% in the first quarter alone.",
              author: "Amitabh Desai",
              role: "Operations Director, Desai Textiles",
              img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=400&auto=format&fit=crop"
            },
            {
              quote: "The ALMM-compliant components and their rigorous installation process gave us the confidence we needed. Their team managed the entire grid-approval process seamlessly.",
              author: "Neha Gupta",
              role: "CEO, TechPark Innovations",
              img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop"
            },
            {
              quote: "We needed a 5MW ground-mount solution on a tight deadline. PowerMore delivered ahead of schedule, and the plant's generation has consistently exceeded projections.",
              author: "Vikram Rathore",
              role: "Managing Director, Rathore Steel",
              img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
            },
            {
              quote: "Their post-installation O&M service is unmatched. The real-time monitoring dashboard gives us complete visibility into our ROI and carbon offset metrics.",
              author: "Priya Sharma",
              role: "Sustainability Head, Global Logistics",
              img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop"
            }
          ].map((testimonial, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 p-10 lg:p-14 rounded-sm border border-gray-100 group hover:bg-dark hover:text-white transition-colors duration-500 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-12 h-12 text-primary mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                <p className="text-2xl lg:text-3xl font-display font-medium leading-relaxed mb-12 text-dark group-hover:text-white transition-colors">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-6">
                <img 
                  src={testimonial.img} 
                  alt={testimonial.author} 
                  className="w-16 h-16 rounded-sm object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-lg font-bold text-dark group-hover:text-white transition-colors">{testimonial.author}</h4>
                  <p className="text-gray-500 group-hover:text-gray-400 transition-colors">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-sm p-12 lg:p-24 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-display font-bold text-dark mb-8">Ready to join the leaders?</h2>
            <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-dark text-white rounded-sm font-medium text-lg hover:bg-gray-800 transition-colors shadow-xl">
              Start Your Project <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
