import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { useUser } from "@/lib/hooks/useUser";
import { useOrders } from "@/lib/hooks/useOrders";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

// Address schema
const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Pincode/Zip is required"),
});

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  const { cartItems, subtotal, total, isLoading: isLoadingCart } = useCart();
  const { profile, isLoadingProfile } = useUser();
  const { createOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      setLocation("/login");
    }
  }, [isAuthenticated, currentUser, setLocation]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0) {
      setLocation("/shop");
    }
  }, [isLoadingCart, cartItems, setLocation]);

  // Form for address
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: profile?.deliveryAddress?.name || "",
      phone: profile?.deliveryAddress?.phone || "",
      street: profile?.deliveryAddress?.street || "",
      city: profile?.deliveryAddress?.city || "",
      state: profile?.deliveryAddress?.state || "",
      pincode: profile?.deliveryAddress?.pincode || "",
    },
    values: {
      name: profile?.deliveryAddress?.name || "",
      phone: profile?.deliveryAddress?.phone || "",
      street: profile?.deliveryAddress?.street || "",
      city: profile?.deliveryAddress?.city || "",
      state: profile?.deliveryAddress?.state || "",
      pincode: profile?.deliveryAddress?.pincode || "",
    },
  });

  // Handle order submission
  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      await createOrder.mutateAsync({
        deliveryAddress: data,
      });
      setLocation("/profile?tab=orders");
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  const isLoading = isLoadingCart || isLoadingProfile || isSubmitting;

  if (!isAuthenticated || (cartItems.length === 0 && !isLoadingCart)) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-2">Checkout</h1>
      <p className="text-neutral-medium mb-8">Complete your order</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your shipping details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProfile ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex items-center">
                            <i className="ri-cash-line text-xl mr-2"></i>
                            Cash on Delivery
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                          <RadioGroupItem value="card" id="card" disabled />
                          <Label htmlFor="card" className="flex items-center text-neutral-medium">
                            <i className="ri-bank-card-line text-xl mr-2"></i>
                            Credit/Debit Card (Coming Soon)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Link href="/shop">
                        <Button variant="outline" type="button" disabled={isLoading}>
                          <i className="ri-arrow-left-line mr-1"></i> Continue Shopping
                        </Button>
                      </Link>
                      <Button 
                        type="submit" 
                        className="bg-primary"
                        disabled={isLoading || cartItems.length === 0}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCart ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-16 h-16 object-cover rounded-md mr-3" 
                        />
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.title}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-medium">Qty: {item.quantity}</span>
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>$10.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-start">
                      <i className="ri-leaf-line text-green-500 text-xl mr-2"></i>
                      <div>
                        <h4 className="text-green-800 font-medium text-sm">Environmental Impact</h4>
                        <p className="text-green-700 text-xs">
                          By purchasing second-hand items, you're helping reduce approximately 
                          <span className="font-semibold"> 2.5 kg</span> of CO₂ emissions.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
