import { Link } from "wouter";
import { useProducts } from "@/lib/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { products, isLoadingProducts } = useProducts();

  // Featured items - in a real app, you might have a specific query for featured items
  const featuredItems = products?.slice(0, 8) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div 
          className="relative h-[500px] bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1000')" }}
        >
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                Give Items a Second Life, <br/>
                <span className="text-secondary-light">Save the Planet</span>
              </h1>
              <p className="text-white text-lg mb-8 max-w-lg">
                Join our sustainable marketplace where you can buy, sell, and swap pre-loved items to reduce waste and make a positive impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md transition-colors font-medium text-center">
                  Shop Now
                </Link>
                <Link href="/create-listing" className="bg-white hover:bg-neutral-light text-primary px-6 py-3 rounded-md transition-colors font-medium text-center">
                  Sell Your Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-neutral-dark text-center mb-2">Categories</h2>
          <p className="text-neutral-medium text-center mb-10">Browse sustainable items by category</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/shop?category=Clothing" className="group">
              <div className="rounded-lg overflow-hidden mb-3 relative aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600" 
                  alt="Clothing" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium font-heading">Clothing</h3>
                </div>
              </div>
            </Link>
            
            <Link href="/shop?category=Furniture" className="group">
              <div className="rounded-lg overflow-hidden mb-3 relative aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600" 
                  alt="Furniture" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium font-heading">Furniture</h3>
                </div>
              </div>
            </Link>
            
            <Link href="/shop?category=Electronics" className="group">
              <div className="rounded-lg overflow-hidden mb-3 relative aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600" 
                  alt="Electronics" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium font-heading">Electronics</h3>
                </div>
              </div>
            </Link>
            
            <Link href="/shop?category=Books" className="group">
              <div className="rounded-lg overflow-hidden mb-3 relative aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600" 
                  alt="Books" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium font-heading">Books</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-neutral-lightest">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-heading font-semibold text-neutral-dark mb-2">Featured Items</h2>
              <p className="text-neutral-medium">Discover our handpicked sustainable selections</p>
            </div>
            <div className="hidden md:block">
              <Link href="/shop" className="text-primary hover:text-primary-dark font-medium flex items-center">
                View All <i className="ri-arrow-right-line ml-1"></i>
              </Link>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoadingProducts ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md p-4">
                  <Skeleton className="w-full h-64 mb-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-9 w-1/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : featuredItems.length > 0 ? (
              featuredItems.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  ecoScore={product.ecoScore}
                  isSwapMode={product.isSwapMode}
                  ownerName={product.ownerName || '@user'}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-medium">No products available yet. Be the first to list an item!</p>
                <Link href="/create-listing" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md">
                  Create a Listing
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
              View All Items <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-neutral-dark text-center mb-2">How It Works</h2>
          <p className="text-neutral-medium text-center mb-10">Join our circular economy in three simple steps</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                <i className="ri-camera-line text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-heading font-medium mb-2">List Your Items</h3>
              <p className="text-neutral-medium">Take photos, write descriptions, set your price or mark for swap.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <i className="ri-chat-3-line text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-heading font-medium mb-2">Connect with Buyers</h3>
              <p className="text-neutral-medium">Respond to inquiries, arrange pickups or shipments with other users.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <i className="ri-earth-line text-3xl text-white"></i>
              </div>
              <h3 className="text-xl font-heading font-medium mb-2">Make an Impact</h3>
              <p className="text-neutral-medium">Track your environmental impact with our Eco Score on every transaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-center mb-10">Our Collective Impact</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <span className="text-4xl font-heading font-bold block mb-2">15,230</span>
              <span className="text-secondary-light font-medium">Items Reused</span>
            </div>
            
            <div className="text-center">
              <span className="text-4xl font-heading font-bold block mb-2">8,450</span>
              <span className="text-secondary-light font-medium">Swaps Completed</span>
            </div>
            
            <div className="text-center">
              <span className="text-4xl font-heading font-bold block mb-2">25.3</span>
              <span className="text-secondary-light font-medium">Tons CO₂ Saved</span>
            </div>
            
            <div className="text-center">
              <span className="text-4xl font-heading font-bold block mb-2">$192,400</span>
              <span className="text-secondary-light font-medium">Community Value</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
