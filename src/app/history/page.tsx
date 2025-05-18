import MealHistoryClientPage from '@/components/calorie-snap/meal-history-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meal History - Calorie Snap',
  description: 'View your past meal entries and calorie counts.',
};

export default function HistoryPage() {
  return <MealHistoryClientPage />;
}