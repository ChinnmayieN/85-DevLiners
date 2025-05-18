import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="text-2xl font-heading font-bold flex items-center mb-4">
              <i className="ri-recycle-line mr-2 text-3xl"></i>
              ReLuv
            </Link>
            <p className="text-neutral-lightest mb-4">Your sustainable second-hand marketplace for preloved treasures.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <i className="ri-facebook-line text-xl"></i>
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <i className="ri-twitter-line text-xl"></i>
              </a>
              <a href="#" className="text-neutral-light hover:text-white transition-colors">
                <i className="ri-pinterest-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-neutral-light hover:text-white transition-colors">All Categories</Link></li>
              <li><Link href="/shop?featured=true" className="text-neutral-light hover:text-white transition-colors">Featured Items</Link></li>
              <li><Link href="/shop?sort=newest" className="text-neutral-light hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?swap=true" className="text-neutral-light hover:text-white transition-colors">Swap Items</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-neutral-light hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/sustainability" className="text-neutral-light hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/#how-it-works" className="text-neutral-light hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/contact" className="text-neutral-light hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-neutral-light hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="text-neutral-light hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="text-neutral-light hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-light hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-medium/30 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-light text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ReLuv. All rights reserved. Sustainable shopping for a better planet.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/privacy" className="text-neutral-light hover:text-white transition-colors text-sm">Privacy</Link>
              <Link href="/terms" className="text-neutral-light hover:text-white transition-colors text-sm">Terms</Link>
              <Link href="/cookies" className="text-neutral-light hover:text-white transition-colors text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
