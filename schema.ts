import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase auth UID
  username: text("username").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deliveryAddress: jsonb("delivery_address").$type<{
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  }>(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  ownerId: text("owner_id").notNull(), // References Firebase UID
  ecoScore: integer("eco_score").notNull(),
  isSwapMode: boolean("is_swap_mode").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

// Cart Item Schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References Firebase UID
  productId: integer("product_id").notNull(),
  title: text("title").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

// Order Schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References Firebase UID
  items: jsonb("items").$type<{
    productId: number;
    title: string;
    price: number;
    quantity: number;
  }[]>().notNull(),
  deliveryAddress: jsonb("delivery_address").$type<{
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  }>().notNull(),
  totalAmount: real("total_amount").notNull(),
  orderedAt: timestamp("ordered_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
