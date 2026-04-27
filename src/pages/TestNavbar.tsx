import NavbarPortable from '../../portable/NavbarPortable';

export default function TestNavbar() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* The Portable Navbar */}
      <NavbarPortable />

      {/* Hero Section to test transparent state */}
      <section className="h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
           <div className="absolute inset-0 backdrop-blur-3xl" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Navbar <span className="text-primary italic">Portable</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            This page is testing the single-file portable navigation component. 
            Scroll down to see the transition effect and background blur.
          </p>
          <div className="flex items-center justify-center gap-4">
             <div className="px-8 py-3 bg-primary text-dark font-medium rounded-sm">Scroll Down</div>
          </div>
        </div>
      </section>

      {/* Content sections to test scrolled state */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center">
              <span className="text-gray-400 font-medium">Content Block {i}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-24 space-y-12">
          <h2 className="text-3xl font-display font-bold text-dark">Core Features</h2>
          <ul className="space-y-4 text-gray-600">
            <li>✓ <strong>Single File:</strong> Everything needed is inside NavbarPortable.tsx</li>
            <li>✓ <strong>Theme Support:</strong> Accepts custom primary and dark colors via props</li>
            <li>✓ <strong>Animations:</strong> Powered by Framer Motion (motion/react)</li>
            <li>✓ <strong>Responsive:</strong> Full mobile menu support</li>
            <li>✓ <strong>Smart Scroll:</strong> Transitions from transparent to blurred background on scroll</li>
          </ul>
        </div>
      </section>

      <section className="h-screen bg-gray-100 flex items-center justify-center border-t border-gray-200">
         <div className="text-center">
            <h2 className="text-4xl font-display font-bold text-dark mb-4">Bottom of Page</h2>
            <p className="text-gray-500">Perfect for checking z-index and fixed position behavior.</p>
         </div>
      </section>
    </div>
  );
}
