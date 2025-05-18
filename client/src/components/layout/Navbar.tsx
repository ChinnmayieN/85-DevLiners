import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../lib/hooks/useAuth";
import { useCart } from "../../lib/hooks/useCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { cartItems, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-heading font-bold text-primary flex items-center">
            <i className="ri-recycle-line mr-2 text-3xl"></i>
            ReLuv
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`hover:text-primary transition-colors font-medium ${location === '/' ? 'text-primary' : 'text-neutral-dark'}`}>
            Home
          </Link>
          <Link href="/shop" className={`hover:text-primary transition-colors font-medium ${location === '/shop' ? 'text-primary' : 'text-neutral-dark'}`}>
            Shop
          </Link>
          <Link href="/#about" className="text-neutral-dark hover:text-primary transition-colors font-medium">
            About
          </Link>
          <Link href="/#contact" className="text-neutral-dark hover:text-primary transition-colors font-medium">
            Contact
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-full hover:bg-neutral-light transition-colors relative" 
            aria-label="Search"
          >
            <i className="ri-search-line text-neutral-dark text-xl"></i>
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-neutral-light transition-colors relative" 
            aria-label="Cart"
            onClick={openCart}
          >
            <i className="ri-shopping-cart-line text-neutral-dark text-xl"></i>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-neutral-light transition-colors">
                  <span className="text-neutral-dark font-medium">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=listings" className="cursor-pointer w-full">
                    My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=orders" className="cursor-pointer w-full">
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create-listing" className="cursor-pointer w-full">
                    Create Listing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-error cursor-pointer"
                  onClick={handleLogout}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login" className="text-primary hover:text-primary-dark transition-colors font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors font-medium">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu (toggle) */}
      <div className="md:hidden border-t border-gray-200">
        <div className={`px-2 pt-2 pb-3 space-y-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <Link href="/" onClick={closeMobileMenu} className="block px-3 py-2 text-neutral-dark hover:bg-neutral-light rounded-md">
            Home
          </Link>
          <Link href="/shop" onClick={closeMobileMenu} className="block px-3 py-2 text-neutral-dark hover:bg-neutral-light rounded-md">
            Shop
          </Link>
          <Link href="/#about" onClick={closeMobileMenu} className="block px-3 py-2 text-neutral-dark hover:bg-neutral-light rounded-md">
            About
          </Link>
          <Link href="/#contact" onClick={closeMobileMenu} className="block px-3 py-2 text-neutral-dark hover:bg-neutral-light rounded-md">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
