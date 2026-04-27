import { motion } from 'motion/react';
import { ArrowRight, MapPin, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Events() {
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
            Events & Webinars
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-display font-bold text-dark leading-[0.9] tracking-tight mb-8">
            Connect <br />
            <span className="text-gray-400">With Us.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl text-balance">
            Meet our experts at industry expos, or join our exclusive webinars to learn how solar can transform your industrial operations.
          </p>
        </motion.div>
      </section>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-32">
        <div className="flex flex-col gap-6">
          
          {[
            {
              title: "REI Expo 2026 (Renewable Energy India)",
              date: "Sept 18-20, 2026",
              location: "India Expo Centre, Greater Noida",
              type: "In-Person Expo",
              desc: "Visit PowerMore at Booth A-45 to see our latest ALMM-compliant industrial mounting structures and high-efficiency modules.",
              img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "Webinar: Navigating ALMM for Commercial Solar",
              date: "June 12, 2026",
              location: "Online (Zoom)",
              type: "Virtual Webinar",
              desc: "Join our policy experts as they break down the latest ALMM guidelines and how they affect your ROI and procurement strategy.",
              img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "Intersolar India 2026",
              date: "April 05-07, 2026",
              location: "Bombay Exhibition Centre, Mumbai",
              type: "In-Person Expo",
              desc: "We're showcasing our new rapid-deployment solar carports. Schedule a meeting with our engineering team at Hall 1, Stall C12.",
              img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop"
            }
          ].map((event, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col lg:flex-row gap-8 bg-gray-50 rounded-sm p-8 lg:p-12 border border-gray-100 group hover:border-primary/30 transition-colors"
            >
              <div className="lg:w-1/3 aspect-video lg:aspect-square rounded-sm overflow-hidden">
                <img 
                  src={event.img} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:w-2/3 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white text-dark font-bold text-xs uppercase tracking-wider mb-6 shadow-sm self-start">
                  {event.type}
                </div>
                <h3 className="text-3xl lg:text-5xl font-display font-bold text-dark mb-6 group-hover:text-primary transition-colors leading-tight">
                  {event.title}
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {event.desc}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                  <div className="flex items-center gap-3 text-gray-500 font-medium bg-white px-4 py-2 rounded-sm shadow-sm">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 font-medium bg-white px-4 py-2 rounded-sm shadow-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                    {event.location}
                  </div>
                </div>
                <Link to="#" className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white rounded-sm font-medium hover:bg-primary hover:text-dark transition-colors self-start">
                  Register Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
      </section>
    </div>
  );
}
