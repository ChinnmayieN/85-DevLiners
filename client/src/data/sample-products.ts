import { Product } from "../lib/hooks/useProducts";
import { calculateEcoScore } from "../lib/utils/ecoScore";

// Helper function to create product with correct type
const createProduct = (
  id: string, 
  title: string, 
  description: string, 
  price: number, 
  category: string, 
  imageUrl: string, 
  ownerId: string = "sample-user-1",
  ownerName: string = "EcoSeller",
  isSwapMode: boolean = false
): Product => {
  return {
    id,
    title,
    description,
    price,
    category,
    imageUrl,
    ownerId,
    ownerName,
    ecoScore: calculateEcoScore(category),
    isSwapMode,
    createdAt: new Date().toISOString()
  };
};

export const sampleProducts: Product[] = [
  createProduct(
    "product-1",
    "Vintage Denim Jacket",
    "Classic denim jacket from the 90s in excellent condition. Size M. Perfect for layering in any season.",
    45.99,
    "Clothing",
    "https://images.unsplash.com/photo-1548126032-079a0fb0099d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
  ),
  createProduct(
    "product-2",
    "Refurbished iPhone 11",
    "Fully refurbished iPhone 11 with 128GB storage. Battery health at 92%. Includes charger and protective case.",
    299.99,
    "Electronics",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
  ),
  createProduct(
    "product-3",
    "Handcrafted Wooden Bookshelf",
    "Solid oak bookshelf, gently used. 5 shelves, 6ft tall. Can be disassembled for easy transport.",
    129.50,
    "Furniture",
    "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1039&q=80"
  ),
  createProduct(
    "product-4",
    "Mountain Bike - Trek 820",
    "Trek 820 mountain bike, 3 years old but well maintained. New brakes installed last month. Perfect for trails or commuting.",
    350.00,
    "Sports",
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  ),
  createProduct(
    "product-5",
    "Vintage Vinyl Records Collection",
    "Collection of 20 classic rock vinyl records from the 70s and 80s. Includes albums from Pink Floyd, Led Zeppelin, and The Beatles.",
    199.99,
    "Entertainment",
    "https://images.unsplash.com/photo-1603048588665-791ca8aea617?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  ),
  createProduct(
    "product-6",
    "Upcycled Leather Backpack",
    "Handmade backpack crafted from upcycled leather jackets. Waterproof lining, multiple pockets, and adjustable straps.",
    89.95,
    "Accessories",
    "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "sample-user-2",
    "GreenCrafter",
    false
  ),
  createProduct(
    "product-7",
    "Minimalist Desk Lamp",
    "Stylish desk lamp with adjustable arm and dimmable LED light. Barely used, in perfect condition.",
    34.50,
    "Home",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
  ),
  createProduct(
    "product-8",
    "Vintage Film Camera",
    "Pentax K1000 35mm SLR camera with 50mm lens. Fully functional and in great condition. Perfect for film photography enthusiasts.",
    120.00,
    "Photography",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
  ),
  createProduct(
    "product-9",
    "Handmade Ceramic Mug Set",
    "Set of 4 unique handcrafted ceramic mugs. Microwave and dishwasher safe. Each piece is one-of-a-kind.",
    45.00,
    "Kitchen",
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  ),
  createProduct(
    "product-10",
    "Refurbished Coffee Machine",
    "Breville Barista Express espresso machine, professionally refurbished. Makes excellent espresso and cappuccino.",
    249.99,
    "Appliances",
    "https://images.unsplash.com/photo-1595246424689-7722208f65dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
  ),
  createProduct(
    "product-11",
    "Antique Wooden Chess Set",
    "Beautiful hand-carved wooden chess set from the 1960s. Complete with all pieces and original box.",
    75.00,
    "Games",
    "https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80",
    "sample-user-3",
    "VintageCollector",
    true
  ),
  createProduct(
    "product-12",
    "Pre-loved Plant Collection",
    "Set of 5 healthy houseplants in recycled ceramic pots. Includes care instructions and organic plant food.",
    65.95,
    "Garden",
    "https://images.unsplash.com/photo-1545165375-1b744b9ed444?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "sample-user-2",
    "GreenCrafter",
    true
  )
];