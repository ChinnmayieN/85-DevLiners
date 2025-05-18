import { useState } from "react";
import { Link } from "wouter";
import { EcoScore } from "../ui/eco-score";
import { SwapBadge } from "../ui/swap-badge";
import { Button } from "../ui/button";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  ecoScore: number;
  isSwapMode: boolean;
  ownerName: string;
}

export default function ProductCard({
  id,
  title,
  description,
  price,
  imageUrl,
  ecoScore,
  isSwapMode,
  ownerName,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    // In a real app, you would save this to the database
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSwapMode) return;
    
    addToCart({
      productId: parseInt(id),
      title,
      price,
      imageUrl,
    });
  };

  const handleOfferSwap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <Link href={`/product/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-64 object-cover" 
          />
          
          {/* Eco Score Badge */}
          <EcoScore score={ecoScore} className="absolute top-3 left-3" />
          
          {/* Swap Badge */}
          {isSwapMode && <SwapBadge className="absolute top-10 left-3" />}
          
          {/* Wishlist Button */}
          <button 
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-neutral-light transition-colors"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <i className={`${isWishlisted ? 'ri-heart-fill text-red-500' : 'ri-heart-line text-neutral-dark'}`}></i>
          </button>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
            <span className="font-semibold text-primary">₹{price.toFixed(2)}</span>
          </div>
          <p className="text-neutral-medium text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center mt-auto">
            <span className="text-sm text-neutral-medium">
              <i className="ri-user-line mr-1"></i> {ownerName || '@user'}
            </span>
            {isSwapMode ? (
              <Button
                variant="secondary"
                className="bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded text-sm transition-colors"
                onClick={handleOfferSwap}
              >
                Offer Swap
              </Button>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded text-sm transition-colors"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
