import { motion, AnimatePresence } from 'motion/react';
import { Building2, Truck, Landmark, Wrench, Send, X, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Partners() {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string>('Manufacturers');

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (activeForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeForm]);

  const categories = [
    { 
      id: 'Manufacturers', 
      title: 'Manufacturers', 
      description: 'Partner with us to supply high-quality solar components and technologies.',
      icon: Building2,
      image: 'https://i.ibb.co/Cspkm07H/manufactures.jpg'
    },
    { 
      id: 'Distributors', 
      title: 'Distributors', 
      description: 'Expand your reach by distributing our solar solutions across regions.',
      icon: Truck,
      image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_073521_449a4d92-61d2-4f4b-8d10-eb356b0d0b78.png&w=1280&q=85'
    },
    { 
      id: 'Financing Partners', 
      title: 'Financing Partners', 
      description: 'Provide financial solutions and leasing options to our commercial clients.',
      icon: Landmark,
      image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_073534_cbf92cf4-b005-4ef6-8097-263b7c8161d5.png&w=1280&q=85'
    },
    { 
      id: 'Installers', 
      title: 'Installers', 
      description: 'Join our network of certified solar installation and maintenance experts.',
      icon: Wrench,
      image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_34xVW4umAgnnG2EyAyEs3hc2344%2Fhf_20260330_073547_9e7baf41-3113-486c-bdfc-8b1aa25bf096.png&w=1280&q=85'
    }
  ];

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 z-10 overflow-hidden min-h-[90vh] flex items-center">
        <img src="https://i.ibb.co/21738XYq/Partners-Page-Hero.jpg" alt="Solar Panels" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/40 backdrop-blur-[0.5px]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary/20 text-primary font-medium text-sm mb-8 border border-primary/30 backdrop-blur-sm uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              Partner With Us
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.05] tracking-tight mb-8">
              Grow With <br />
              <span className="text-primary">PowerMore.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
              We are building India's strongest solar ecosystem. Whether you manufacture, distribute, finance, or install—let's collaborate to accelerate the transition to clean energy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Options Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-18 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left side: Options */}
          <div className="flex flex-col gap-3 lg:gap-4">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className={`p-5 lg:p-6 border rounded-sm cursor-pointer transition-all duration-300 group flex-1 flex flex-col justify-center ${
                  hoveredOption === cat.id 
                    ? 'bg-dark text-white border-dark shadow-2xl lg:translate-x-2' 
                    : 'bg-white text-dark border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onMouseEnter={() => setHoveredOption(cat.id)}
                onClick={() => setActiveForm(cat.id)}
              >
                <div className="flex items-center gap-3 lg:gap-4 mb-2 lg:mb-3">
                  <div className={`p-2 lg:p-2.5 rounded-sm transition-colors ${
                    hoveredOption === cat.id ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <cat.icon className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors ${
                      hoveredOption === cat.id ? 'text-primary' : 'text-dark'
                    }`} />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-display font-bold">{cat.title}</h3>
                </div>
                <p className={`text-sm lg:text-base transition-colors ${
                  hoveredOption === cat.id ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right side: Image */}
          <div className="hidden lg:block relative h-full min-h-[400px] rounded-sm overflow-hidden shadow-2xl bg-gray-100">
            {categories.map((cat) => (
              <img
                key={cat.id}
                src={cat.image}
                alt={cat.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-0 ${
                  hoveredOption === cat.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      <AnimatePresence>
        {activeForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
              onClick={() => setActiveForm(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-sm overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[90vh] lg:h-[800px] max-h-[90vh]"
            >
              <button 
                onClick={() => setActiveForm(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
              >
                <X className="w-6 h-6 text-dark" />
              </button>

              {/* Left: Image */}
              <div className="hidden lg:block lg:w-1/2 relative bg-dark">
                <img 
                  src={categories.find(c => c.id === activeForm)?.image} 
                  alt={activeForm}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                  <div className="p-4 bg-primary/20 backdrop-blur-md rounded-sm inline-block mb-6">
                    {categories.find(c => c.id === activeForm)?.icon && (() => {
                      const Icon = categories.find(c => c.id === activeForm)!.icon;
                      return <Icon className="w-8 h-8 text-primary" />;
                    })()}
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-display font-bold mb-4">{activeForm}</h3>
                  <p className="text-gray-200 text-lg leading-relaxed max-w-md">
                    {categories.find(c => c.id === activeForm)?.description}
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-14 overflow-y-auto flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full">
                  <h2 className="text-3xl lg:text-4xl font-display font-bold text-dark mb-3">
                    Partner Application
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    Please fill out the form below and our partnership team will get back to you shortly.
                  </p>
                  
                  <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Company Name</label>
                        <input type="text" className="px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50" placeholder="Your Company Ltd." />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Person</label>
                        <input type="text" className="px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50" placeholder="John Doe" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                        <input type="email" className="px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50" placeholder="john@company.com" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                        <input type="tel" className="px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50" placeholder="+91 98765 43210" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Website / Portfolio</label>
                      <input type="url" className="px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50" placeholder="https://www.company.com" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Additional Details</label>
                      <textarea rows={4} className="px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50 resize-none" placeholder="Tell us about your experience and how we can collaborate..."></textarea>
                    </div>

                    <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark text-white rounded-sm font-bold hover:bg-primary hover:text-dark transition-colors w-full text-lg group">
                      Submit Application <Send className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
