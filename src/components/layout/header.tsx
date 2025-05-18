import Link from 'next/link';
import { Salad, History, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          <UtensilsCrossed size={28} />
          <span>Calorie Snap</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-1 sm:gap-2 text-foreground hover:text-primary">
              <Salad size={20} />
              <span className="hidden sm:inline">Estimate</span>
              <span className="sm:hidden">Snap</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/history" className="flex items-center gap-1 sm:gap-2 text-foreground hover:text-primary">
              <History size={20} />
              <span className="hidden sm:inline">History</span>
              <span className="sm:hidden">Log</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}