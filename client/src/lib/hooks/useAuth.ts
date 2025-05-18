import { useContext } from "react";
import { useLocation } from "wouter";
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  User,
  db,
  doc,
  setDoc
} from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

interface LoginData {
  email: string;
  password: string;
}

export function useAuth() {
  const { currentUser, loading } = useContext(AuthContext);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const register = async ({ email, password, username }: RegisterData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with username
      await updateProfile(user, { displayName: username });
      
      try {
        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username,
          email,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.error("Failed to save user data to Firestore:", firestoreError);
        // Continue with authentication even if Firestore fails
      }
      
      toast({
        title: "Account created",
        description: "You've successfully registered and logged in!",
      });
      
      setLocation("/");
      return user;
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "An error occurred during registration";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Try logging in instead.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Authentication service is not properly configured. Please check Firebase settings.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async ({ email, password }: LoginData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      setLocation("/");
      return userCredential.user;
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "An error occurred during login";
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please check and try again.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid login credentials. Please check and try again.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled. Please contact support.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Authentication service is not properly configured. Please check Firebase settings.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      
      setLocation("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during logout";
      toast({
        title: "Logout failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };
}
