"use client";

import type { StoredMeal } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CalendarDays, Flame, ListChecks, Utensils } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '../ui/button';

interface MealHistoryItemProps {
  meal: StoredMeal;
  onDelete: (mealId: string) => void;
}

export default function MealHistoryItem({ meal, onDelete }: MealHistoryItemProps) {
  const mealDate = new Date(meal.date);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row justify-between items-start pb-3">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Utensils size={22} className="text-primary" />
            Meal on {mealDate.toLocaleDateString()}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm">
            <CalendarDays size={16} className="text-muted-foreground" />
            {mealDate.toLocaleTimeString()}
          </CardDescription>
        </div>
        {meal.photoDataUri && (
          <Image
            src={meal.photoDataUri}
            alt="Meal photo"
            width={80}
            height={80}
            className="rounded-md object-cover border border-border"
            data-ai-hint="food meal"
          />
        )}
         {!meal.photoDataUri && (
          <Image
            src="https://placehold.co/80x80.png"
            alt="Meal placeholder"
            width={80}
            height={80}
            className="rounded-md object-cover border border-border"
            data-ai-hint="food plate"
          />
        )}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-start gap-2 mb-3 text-lg">
          <Flame size={20} className="text-accent" />
          <span className="font-semibold">{meal.totalCalories.toFixed(0)} kcal</span>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm hover:no-underline py-2">
                <div className="flex items-center gap-1">
                    <ListChecks size={18} className="text-muted-foreground" />
                    View {meal.foodItems.length} Food Item(s)
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-0">
              <ul className="space-y-1 text-sm max-h-48 overflow-y-auto pr-2">
                {meal.foodItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-1.5 bg-muted/30 rounded-sm">
                    <span>{item.name} ({item.quantity})</span>
                    <span className="font-medium">{item.calories.toFixed(0)} kcal</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" size="sm" onClick={() => onDelete(meal.id)} className="w-full">
          Delete Entry
        </Button>
      </CardFooter>
    </Card>
  );
}