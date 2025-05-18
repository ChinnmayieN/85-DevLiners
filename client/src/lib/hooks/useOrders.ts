import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where,
  orderBy 
} from '../firebase';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '../queryClient';
import { useCart } from './useCart';

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
}

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  deliveryAddress: Address;
  totalAmount: number;
  orderedAt: string;
}

export interface NewOrder {
  deliveryAddress: Address;
}

export function useOrders() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { cartItems, total, clearCart } = useCart();

  // Query user's orders
  const { 
    data: orders, 
    isLoading: isLoadingOrders, 
    error 
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const q = query(
        collection(db, "orders"), 
        where("userId", "==", currentUser.uid),
        orderBy("orderedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      
      return orders;
    },
    enabled: !!currentUser
  });

  // Query single order
  const getOrder = (id: string) => {
    return useQuery({
      queryKey: ['orders', id],
      queryFn: async () => {
        if (!currentUser) throw new Error("You must be logged in to view order details");
        
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const orderData = docSnap.data();
          
          // Verify the order belongs to the current user
          if (orderData.userId !== currentUser.uid) {
            throw new Error("You can only view your own orders");
          }
          
          return { id: docSnap.id, ...orderData } as Order;
        } else {
          throw new Error("Order not found");
        }
      },
      enabled: !!id && !!currentUser
    });
  };

  // Create order mutation
  const createOrder = useMutation({
    mutationFn: async (newOrder: NewOrder) => {
      if (!currentUser) throw new Error("You must be logged in to create an order");
      if (cartItems.length === 0) throw new Error("Your cart is empty");
      
      // Format order items from cart
      const items = cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Create order in Firestore
      const orderData = {
        userId: currentUser.uid,
        items,
        deliveryAddress: newOrder.deliveryAddress,
        totalAmount: total,
        orderedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      // Clear the cart after successful order
      await clearCart();
      
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully!",
      });
      
      return { id: docRef.id, ...orderData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  return {
    orders,
    isLoadingOrders,
    error,
    getOrder,
    createOrder
  };
}
