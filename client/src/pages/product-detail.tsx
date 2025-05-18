import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { EcoScore } from "@/components/ui/eco-score";
import { SwapBadge } from "@/components/ui/swap-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id || "";
  const { getProduct } = useProducts();
  const { data: product, isLoading, error } = getProduct(productId);
  const { addToCart } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const isOwner = currentUser && product && currentUser.uid === product.ownerId;

  // Generate a formatted date string for the product creation date
  const formattedDate = product?.createdAt 
    ? new Date(product.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: parseInt(product.id),
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleOfferSwap = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to offer a swap.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Swap feature",
      description: "The swap feature will be implemented soon!",
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h1>
        <p className="mb-8">There was an error loading this product. It may have been removed or is unavailable.</p>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/shop" className="text-primary hover:text-primary-dark flex items-center">
          <i className="ri-arrow-left-line mr-1"></i> Back to Shop
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="w-full aspect-square rounded-md" />
            
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
              <div className="h-4 my-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="pt-6">
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : product ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div>
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full object-cover" 
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">{product.title}</h1>
              
              <p className="text-2xl text-primary font-semibold mb-4">${product.price.toFixed(2)}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <EcoScore score={product.ecoScore} />
                {product.isSwapMode && <SwapBadge />}
                <span className="bg-neutral-light text-neutral-dark text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <p className="text-neutral-dark mb-6">{product.description}</p>
              
              <div className="mb-6">
                <p className="text-neutral-medium text-sm mb-1">
                  <i className="ri-user-line mr-1"></i> Listed by: {product.ownerName || '@user'}
                </p>
                <p className="text-neutral-medium text-sm">
                  <i className="ri-calendar-line mr-1"></i> Listed on: {formattedDate}
                </p>
              </div>
              
              {!isOwner && (
                <div className="space-y-4">
                  {!product.isSwapMode && (
                    <>
                      <div className="flex items-center border-y border-neutral-light py-4">
                        <span className="mr-4">Quantity:</span>
                        <div className="flex items-center">
                          <button 
                            className="w-8 h-8 flex items-center justify-center border border-neutral-light rounded-l"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          <span className="w-12 h-8 flex items-center justify-center border-y border-neutral-light">
                            {quantity}
                          </span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center border border-neutral-light rounded-r"
                            onClick={() => handleQuantityChange(1)}
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full py-3 bg-primary hover:bg-primary-dark"
                        onClick={handleAddToCart}
                      >
                        <i className="ri-shopping-cart-line mr-2"></i> Add to Cart
                      </Button>
                    </>
                  )}
                  
                  {product.isSwapMode && (
                    <Button 
                      className="w-full py-3 bg-accent hover:bg-accent-dark"
                      onClick={handleOfferSwap}
                    >
                      <i className="ri-swap-line mr-2"></i> Offer a Swap
                    </Button>
                  )}
                </div>
              )}
              
              {isOwner && (
                <div className="mt-6 space-y-3">
                  <p className="text-neutral-dark">This is your listing.</p>
                  <Link href={`/profile?tab=listings`}>
                    <Button>
                      Manage Your Listings
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="p-6 border-t border-neutral-light">
            <Accordion type="single" collapsible>
              <AccordionItem value="details">
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Condition:</strong> Used - Good</p>
                    <p><strong>Listed on:</strong> {formattedDate}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>Shipping details are arranged between the buyer and seller after purchase.</p>
                    <p>We recommend using secure shipping methods with tracking numbers.</p>
                    <p>Returns are accepted within 14 days of receiving the item, if the item doesn't match the description.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="eco">
                <AccordionTrigger>Environmental Impact</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p><strong>Eco Score:</strong> {product.ecoScore}/100</p>
                    <p>By purchasing this pre-loved item instead of new, you're helping to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Reduce waste in landfills</li>
                      <li>Save the resources needed to produce a new item</li>
                      <li>Lower carbon emissions from manufacturing</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Product not found</h2>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop">
            <Button>Browse Other Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
