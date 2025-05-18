"use client";

import type { FoodItem, StoredMeal } from '@/lib/types';
import FoodItemCard from './food-item-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FoodListEditorProps {
  foodItems: FoodItem[];
  onFoodItemsChange: (items: FoodItem[]) => void;
  onSaveMeal: () => void;
  photoDataUri?: string | null;
}

export default function FoodListEditor({ foodItems, onFoodItemsChange, onSaveMeal, photoDataUri }: FoodListEditorProps) {
  
  const handleUpdateItem = (updatedItem: FoodItem) => {
    onFoodItemsChange(foodItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleRemoveItem = (itemId: string) => {
    onFoodItemsChange(foodItems.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      name: '',
      quantity: '',
      calories: 0,
    };
    onFoodItemsChange([...foodItems, newItem]);
    // Note: The new item card will be in edit mode by default due to isEditingInitially in FoodItemCard
    // We might need to scroll to this new item.
  };

  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-primary">Edit Food Items</CardTitle>
          <Button onClick={handleAddItem} variant="outline">
            <PlusCircle size={20} className="mr-2" /> Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {foodItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No food items identified. Add items manually.</p>
        ) : (
          <ScrollArea className="h-[400px] pr-3"> {/* Added pr-3 for scrollbar space */}
            <div className="space-y-3">
              {foodItems.map(item => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdateItem}
                  onRemove={handleRemoveItem}
                  isEditingInitially={!item.name && !item.quantity && item.calories === 0} // Edit new items immediately
                />
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Total Estimated Calories:</h3>
            <p className="text-2xl font-bold text-primary">{totalCalories.toFixed(0)} kcal</p>
          </div>
          <Button onClick={onSaveMeal} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={foodItems.length === 0}>
            <Save size={20} className="mr-2" /> Save Meal to History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}