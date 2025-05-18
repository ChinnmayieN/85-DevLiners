import { useMutation, useQuery } from '@tanstack/react-query';
import { db, doc, getDoc, updateDoc } from '../firebase';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '../queryClient';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  createdAt: string;
  deliveryAddress?: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface UpdateProfileData {
  username?: string;
  deliveryAddress?: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export function useUser() {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Query user profile
  const { 
    data: profile, 
    isLoading: isLoadingProfile, 
    error 
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!currentUser) return null;
      
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        throw new Error("User profile not found");
      }
    },
    enabled: !!currentUser
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!currentUser) throw new Error("You must be logged in to update your profile");
      
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, data);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  return {
    profile,
    isLoadingProfile,
    error,
    updateProfile
  };
}
