export interface FoodItem {
  id: string; // Client-side unique ID for list management
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface StoredMeal {
  id: string; // Unique ID for the meal entry
  date: string; // ISO string
  photoDataUri?: string; // Optional, if user wants to save space
  foodItems: FoodItem[];
  totalCalories: number;
}
export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Add any other properties you might need from the user object
  // but keep it minimal to avoid unnecessary data transfer
}