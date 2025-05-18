import { useCart } from "@/lib/hooks/useCart";
import { Link } from "wouter";
import { Button } from "./button";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Skeleton } from "./skeleton";

export default function CartSidebar() {
  const { 
    cartItems, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    isLoading,
    subtotal,
    total
  } = useCart();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeCart}>
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center border-b border-neutral-light p-4">
            <h2 className="font-heading font-semibold text-xl">
              Your Cart ({cartItems.length})
            </h2>
            <button 
              className="text-neutral-dark hover:text-neutral-medium transition-colors" 
              onClick={closeCart}
              aria-label="Close"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
          
          <ScrollArea className="flex-grow p-4">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center py-4 border-b border-neutral-light">
                    <Skeleton className="w-20 h-20 rounded" />
                    <div className="ml-4 flex-grow">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10">
                <i className="ri-shopping-cart-line text-5xl text-neutral-medium mb-4"></i>
                <p className="text-neutral-dark font-medium mb-2">Your cart is empty</p>
                <p className="text-neutral-medium text-sm mb-6 text-center">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Button onClick={closeCart}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b border-neutral-light">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-20 h-20 object-cover rounded" 
                    />
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <button 
                            className="w-6 h-6 flex items-center justify-center border border-neutral-light rounded"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          <span className="mx-2 w-6 text-center">{item.quantity}</span>
                          <button 
                            className="w-6 h-6 flex items-center justify-center border border-neutral-light rounded"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <button 
                      className="ml-2 text-neutral-medium hover:text-error transition-colors"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {cartItems.length > 0 && (
            <div className="border-t border-neutral-light p-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Estimated shipping</span>
                <span className="font-semibold">$10.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg mb-6">
                <span className="font-medium">Total</span>
                <span className="font-heading font-semibold">${total.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout">
                <Button 
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors font-medium"
                  onClick={closeCart}
                >
                  Proceed to Checkout
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-primary hover:text-primary-dark py-2 transition-colors font-medium"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
