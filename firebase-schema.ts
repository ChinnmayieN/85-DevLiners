import { z } from "zod";

// User Schema
export const userSchema = z.object({
  uid: z.string(),
  username: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  deliveryAddress: z.object({
    name: z.string(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string()
  }).nullable().optional(),
});

// Product Schema
export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string(),
  ownerId: z.string(),
  ecoScore: z.number(),
  isSwapMode: z.boolean(),
  createdAt: z.string(),
});

// New Product Schema (for creating products)
export const newProductSchema = productSchema.omit({ 
  id: true, 
  createdAt: true, 
  ecoScore: true, 
  imageUrl: true,
  ownerId: true
}).extend({
  image: z.any() // File object for upload
});

// Cart Item Schema
export const cartItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  title: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  quantity: z.number(),
  createdAt: z.string()
});

// New Cart Item Schema (for creating cart items)
export const newCartItemSchema = cartItemSchema.omit({ 
  id: true, 
  createdAt: true,
  userId: true
});

// Order Schema
export const addressSchema = z.object({
  name: z.string(),
  phone: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string()
});

export const orderItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number()
});

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(orderItemSchema),
  deliveryAddress: addressSchema,
  totalAmount: z.number(),
  orderedAt: z.string()
});

// New Order Schema (for creating orders)
export const newOrderSchema = orderSchema.omit({ 
  id: true, 
  orderedAt: true,
  userId: true,
  items: true,
  totalAmount: true
});

// Types
export type User = z.infer<typeof userSchema>;
export type Product = z.infer<typeof productSchema>;
export type NewProduct = z.infer<typeof newProductSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type NewCartItem = z.infer<typeof newCartItemSchema>;
export type Address = z.infer<typeof addressSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type NewOrder = z.infer<typeof newOrderSchema>;