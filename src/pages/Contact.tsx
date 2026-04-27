import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-white pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/10 text-dark font-medium text-sm mb-8 border border-primary/20">
            Contact Us
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-bold text-dark leading-[0.9] tracking-tight mb-8">
            Let's Power <br />
            <span className="text-gray-400">Your Business.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl text-balance">
            Ready to transition your facility to clean, reliable solar energy? Our team of experts across India is here to design the perfect solution for your energy needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-12"
          >
            <div className="flex items-start gap-6 group">
              <div className="w-16 h-16 rounded-sm bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                <MapPin className="w-8 h-8 text-dark" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-dark mb-3">Corporate Headquarters</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  PowerMore Energy Pvt. Ltd.<br />
                  Level 4, TechPark One, Airport Road<br />
                  Yerawada, Pune, Maharashtra 411006<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-16 h-16 rounded-sm bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                <Phone className="w-8 h-8 text-dark" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-dark mb-3">Phone</h3>
                <p className="text-gray-600 leading-relaxed text-lg flex flex-col gap-1">
                  <a href="tel:+9118001234567" className="hover:text-primary transition-colors">Toll-Free: 1800-123-4567</a>
                  <a href="tel:+919876543210" className="hover:text-primary transition-colors">Sales: +91 98765 43210</a>
                  <span className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2">Mon-Sat, 9am-6pm IST</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-16 h-16 rounded-sm bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                <Mail className="w-8 h-8 text-dark" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-dark mb-3">Email</h3>
                <p className="text-gray-600 leading-relaxed text-lg flex flex-col gap-1">
                  <a href="mailto:sales@powermore.in" className="hover:text-primary transition-colors">sales@powermore.in</a>
                  <a href="mailto:support@powermore.in" className="hover:text-primary transition-colors">support@powermore.in</a>
                </p>
              </div>
            </div>

            <div className="p-10 bg-gray-50 rounded-sm border border-gray-100 mt-4">
              <h3 className="text-3xl font-display font-bold text-dark mb-8">Regional Offices</h3>
              <ul className="space-y-6 text-gray-600">
                <li className="flex justify-between items-center border-b border-gray-200 pb-6">
                  <span className="font-medium text-xl">Mumbai</span>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Maharashtra</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-200 pb-6">
                  <span className="font-medium text-xl">Delhi NCR</span>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Gurugram</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-200 pb-6">
                  <span className="font-medium text-xl">Bengaluru</span>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Karnataka</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium text-xl">Chennai</span>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tamil Nadu</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-10 lg:p-14 rounded-sm border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden h-fit"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-sm translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <h3 className="text-4xl font-display font-bold text-dark mb-10 relative z-10">Send us a message</h3>
            <form className="flex flex-col gap-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="firstName" className="text-sm font-bold text-gray-700 uppercase tracking-wider">First Name</label>
                  <input type="text" id="firstName" className="px-5 py-4 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 hover:bg-white text-lg" placeholder="Raj" />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="lastName" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Last Name</label>
                  <input type="text" id="lastName" className="px-5 py-4 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 hover:bg-white text-lg" placeholder="Kumar" />
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Work Email</label>
                <input type="email" id="email" className="px-5 py-4 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 hover:bg-white text-lg" placeholder="raj.kumar@company.com" />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="company" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Company Name</label>
                <input type="text" id="company" className="px-5 py-4 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 hover:bg-white text-lg" placeholder="Your Company Ltd." />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="interest" className="text-sm font-bold text-gray-700 uppercase tracking-wider">I'm interested in</label>
                <select 
                  id="interest" 
                  className="px-5 py-4 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 hover:bg-white appearance-none text-lg"
                >
                  <option>Commercial Rooftop Solar</option>
                  <option>Ground Mount Solar Park</option>
                  <option>Solar Components (Panels/Inverters)</option>
                  <option>Operations & Maintenance</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="text-sm font-bold text-gray-700 uppercase tracking-wider">How can we help?</label>
                <textarea id="message" rows={4} className="px-5 py-4 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 hover:bg-white resize-none text-lg" placeholder="Tell us about your energy requirements..."></textarea>
              </div>

              <button 
                type="submit" 
                className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-5 bg-dark text-white rounded-sm font-medium hover:bg-primary hover:text-dark transition-colors w-full group text-lg"
              >
                Send Message
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
