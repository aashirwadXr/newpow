import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Fallback() {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="bg-white pt-32 pb-24 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-sm pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(204,255,0,0.3)" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/10 text-dark font-medium text-sm mb-8 border border-primary/20 transition-all cursor-default"
          >
            Coming Soon
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-dark leading-[1.1] mb-8 tracking-tight">
            {title} <br />
            <span className="text-gray-400">Under Construction</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed text-balance mb-12">
            We are currently building this section to showcase our latest projects and innovations across India. Please check back soon for updates.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark text-white rounded-sm font-medium hover:bg-gray-800 hover:shadow-[0_0_20px_rgba(26,26,26,0.3)] transition-all duration-300 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
