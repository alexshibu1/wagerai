import FloatingSidebar from "@/components/floating-sidebar";
import MarketsView from "@/components/markets-view";
import HabitTicker from "@/components/habit-ticker";

export default async function Markets() {
  return (
    <div className="min-h-screen bg-obsidian">
      <FloatingSidebar />
      {/* Main content with left padding for collapsed sidebar + top padding */}
      <main className="pl-24 pt-8">
        <MarketsView />
        <HabitTicker />
      </main>
    </div>
  );
}
