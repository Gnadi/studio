"use client";

import { useState, useEffect } from 'react';
import {StoredMeal, UserSession} from '@/lib/types';
import { getMealHistory, deleteMealFromHistory, clearAllMealHistory } from '@/lib/firestore';
import MealHistoryItem from './meal-history-item';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, History, UserX } from 'lucide-react';
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

// This component now accepts the initial user state as a prop
export default function MealHistoryClientPage({ initialUser }: { initialUser: UserSession | null }) {
  const [mealHistory, setMealHistory] = useState<StoredMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // For this component, we can just use the initialUser prop.
  // The header's useUserSession hook handles re-authentication and reloads the page,
  // which will provide this component with the updated user state.
  const user = initialUser;

  // This useEffect handles fetching data when the component mounts.
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // 1. USER IS LOGGED IN: Fetch from Firestore
          console.log(`Fetching history for user: ${user.uid}`);
          const firestoreHistory = await getMealHistory(user.uid);
          setMealHistory(firestoreHistory as StoredMeal[]);
        } else {
          // 2. USER IS LOGGED OUT: Use localStorage
          console.log("Fetching history from localStorage.");
          const MEAL_HISTORY_KEY = 'calorieSnapHistory';
          const storedHistory = localStorage.getItem(MEAL_HISTORY_KEY);
          if (storedHistory) {
            setMealHistory(JSON.parse(storedHistory));
          } else {
            setMealHistory([]); // Clear history if nothing in localStorage
          }
        }
      } catch (error) {
        console.error("Error loading meal history:", error);
        toast({
          title: "Error Loading History",
          description: "Could not load your meal history. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user, toast]); // Re-run this effect if the user object changes

  const handleDeleteMeal = async (mealId: string) => {
    const updatedHistory = mealHistory.filter(meal => meal.id !== mealId);
    setMealHistory(updatedHistory); // Optimistically update the UI

    try {
      if (user) {
        await deleteMealFromHistory(user.uid, mealId);
      } else {
        localStorage.setItem('calorieSnapHistory', JSON.stringify(updatedHistory));
      }
      toast({ title: "Meal Deleted", description: "The meal entry has been removed." });
    } catch (error) {
      setMealHistory(mealHistory); // Revert UI on failure
      toast({ title: "Error Deleting Meal", variant: "destructive" });
    }
  };

  const handleClearAllHistory = async () => {
    const originalHistory = [...mealHistory];
    setMealHistory([]); // Optimistically update UI

    try {
      if (user) {
        await clearAllMealHistory(user.uid);
      } else {
        localStorage.removeItem('calorieSnapHistory');
      }
      toast({ title: "History Cleared", description: "All meal entries have been removed." });
    } catch (error) {
      setMealHistory(originalHistory); // Revert UI on failure
      toast({ title: "Error Clearing History", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <LoadingState />;
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
              {user ? (
                  <>
                    <AlertTriangle size={64} className="mx-auto mb-6 text-accent" />
                    <h2 className="text-2xl font-semibold text-foreground mb-2">No Meals Recorded Yet</h2>
                    <p className="text-muted-foreground">
                      Start snapping photos of your meals on the Estimate page to build your history.
                    </p>
                  </>
              ) : (
                  <>
                    <UserX size={64} className="mx-auto mb-6 text-accent" />
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Sign In to See Your History</h2>
                    <p className="text-muted-foreground">
                      Your meal history is saved to your account. Sign in to view it.
                    </p>
                  </>
              )}
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

function LoadingState() {
  return (
      <div className="text-center py-10">
        <History size={48} className="mx-auto mb-4 text-primary animate-pulse" />
        <p className="text-lg text-muted-foreground">Loading your meal history...</p>
      </div>
  );
}