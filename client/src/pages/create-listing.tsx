import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProducts } from "@/lib/hooks/useProducts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { calculateEcoScore } from "@/lib/utils/ecoScore";

// Available categories
const CATEGORIES = [
  "Clothing",
  "Furniture",
  "Electronics",
  "Books",
  "Home & Garden",
  "Toys & Games",
  "Sports Equipment",
  "Art & Collectibles",
  "Jewelry & Accessories"
];

// Form validation schema
const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  isSwapMode: z.boolean().default(false),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Please upload an image")
    .transform(files => files[0])
    .refine(
      (file) => file && file.size <= 5 * 1024 * 1024, 
      "Image must be less than 5MB"
    )
    .refine(
      (file) => 
        file && ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      "Only JPEG, PNG and WebP images are supported"
    ),
});

type ListingFormData = z.infer<typeof listingSchema>;

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  const { createProduct, uploading } = useProducts();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [ecoScorePreview, setEcoScorePreview] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      setLocation("/login");
    }
  }, [isAuthenticated, currentUser, setLocation]);

  // Update eco score preview when category changes
  useEffect(() => {
    if (selectedCategory) {
      const score = calculateEcoScore(selectedCategory);
      setEcoScorePreview(score);
    } else {
      setEcoScorePreview(null);
    }
  }, [selectedCategory]);

  // Form
  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      category: "",
      isSwapMode: false,
    },
  });

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue("category", value);
  };

  // Handle form submission
  const onSubmit = async (data: ListingFormData) => {
    try {
      await createProduct.mutateAsync({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        isSwapMode: data.isSwapMode,
      });
      
      setLocation("/profile?tab=listings");
    } catch (error) {
      console.error("Error creating listing:", error);
      // Error is handled in the mutation (useProducts hook)
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Create a New Listing</h1>
        <p className="text-neutral-medium">Share your pre-loved items with the community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Vintage Denim Jacket" 
                            {...field} 
                            disabled={createProduct.isPending || uploading}
                          />
                        </FormControl>
                        <FormDescription>
                          Create a descriptive title for your item
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your item in detail - condition, size, brand, etc." 
                            className="min-h-32" 
                            {...field} 
                            disabled={createProduct.isPending || uploading}
                          />
                        </FormControl>
                        <FormDescription>
                          Be detailed about the condition and features of your item
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 45.00" 
                              step="0.01" 
                              min="0.01"
                              {...field} 
                              disabled={form.watch("isSwapMode") || createProduct.isPending || uploading}
                            />
                          </FormControl>
                          <FormDescription>
                            Set a fair price for your item
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={handleCategoryChange} 
                            defaultValue={field.value}
                            disabled={createProduct.isPending || uploading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the most relevant category
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isSwapMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Swap Mode</FormLabel>
                          <FormDescription>
                            Enable if you prefer to swap this item rather than sell it
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={createProduct.isPending || uploading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleImageChange(e);
                                onChange(e.target.files);
                              }}
                              {...fieldProps}
                              disabled={createProduct.isPending || uploading}
                            />

                            {imagePreview && (
                              <div className="mt-2 rounded-md overflow-hidden border border-neutral-light">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full max-h-64 object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a clear image of your item (max 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-primary"
                      disabled={createProduct.isPending || uploading}
                    >
                      {(createProduct.isPending || uploading) ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating listing...</span>
                        </div>
                      ) : (
                        "Create Listing"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-4">Listing Preview</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-medium">Title</h3>
                  <p className="font-medium text-lg">{form.watch("title") || "Your product title"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-medium">Price</h3>
                  <p className="font-semibold text-primary text-lg">
                    {form.watch("isSwapMode") 
                      ? "Swap Only" 
                      : form.watch("price") 
                        ? `$${parseFloat(form.watch("price").toString()).toFixed(2)}` 
                        : "$0.00"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-medium">Category</h3>
                  <p>{selectedCategory || "Not selected"}</p>
                </div>

                {ecoScorePreview !== null && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-medium mb-1">Eco Score</h3>
                    <div className="eco-score-badge inline-flex">
                      <i className="ri-leaf-line mr-1"></i>
                      <span>Eco Score: {ecoScorePreview}</span>
                    </div>
                  </div>
                )}

                {form.watch("isSwapMode") && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-medium mb-1">Swap Mode</h3>
                    <div className="swap-badge inline-flex">
                      <i className="ri-swap-line mr-1"></i>
                      <span>Swap</span>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-neutral-lightest rounded-md">
                  <h3 className="font-medium mb-2">Tips for a Great Listing</h3>
                  <ul className="space-y-2 text-sm text-neutral-medium">
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-0.5 mr-2"></i>
                      <span>Be honest about the condition of your item</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-0.5 mr-2"></i>
                      <span>Include measurements, dimensions, or sizing information</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-0.5 mr-2"></i>
                      <span>Mention any flaws, wear, or imperfections</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary mt-0.5 mr-2"></i>
                      <span>Take clear, well-lit photos from multiple angles</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
