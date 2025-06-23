"use client"
import Link from 'next/link';
import { Salad, History, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/lib/auth";
import { useEffect } from 'react';
import { setCookie, deleteCookie } from "cookies-next";
import {User} from "firebase/auth";

function useUserSession(initialUser: User | null) {
  useEffect(() => {
    return onIdTokenChanged(async (user: User | null) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}



// @ts-ignore
export default function Header({initialUser}) {
  const user = useUserSession(initialUser);

  // @ts-ignore
  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  // @ts-ignore
  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          <UtensilsCrossed size={28} />
          <span>Calorie Snap</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-1 sm:gap-2 text-foreground">
              <Salad size={20} />
              <span className="hidden sm:inline">Estimate</span>
              <span className="sm:hidden">Snap</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/history" className="flex items-center gap-1 sm:gap-2 text-foreground">
              <History size={20} />
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">Log</span>
            </Link>
          </Button>
          {user ? <Button variant="ghost" asChild>
            <Link href="#" onClick={handleSignOut} className="flex items-center gap-1 sm:gap-2 text-foreground">
              <History size={20} />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Sign Out</span>
            </Link>
          </Button> : <Button variant="ghost" asChild>
            <Link href="#" onClick={handleSignIn} className="flex items-center gap-1 sm:gap-2 text-foreground">
              <History size={20} />
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden">Sign In</span>
            </Link>
          </Button>}

        </nav>
      </div>
    </header>
  );
}