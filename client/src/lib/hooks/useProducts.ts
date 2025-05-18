import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '../firebase';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '../queryClient';
import { calculateEcoScore } from '../utils/ecoScore';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  ownerId: string;
  ownerName?: string;
  ecoScore: number;
  isSwapMode: boolean;
  createdAt: string;
}

export interface NewProduct {
  title: string;
  description: string;
  price: number;
  category: string;
  image: File;
  isSwapMode: boolean;
}

export function useProducts() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  // Query all products
  const { data: products, isLoading: isLoadingProducts, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      return products;
    }
  });

  // Query products by category
  const getProductsByCategory = (category: string) => {
    return useQuery({
      queryKey: ['products', 'category', category],
      queryFn: async () => {
        const q = query(
          collection(db, "products"), 
          where("category", "==", category),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        return products;
      },
      enabled: !!category
    });
  };

  // Query user's products
  const getUserProducts = () => {
    return useQuery({
      queryKey: ['products', 'user'],
      queryFn: async () => {
        if (!currentUser) return [];
        
        const q = query(
          collection(db, "products"), 
          where("ownerId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        return products;
      },
      enabled: !!currentUser
    });
  };

  // Query single product
  const getProduct = (id: string) => {
    return useQuery({
      queryKey: ['products', id],
      queryFn: async () => {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
          throw new Error("Product not found");
        }
      },
      enabled: !!id
    });
  };

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (newProduct: NewProduct) => {
      if (!currentUser) throw new Error("You must be logged in to create a product");
      
      setUploading(true);
      try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `products/${Date.now()}_${newProduct.image.name}`);
        const uploadResult = await uploadBytes(storageRef, newProduct.image);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        
        // Calculate eco score based on category and other factors
        const ecoScore = calculateEcoScore(newProduct.category);
        
        // Create product in Firestore
        const productData = {
          title: newProduct.title,
          description: newProduct.description,
          price: newProduct.price,
          category: newProduct.category,
          imageUrl,
          ownerId: currentUser.uid,
          ownerName: currentUser.displayName || 'Anonymous',
          ecoScore,
          isSwapMode: newProduct.isSwapMode,
          createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, "products"), productData);
        
        toast({
          title: "Product created",
          description: "Your product has been listed successfully!",
        });
        
        return { id: docRef.id, ...productData };
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Product> }) => {
      if (!currentUser) throw new Error("You must be logged in to update a product");
      
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("Product not found");
      }
      
      const productData = docSnap.data();
      if (productData.ownerId !== currentUser.uid) {
        throw new Error("You can only update your own products");
      }
      
      await updateDoc(docRef, data);
      
      toast({
        title: "Product updated",
        description: "Your product has been updated successfully!",
      });
      
      return { id, ...productData, ...data };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', data.id] });
    }
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      if (!currentUser) throw new Error("You must be logged in to delete a product");
      
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("Product not found");
      }
      
      const productData = docSnap.data();
      if (productData.ownerId !== currentUser.uid) {
        throw new Error("You can only delete your own products");
      }
      
      await deleteDoc(docRef);
      
      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully!",
      });
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return {
    products,
    isLoadingProducts,
    error,
    getProductsByCategory,
    getUserProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploading
  };
}
