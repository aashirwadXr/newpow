import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * PORTABLE NAVBAR COMPONENT
 * 
 * Instructions:
 * 1. Ensure 'lucide-react', 'motion/react', and 'react-router-dom' are installed.
 * 2. This component uses Tailwind CSS. Ensure Tailwind is configured in your project.
 * 3. Theme colors (primary, dark) are defined as CSS variables below for portability.
 */

// Inlined Logo SVG (Original POWERMORE Logo)
const LOGO_SVG_URL = "data:image/svg+xml,%3csvg%20width='666'%20height='179'%20viewBox='0%200%20666%20179'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M550.629%201.97668H624.489C648.469%201.97668%20665.929%20-0.00234032%20665.929%2028.5065C665.929%2040.8193%20663.822%2050.0013%20650.769%2051.9767C668.141%2053.9912%20665.079%2069.9391%20665.079%2083.5465H640.629C640.629%2070.4399%20639.527%2062.8966%20624.369%2062.8966H575.439V83.5465H550.629V1.97668ZM624.249%2042.4366C633.939%2042.2501%20641.119%2043.6259%20641.119%2032.1769C641.119%2020.9336%20633.327%2022.4935%20624.249%2022.3966H575.439V42.3966L624.249%2042.4366Z'%20fill='black'/%3e%3cpath%20d='M322.84%2095.2013H396.7C420.68%2095.2013%20438.14%2093.2223%20438.14%20121.731C438.14%20134.044%20436.033%20143.226%20422.979%20145.201C440.352%20147.216%20437.29%20163.164%20437.29%20176.771H412.84C412.84%20163.665%20411.738%20156.121%20396.58%20156.121H347.65V176.771H322.84V95.2013ZM396.459%20135.661C406.15%20135.475%20413.33%20136.851%20413.33%20125.401C413.33%20114.158%20405.538%20115.718%20396.459%20115.621H347.65V135.621L396.459%20135.661Z'%20fill='black'/%3e%3cpath%20d='M437.162%202.0166V83.5466H396.392L380.002%2023.7766L363.622%2083.5466H322.852V2.0166H344.932V63.0166H346.632L365.212%202.0166H394.802L413.382%2063.0166H415.082V2.0166H437.162Z'%20fill='black'/%3e%3cpath%20d='M44.98%2095.1865L69.1802%20148.097L93.5%2095.1865H138.23V176.697H113.78L114.4%20115.697H110.24L79.5601%20176.697H58.9102L28.23%20115.697H23.8301L24.4404%20176.697H0V95.1865H44.98Z'%20fill='black'/%3e%3cpath%20d='M183.6%2058.7563C179.798%2066.1844%20177.824%2074.4121%20177.84%2082.7563V83.5967H147.84V82.7563C147.817%2067.3605%20152.109%2052.2665%20160.23%2039.1865L183.6%2058.7563Z'%20fill='black'/%3e%3cpath%20d='M209.221%2034.5264C201.188%2038.0999%20194.171%2043.6158%20188.801%2050.5767L165.801%2031.2666C175.097%2019.5436%20187.396%2010.5586%20201.391%205.2666L209.221%2034.5264Z'%20fill='black'/%3e%3cpath%20d='M250.51%202.4363L242.74%2031.4363C234.722%2029.5295%20226.368%2029.5295%20218.35%2031.4363L210.57%202.4363C223.706%20-0.812099%20237.435%20-0.812099%20250.57%202.4363H250.51Z'%20fill='black'/%3e%3cpath%20d='M295.291%2031.2666L272.291%2050.5767C266.921%2043.6158%20259.904%2038.0999%20251.871%2034.5264L259.701%205.29639C270.714%209.45109%20280.713%2015.9082%20289.031%2024.2363C291.248%2026.4603%20293.338%2028.8077%20295.291%2031.2666Z'%20fill='black'/%3e%3cpath%20d='M313.239%2082.7168V83.5566H283.239V82.7168C283.256%2074.3712%20281.278%2066.1424%20277.469%2058.7168L300.839%2039.1167C308.972%2052.2026%20313.269%2067.3092%20313.239%2082.7168Z'%20fill='black'/%3e%3cpath%20d='M313.24%2095.1968V96.0264C313.24%20117.96%20304.527%20138.995%20289.018%20154.504C273.508%20170.014%20252.473%20178.727%20230.54%20178.727C208.606%20178.727%20187.571%20170.014%20172.062%20154.504C156.553%20138.995%20147.84%20117.96%20147.84%2096.0264V95.1968H177.84V96.0264C177.845%20108.969%20182.615%20121.457%20191.24%20131.106C197.201%20137.798%20204.77%20142.86%20213.232%20145.812C221.694%20148.763%20230.769%20149.509%20239.6%20147.977C251.287%20145.94%20261.942%20140.008%20269.83%20131.146C271.973%20128.749%20273.895%20126.162%20275.57%20123.417C280.595%20115.176%20283.249%20105.709%20283.24%2096.0566V95.2266L313.24%2095.1968Z'%20fill='%23CCFF00'/%3e%3cpath%20d='M0%201.97656H105.91C129.784%201.97656%20147.84%203.13765%20147.84%2032.5366C147.84%2061.9854%20131.071%2063.5864%20106.15%2063.5864H24.8101V83.5063H0V1.97656ZM105.91%2043.1768C115.746%2043.0655%20122.97%2044.1878%20122.97%2032.5366C122.97%2021.1069%20114.976%2022.497%20105.86%2022.3965H24.7603V43.1768H105.91Z'%20fill='black'/%3e%3cpath%20d='M538.999%2095.1865V114.376H473.229V126.227H537.049V144.227H473.229V157.187V157.227H538.999V176.747V176.787H448.789V95.2563L538.999%2095.1865Z'%20fill='black'/%3e%3cpath%20d='M538.999%201.97656V21.1665H473.229V33.0264H537.049V51.0264H473.229V63.9766V64.0264H538.999V83.5264V83.5767H448.789V1.97656H538.999Z'%20fill='black'/%3e%3c/svg%3e";

