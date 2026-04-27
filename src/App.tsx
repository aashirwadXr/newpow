import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import SolarPanels from './pages/SolarPanels';
import Inverters from './pages/Inverters';
import MountingStructures from './pages/MountingStructures';
import ProductsExperiment from './pages/ProductsExperiment';
import Mission from './pages/Mission';
import Contact from './pages/Contact';
import Solutions from './pages/Solutions';
import Experiment2 from './pages/Experiment2';
import Customers from './pages/Customers';
import Partners from './pages/Partners';
import CaseStudies from './pages/CaseStudies';
import Blogs from './pages/Blogs';
import Newsroom from './pages/Newsroom';
import Events from './pages/Events';
import Careers from './pages/Careers';
import TestNavbar from './pages/TestNavbar';
import Fallback from './pages/Fallback';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/solar-panels" element={<SolarPanels />} />
            <Route path="/inverters" element={<Inverters />} />
            <Route path="/mounting-structures" element={<MountingStructures />} />
            <Route path="/products-experiment" element={<ProductsExperiment />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/experiment-2" element={<Experiment2 />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/newsroom" element={<Newsroom />} />
            <Route path="/events" element={<Events />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/test-navbar" element={<TestNavbar />} />
            <Route path="*" element={<Fallback />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
