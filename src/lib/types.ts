export interface FoodItem {
  id: string; // Client-side unique ID for list management
  name: string;
  quantity: string;
  calories: number;
}

export interface StoredMeal {
  id: string; // Unique ID for the meal entry
  date: string; // ISO string
  photoDataUri?: string; // Optional, if user wants to save space
  foodItems: FoodItem[];
  totalCalories: number;
  // Future extension:
  // proteinGrams?: number;
  // carbsGrams?: number;
  // fatGrams?: number;
}
