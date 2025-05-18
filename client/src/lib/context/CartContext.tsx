import { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { db, collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from "../firebase";

export interface CartItem {
  id: string;
  productId: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "id" | "quantity">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  subtotal: number;
  total: number;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  isLoading: false,
  subtotal: 0,
  total: 0,
});

interface CartProviderProps {
  children: ReactNode;
}

const SHIPPING_COST = 10;

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal + (subtotal > 0 ? SHIPPING_COST : 0);

  // Fetch cart items when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser) {
        setCartItems([]);
        return;
      }

      setIsLoading(true);
      try {
        const q = query(
          collection(db, "carts"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const items: CartItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as CartItem);
        });
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart items.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [currentUser, toast]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (item: Omit<CartItem, "id" | "quantity">) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find((cartItem) => cartItem.productId === item.productId);

      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + 1);
      } else {
        // Add new item
        const docRef = await addDoc(collection(db, "carts"), {
          ...item,
          userId: currentUser.uid,
          quantity: 1
        });

        setCartItems([...cartItems, { id: docRef.id, ...item, quantity: 1 }]);
      }

      toast({
        title: "Added to cart",
        description: `${item.title} has been added to your cart.`,
      });
      openCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "carts", id));
      setCartItems(cartItems.filter((item) => item.id !== id));
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!currentUser || quantity < 1) return;

    setIsLoading(true);
    try {
      await updateDoc(doc(db, "carts", id), { quantity });
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const deletePromises = cartItems.map((item) =>
        deleteDoc(doc(db, "carts", item.id))
      );
      await Promise.all(deletePromises);
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
    subtotal,
    total
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
