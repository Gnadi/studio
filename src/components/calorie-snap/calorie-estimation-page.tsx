"use client";

import { useState } from 'react';
import type { FoodItem, StoredMeal } from '@/lib/types';
import PhotoUploadForm from './photo-upload-form';
import FoodListEditor from './food-list-editor';
import CalorieSummary from './calorie-summary';
import { estimateCaloriesFromPhoto, type EstimateCaloriesFromPhotoOutput } from '@/ai/flows/estimate-calories-from-photo';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const MEAL_HISTORY_KEY = 'calorieSnapHistory';

export default function CalorieEstimationClientPage() {
  const [currentPhotoDataUri, setCurrentPhotoDataUri] = useState<string | null>(null);
  const [estimatedFoodItems, setEstimatedFoodItems] = useState<FoodItem[]>([]);
  const [totalEstimatedCalories, setTotalEstimatedCalories] = useState<number>(0);
  
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationError, setEstimationError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePhotoEstimate = async (photoDataUri: string) => {
    setIsEstimating(true);
    setEstimationError(null);
    setCurrentPhotoDataUri(photoDataUri);
    setEstimatedFoodItems([]); // Clear previous items
    setTotalEstimatedCalories(0);

    try {
      const result: EstimateCaloriesFromPhotoOutput = await estimateCaloriesFromPhoto({ photoDataUri });
      if (result && result.foodItems) {
        const itemsWithClientIds = result.foodItems.map(item => ({
          ...item,
          id: crypto.randomUUID(),
        }));
        setEstimatedFoodItems(itemsWithClientIds);
        setTotalEstimatedCalories(result.totalCalories || 0);
        toast({
          title: "Estimation Complete!",
          description: `Found ${result.foodItems.length} items. Total: ${result.totalCalories.toFixed(0)} kcal.`,
          variant: "default",
        });
      } else {
        throw new Error("AI response was not in the expected format.");
      }
    } catch (error) {
      console.error("Error estimating calories:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during estimation.";
      setEstimationError(errorMessage);
      toast({
        title: "Estimation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  const handleFoodItemsChange = (updatedItems: FoodItem[]) => {
    setEstimatedFoodItems(updatedItems);
    const newTotalCalories = updatedItems.reduce((sum, item) => sum + (item.calories || 0), 0);
    setTotalEstimatedCalories(newTotalCalories);
  };

  const handleSaveMeal = () => {
    if (estimatedFoodItems.length === 0) {
      toast({
        title: "Cannot Save Empty Meal",
        description: "Please add some food items before saving.",
        variant: "destructive",
      });
      return;
    }

    const newMeal: StoredMeal = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      photoDataUri: currentPhotoDataUri || undefined,
      foodItems: estimatedFoodItems,
      totalCalories: totalEstimatedCalories,
    };

    try {
      const historyString = localStorage.getItem(MEAL_HISTORY_KEY);
      const history: StoredMeal[] = historyString ? JSON.parse(historyString) : [];
      history.unshift(newMeal); // Add to the beginning of the list
      localStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(history));
      toast({
        title: "Meal Saved!",
        description: `"${newMeal.foodItems[0]?.name || 'Meal'}" added to your history.`,
      });
      // Optionally reset form after save
      // setCurrentPhotoDataUri(null);
      // setEstimatedFoodItems([]);
      // setTotalEstimatedCalories(0);
    } catch (error) {
      console.error("Failed to save meal to localStorage:", error);
      toast({
        title: "Save Failed",
        description: "Could not save meal to local history.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <PhotoUploadForm 
        onEstimate={handlePhotoEstimate} 
        isEstimating={isEstimating}
        estimationError={estimationError}
      />

      {(estimatedFoodItems.length > 0 || currentPhotoDataUri) && !isEstimating && (
        <>
           <CalorieSummary 
            foodItems={estimatedFoodItems} 
            totalCalories={totalEstimatedCalories} 
          />
          <Separator />
          <FoodListEditor
            foodItems={estimatedFoodItems}
            onFoodItemsChange={handleFoodItemsChange}
            onSaveMeal={handleSaveMeal}
            photoDataUri={currentPhotoDataUri}
          />
        </>
      )}
      
      {isEstimating && !estimationError && ( // Show a general loading message if estimating but no specific items yet
         <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">Analyzing your meal, please wait...</p>
        </div>
      )}

      {!currentPhotoDataUri && !isEstimating && (
        <div className="text-center py-10 border-2 border-dashed border-border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold text-primary mb-2">Welcome to Calorie Snap!</h2>
          <p className="text-muted-foreground">Upload a photo of your meal to get started.</p>
        </div>
      )}
    </div>
  );
}