const defaultNavLinks = [
  { name: 'Home', path: '/' },
  { 
    name: 'About Us', 
    path: '/about',
    dropdown: [
      { name: 'About PowerMore', path: '/about' },
      { name: 'Our Mission', path: '/mission' },
      { name: 'Case Studies', path: '/case-studies' },
      { name: 'Blogs', path: '/blogs' },
    ]
  },
  { 
    name: 'Products', 
    path: '/products',
    dropdown: [
      { name: 'Solar Panels', path: '/solar-panels' },
      { name: 'Inverters', path: '/inverters' },
    ]
  },
  { name: 'Contact', path: '/contact' },
];

export interface NavbarPortableProps {
  navLinks?: typeof defaultNavLinks;
  logoUrl?: string;
  theme?: {
    primary?: string;
    dark?: string;
  };
}

export default function NavbarPortable({ 
  navLinks = defaultNavLinks, 
  logoUrl = LOGO_SVG_URL,
  theme = { primary: '#CCFF00', dark: '#1A1A1A' }
}: NavbarPortableProps) {
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
    <>
      <style>{`
        :root {
          --navbar-primary: ${theme.primary};
          --navbar-dark: ${theme.dark};
        }
        /* Fallback for projects without these classes */
        .bg-primary { background-color: var(--navbar-primary) !important; }
        .text-dark { color: var(--navbar-dark) !important; }
      `}</style>

      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        {!isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        )}
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-50">
            <img 
              src={logoUrl} 
              alt="LOGO" 
              className={`h-8 w-auto transition-all duration-300 ${!isScrolled ? 'invert brightness-0' : ''}`} 
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
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
                      ? (location.pathname === link.path ? 'text-[var(--navbar-dark)]' : 'text-gray-600 hover:text-[var(--navbar-dark)]')
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
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[var(--navbar-dark)] transition-colors"
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
              className={`hidden lg:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-[var(--navbar-dark)] bg-[var(--navbar-primary)] hover:opacity-90 transition-all rounded-sm ${
                !isScrolled ? 'shadow-[0_0_15px_rgba(204,255,0,0.3)]' : ''
              }`}
            >
              Contact Us
            </Link>
            <button 
              className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-[var(--navbar-dark)]' : 'text-white'}`}
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
              className="fixed inset-0 bg-white z-[90] lg:hidden pt-24 px-6 overflow-y-auto"
            >
              <div className="flex flex-col gap-6 pb-24">
                {navLinks.map((link) => (
                  <div key={link.name} className="flex flex-col gap-3">
                    <Link 
                      to={link.path}
                      className="text-2xl font-display font-medium text-[var(--navbar-dark)]"
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
                  className="mt-4 inline-flex items-center justify-center px-6 py-4 text-lg font-medium text-[var(--navbar-dark)] bg-[var(--navbar-primary)] rounded-sm text-center"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
