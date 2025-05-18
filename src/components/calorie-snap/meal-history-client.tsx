"use client";

import { useState, useEffect } from 'react';
import type { StoredMeal } from '@/lib/types';
import MealHistoryItem from './meal-history-item';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, History } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

const MEAL_HISTORY_KEY = 'calorieSnapHistory';

export default function MealHistoryClientPage() {
  const [mealHistory, setMealHistory] = useState<StoredMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(MEAL_HISTORY_KEY);
      if (storedHistory) {
        setMealHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error loading meal history from localStorage:", error);
      toast({
        title: "Error Loading History",
        description: "Could not load meal history. Your browser's local storage might be disabled or full.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const handleDeleteMeal = (mealId: string) => {
    const updatedHistory = mealHistory.filter(meal => meal.id !== mealId);
    setMealHistory(updatedHistory);
    localStorage.setItem(MEAL_HISTORY_KEY, JSON.stringify(updatedHistory));
    toast({
      title: "Meal Deleted",
      description: "The meal entry has been removed from your history.",
    });
  };

  const handleClearAllHistory = () => {
    setMealHistory([]);
    localStorage.removeItem(MEAL_HISTORY_KEY);
    toast({
      title: "History Cleared",
      description: "All meal entries have been removed.",
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <History size={48} className="mx-auto mb-4 text-primary animate-pulse" />
        <p className="text-lg text-muted-foreground">Loading your meal history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <History size={32} />
          Meal History
        </h1>
        {mealHistory.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 size={18} className="mr-2" /> Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your meal history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllHistory}>
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {mealHistory.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-card">
          <AlertTriangle size={64} className="mx-auto mb-6 text-accent" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Meals Recorded Yet</h2>
          <p className="text-muted-foreground">
            Start snapping photos of your meals on the Estimate page to build your history.
          </p>
          <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <a href="/">Estimate Calories</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealHistory.map(meal => (
            <MealHistoryItem key={meal.id} meal={meal} onDelete={handleDeleteMeal} />
          ))}
        </div>
      )}
    </div>
  );
}