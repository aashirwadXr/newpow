import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { LOGO_SVG_URL } from '../lib/logo';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={LOGO_SVG_URL} alt="POWERMORE" className="h-8 w-auto invert brightness-0" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              India's leading provider of commercial and industrial solar solutions. We power the future of business with sustainable energy infrastructure.
            </p>
            <div className="mt-4">
              <h4 className="font-display font-semibold text-lg mb-2">Contact</h4>
              <a href="mailto:contact@powermore.in" className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                Email Us: contact@powermore.in
              </a>
            </div>
          </div>

          {/* Industrial */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-semibold text-lg text-primary">Industrial</h4>
            <ul className="flex flex-col gap-2">
              <li className="text-gray-400 text-sm">Manufacturing Units</li>
              <li className="text-gray-400 text-sm">Heavy Engineering & Fabrication</li>
              <li className="text-gray-400 text-sm">Automobile & Auto Component Plants</li>
              <li className="text-gray-400 text-sm">Textile & Garment Units</li>
              <li className="text-gray-400 text-sm">Food Processing & FMCG Units</li>
              <li className="text-gray-400 text-sm">Pharmaceutical & Chemical Plants</li>
              <li className="text-gray-400 text-sm">Steel & Metal Processing</li>
              <li className="text-gray-400 text-sm">Cement & Building Materials</li>
              <li className="text-gray-400 text-sm">Packaging & Printing Units</li>
              <li className="text-gray-400 text-sm">Plastic & Polymer Units</li>
              <li className="text-gray-400 text-sm">Electronics Manufacturing</li>
              <li className="text-gray-400 text-sm">Paper & Pulp Industries</li>
            </ul>
          </div>

          {/* Commercial & Infrastructure */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-semibold text-lg text-primary">Commercial</h4>
              <ul className="flex flex-col gap-2">
                <li className="text-gray-400 text-sm">Commercial Office Buildings</li>
                <li className="text-gray-400 text-sm">IT Parks & Tech Campuses</li>
                <li className="text-gray-400 text-sm">Business Parks</li>
                <li className="text-gray-400 text-sm">Corporate Campuses</li>
                <li className="text-gray-400 text-sm">Shopping Malls & Retail Chains</li>
                <li className="text-gray-400 text-sm">Hotels & Hospitality</li>
                <li className="text-gray-400 text-sm">Data Centres</li>
                <li className="text-gray-400 text-sm">Co-working Spaces</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-semibold text-lg text-primary">Infrastructure & Logistics</h4>
              <ul className="flex flex-col gap-2">
                <li className="text-gray-400 text-sm">Warehouses & Logistics Parks</li>
                <li className="text-gray-400 text-sm">Industrial Parks & SEZs</li>
                <li className="text-gray-400 text-sm">Cold Storage Facilities</li>
                <li className="text-gray-400 text-sm">Airports & Infrastructure Facilities</li>
                <li className="text-gray-400 text-sm">Ports & Transport Hubs</li>
              </ul>
            </div>
          </div>

          {/* Institutional & Quick Links */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-semibold text-lg text-primary">Institutional</h4>
              <ul className="flex flex-col gap-2">
                <li className="text-gray-400 text-sm">Hospitals & Healthcare Facilities</li>
                <li className="text-gray-400 text-sm">Educational Institutions & Universities</li>
                <li className="text-gray-400 text-sm">Government Buildings</li>
                <li className="text-gray-400 text-sm">Research & Development Centres</li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-display font-semibold text-lg text-primary">Quick Links</h4>
              <ul className="flex flex-col gap-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
                <li><Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors text-sm">Case Studies</Link></li>
                <li><Link to="/blogs" className="text-gray-400 hover:text-white transition-colors text-sm">Blogs</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PowerMore. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
