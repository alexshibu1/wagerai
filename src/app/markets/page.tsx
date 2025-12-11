import { Suspense } from 'react';
import FloatingSidebar from "@/components/floating-sidebar";
import MarketsView from "@/components/markets-view";
import HabitTicker from "@/components/habit-ticker";

export default async function Markets() {
  return (
    <div className="min-h-screen bg-obsidian">
      <FloatingSidebar />
      {/* Main content with left padding for collapsed sidebar + top padding */}
      <main className="pl-24 pt-8">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-zinc-500 text-sm">Loading markets...</div>
          </div>
        }>
          <MarketsView />
        </Suspense>
        <HabitTicker />
      </main>
    </div>
  );
}
