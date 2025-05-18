import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUser } from "@/lib/hooks/useUser";
import { useProducts } from "@/lib/hooks/useProducts";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "wouter";

// Form schema for profile information
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

// Form schema for address
const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Pincode/Zip is required"),
});

export default function Profile() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const { currentUser, isAuthenticated } = useAuth();
  const { profile, isLoadingProfile, updateProfile } = useUser();
  const { getUserProducts, deleteProduct } = useProducts();
  const { data: userProducts, isLoading: isLoadingProducts } = getUserProducts();
  const { orders, isLoadingOrders } = useOrders();
  const { toast } = useToast();

  // Get tab from URL param if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["profile", "listings", "orders"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      setLocation("/login");
    }
  }, [isAuthenticated, currentUser, setLocation]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", value);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
    },
    values: {
      username: profile?.username || "",
    },
  });

  // Address form
  const addressForm = useForm<z.infer<typeof addressSchema>>({
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

  // Update profile information
  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile.mutateAsync({
        username: data.username,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Update delivery address
  const onAddressSubmit = async (data: z.infer<typeof addressSchema>) => {
    try {
      await updateProfile.mutateAsync({
        deliveryAddress: data,
      });
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: "Product deleted",
        description: "Your product has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">My Account</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProfile ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input value={profile?.email || currentUser?.email || ""} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary"
                        disabled={updateProfile.isPending || !profileForm.formState.isDirty}
                      >
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
                <CardDescription>
                  This address will be used for deliveries
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
                  <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                      <FormField
                        control={addressForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addressForm.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={addressForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addressForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={addressForm.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP/Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-primary"
                        disabled={updateProfile.isPending || !addressForm.formState.isDirty}
                      >
                        {updateProfile.isPending ? "Saving..." : "Save Address"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-heading font-semibold">My Listings</h2>
            <Link href="/create-listing">
              <Button className="bg-primary">
                <i className="ri-add-line mr-2"></i> Add New Listing
              </Button>
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Skeleton className="h-32 w-32 rounded-md flex-shrink-0" />
                      <div className="flex-grow space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-9 w-20" />
                          <Skeleton className="h-9 w-20" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userProducts && userProducts.length > 0 ? (
            <div className="space-y-4">
              {userProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img 
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-32 w-32 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{product.title}</h3>
                            <p className="text-primary font-semibold">${product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex space-x-1">
                            {product.isSwapMode && (
                              <span className="swap-badge">
                                <i className="ri-swap-line mr-1"></i>
                                <span>Swap</span>
                              </span>
                            )}
                            <span className="eco-score-badge">
                              <i className="ri-leaf-line mr-1"></i>
                              <span>Eco Score: {product.ecoScore}</span>
                            </span>
                          </div>
                        </div>
                        <p className="text-neutral-medium text-sm my-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Link href={`/product/${product.id}`}>
                            <Button variant="outline">
                              <i className="ri-eye-line mr-1"></i> View
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your
                                  product listing.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <i className="ri-shopping-bag-line text-5xl text-neutral-medium mb-4"></i>
                  <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                  <p className="text-neutral-medium mb-6">You haven't created any product listings yet.</p>
                  <Link href="/create-listing">
                    <Button className="bg-primary">Create Your First Listing</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <h2 className="text-2xl font-heading font-semibold mb-6">Order History</h2>

          {isLoadingOrders ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-1/4 mb-4" />
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="flex-grow mx-3">
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="flex-grow mx-3">
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-3 w-1/3" />
                          </div>
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">
                        Order #{order.id.substring(0, 8)}
                      </h3>
                      <span className="text-neutral-medium text-sm">
                        {new Date(order.orderedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-4 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="flex-grow">
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-neutral-medium">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Shipping Address:</h4>
                      <p className="text-sm text-neutral-medium">
                        {order.deliveryAddress.name}<br />
                        {order.deliveryAddress.street}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}<br />
                        Phone: {order.deliveryAddress.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <i className="ri-inbox-line text-5xl text-neutral-medium mb-4"></i>
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-neutral-medium mb-6">You haven't placed any orders yet.</p>
                  <Link href="/shop">
                    <Button className="bg-primary">Start Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
