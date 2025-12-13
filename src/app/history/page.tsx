import type { Metadata } from 'next';
import { UserSession } from '@/lib/types';
export const metadata: Metadata = {
  title: 'Meal History - Calorie Snap',
  description: 'View your past meal entries and calorie counts.',
};
// src/app/history/page.tsx
import MealHistoryClientPage from "@/components/calorie-snap/meal-history-client";
import { getAuthenticatedAppForUser } from "@/lib/serverApp";
import { Suspense } from "react";
import { History } from "lucide-react";

// This is a Server Component that fetches the initial user data
export default async function HistoryPage() {
  // Get the user on the server during the initial page load
  const { currentUser } = await getAuthenticatedAppForUser();

    // Transform the firebase-admin UserRecord into our simplified UserSession type
    const initialUserSession: UserSession | null = currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
    } : null;

  return (
      // Suspense is a good practice for when client components are loading
      <Suspense fallback={<LoadingState />}>
        {/* Pass the initial user data to the client component as a prop */}
        <MealHistoryClientPage initialUser={initialUserSession ?? null} />
      </Suspense>
  );
}

// A simple loading component for the Suspense boundary
function LoadingState() {
  return (
      <div className="text-center py-10">
        <History size={48} className="mx-auto mb-4 text-primary animate-pulse" />
        <p className="text-lg text-muted-foreground">Loading your meal history...</p>
      </div>
  );
}