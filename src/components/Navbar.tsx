import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LOGO_SVG_URL } from '../lib/logo';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { 
    name: 'About Us', 
    path: '/about',
    dropdown: [
      { name: 'About PowerMore', path: '/about' },
      { name: 'Our Mission', path: '/mission' },
      { name: 'Case Studies', path: '/case-studies' },
      { name: 'Blogs', path: '/blogs' },
      { name: 'Newsroom / PR', path: '/newsroom' },
      { name: 'Events', path: '/events' },
      { name: 'Careers', path: '/careers' },
    ]
  },
  { 
    name: 'Products', 
    path: '/products',
    dropdown: [
      { name: 'Solar Panels', path: '/solar-panels' },
      { name: 'Inverters', path: '/inverters' },
      { name: 'Mounting Structures', path: '/mounting-structures' },
      { name: 'Products (Experiment)', path: '/products-experiment' },
    ]
  },
  { 
    name: 'Solutions', 
    path: '/solutions',
    dropdown: [
      { name: 'Solutions', path: '/solutions' },
      { name: 'Solutions (Experiment 2)', path: '/experiment-2' },
    ]
  },
  { name: 'Customers', path: '/customers' },
  { name: 'Partners', path: '/partners' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      {/* Optional Gradient Overlay for better contrast when not scrolled */}
      {!isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      )}
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50">
          <img 
            src={LOGO_SVG_URL} 
            alt="POWERMORE" 
            className={`h-8 w-auto transition-all duration-300 ${!isScrolled ? 'invert brightness-0' : ''}`} 
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <div 
              key={link.name}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link 
                to={link.path}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isScrolled 
                    ? (location.pathname === link.path ? 'text-dark' : 'text-gray-600 hover:text-dark')
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
                {link.dropdown && <ChevronDown className="w-4 h-4" />}
              </Link>

              {/* Dropdown */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-4 w-48"
                    >
                      <div className="bg-white rounded-sm shadow-lg border border-gray-100 py-2 overflow-hidden">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-dark transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4 z-50">
          <Link 
            to="/contact" 
            className={`hidden lg:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-dark bg-primary hover:bg-[#b3e600] transition-colors rounded-sm ${
              !isScrolled ? 'shadow-[0_0_15px_rgba(204,255,0,0.3)]' : ''
            }`}
          >
            Contact Us
          </Link>
          <button 
            className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-dark' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 bg-white z-40 lg:hidden pt-24 px-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-6 pb-24">
              {NAV_LINKS.map((link) => (
                <div key={link.name} className="flex flex-col gap-3">
                  <Link 
                    to={link.path}
                    className="text-2xl font-display font-medium text-dark"
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-100">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="text-lg text-gray-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link 
                to="/contact" 
                className="mt-4 inline-flex items-center justify-center px-6 py-4 text-lg font-medium text-dark bg-primary rounded-sm text-center"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
