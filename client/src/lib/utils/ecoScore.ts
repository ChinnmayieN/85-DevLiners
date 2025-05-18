/**
 * Calculate an eco score (0-100) for a product based on its category
 * and potential environmental impact.
 * 
 * Higher score = More sustainable/eco-friendly
 */
export function calculateEcoScore(category: string): number {
  // Base scores by category (these could be more sophisticated in a real app)
  const baseCategoryScores: Record<string, number> = {
    'Clothing': 85,
    'Furniture': 92,
    'Electronics': 78,
    'Books': 88,
    'Home & Garden': 82,
    'Toys & Games': 80,
    'Sports Equipment': 83,
    'Art & Collectibles': 90,
    'Jewelry & Accessories': 86
  };

  // Default score if category not found
  const baseScore = baseCategoryScores[category] || 75;
  
  // Add some randomness to make scores vary slightly
  const randomVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
  
  // Ensure the score is between 50 and 100
  let finalScore = baseScore + randomVariation;
  if (finalScore < 50) finalScore = 50;
  if (finalScore > 100) finalScore = 100;
  
  return finalScore;
}
