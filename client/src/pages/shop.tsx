import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/lib/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { sampleProducts } from "../data/sample-products";
import { categories } from "../data/categories";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Shop() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  const { products: firebaseProducts, isLoadingProducts } = useProducts();
  const { currentUser } = useAuth();
  
  // Combine sample products with any loaded from Firebase
  const allProducts = [...(firebaseProducts || []), ...sampleProducts];
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All Categories");
  const [showSwapOnly, setShowSwapOnly] = useState(searchParams.get("swap") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState<'all' | 'selling' | 'buying'>(
    currentUser ? (searchParams.get("view") as any) || 'all' : 'all'
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== "All Categories") params.set("category", selectedCategory);
    if (showSwapOnly) params.set("swap", "true");
    if (sortBy !== "newest") params.set("sort", sortBy);
    
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }, [searchTerm, selectedCategory, showSwapOnly, sortBy]);

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      // View mode filter (selling/buying)
      if (currentUser && viewMode === 'selling' && product.ownerId !== currentUser.uid) {
        return false;
      }
      
      // For demo purposes, "buying" view shows only items with eco-score > 70
      if (currentUser && viewMode === 'buying' && product.ecoScore <= 70) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== "All Categories" && product.category !== selectedCategory) {
        return false;
      }
      
      // Swap mode filter
      if (showSwapOnly && !product.isSwapMode) {
        return false;
      }
      
      // Search term filter
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sorting
      switch (sortBy) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "ecoScore":
          return b.ecoScore - a.ecoScore;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is already handled by the filter above
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold">Shop Sustainable Items</h1>
        
        {currentUser && (
          <div className="flex gap-2">
            <Badge 
              variant={viewMode === 'all' ? 'default' : 'outline'} 
              className="cursor-pointer hover:bg-primary/90" 
              onClick={() => setViewMode('all')}
            >
              All Items
            </Badge>
            <Badge 
              variant={viewMode === 'selling' ? 'default' : 'outline'} 
              className="cursor-pointer hover:bg-primary/90" 
              onClick={() => setViewMode('selling')}
            >
              My Listings
            </Badge>
            <Badge 
              variant={viewMode === 'buying' ? 'default' : 'outline'} 
              className="cursor-pointer hover:bg-primary/90" 
              onClick={() => setViewMode('buying')}
            >
              Interested
            </Badge>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Category
            </label>
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">
              Sort By
            </label>
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                <SelectItem value="ecoScore">Eco Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="swapOnly" 
                checked={showSwapOnly}
                onCheckedChange={(checked) => setShowSwapOnly(checked === true)}
              />
              <Label htmlFor="swapOnly" className="text-neutral-dark">
                Show Swap Items Only
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-neutral-medium">
          {isLoadingProducts && allProducts.length === sampleProducts.length
            ? 'Loading products...' 
            : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'}`}
        </p>
        <div className="text-sm">
          <span className="text-primary font-medium">Pro tip:</span> Use filters to narrow your search
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoadingProducts && allProducts.length === sampleProducts.length ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, index) => (
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
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-medium">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                <path d="M8 11h6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No items found (0 results)</h3>
            <p className="text-neutral-medium mb-4">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <div className="inline-flex flex-col gap-2 text-left bg-accent/10 p-4 rounded-lg max-w-md mx-auto">
              <h4 className="font-medium text-sm">Try these suggestions:</h4>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Check for spelling errors in your search terms</li>
                <li>Use more general keywords</li>
                <li>Clear your category filter (currently: {selectedCategory})</li>
                {showSwapOnly && <li>Disable the "Show Swap Items Only" filter</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
