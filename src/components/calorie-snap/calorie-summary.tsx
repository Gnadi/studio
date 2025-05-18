"use client";

import type { FoodItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, PieChart, CookingPot } from 'lucide-react';

interface CalorieSummaryProps {
  foodItems: FoodItem[];
  totalCalories: number;
}

export default function CalorieSummary({ foodItems, totalCalories }: CalorieSummaryProps) {
  // Macronutrients are not provided by the current AI. This is a placeholder.
  // In a real app, this would be calculated or fetched.
  const estimatedProtein = "--";
  const estimatedCarbs = "--";
  const estimatedFats = "--";

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <CookingPot size={28} />
          Meal Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 bg-primary/10 rounded-lg text-center shadow-inner">
          <Flame size={48} className="mx-auto text-accent mb-2" />
          <p className="text-sm text-muted-foreground">Total Estimated Calories</p>
          <p className="text-5xl font-bold text-primary">
            {totalCalories > 0 ? totalCalories.toFixed(0) : '--'}
            <span className="text-2xl"> kcal</span>
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <PieChart size={22} className="text-primary" />
            Macronutrient Breakdown (Approx.)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium text-foreground">Protein</p>
              <p className="text-2xl font-semibold text-primary-foreground">{estimatedProtein} g</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium text-foreground">Carbs</p>
              <p className="text-2xl font-semibold text-primary-foreground">{estimatedCarbs} g</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm font-medium text-foreground">Fats</p>
              <p className="text-2xl font-semibold text-primary-foreground">{estimatedFats} g</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic mt-3 text-center">
            Note: Detailed macronutrient breakdown is an illustrative placeholder.
          </p>
        </div>
        
        {foodItems.length > 0 && (
          <div className="border-t border-border pt-4">
            <h4 className="font-semibold text-lg mb-2">Identified Items:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 max-h-40 overflow-y-auto pr-2">
              {foodItems.map(item => (
                <li key={item.id}>
                  {item.name} ({item.quantity}): {item.calories.toFixed(0)} kcal
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}