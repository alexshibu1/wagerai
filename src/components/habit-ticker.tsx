export default function HabitTicker() {
  const habits = [
    'Morning Meditation ✓',
    'Workout Complete ✓',
    'Healthy Breakfast ✓',
    'Deep Work Block 1 ⚡',
    'Hydration Goal 💧',
    'Stand & Stretch ✓',
    'Learning Session 📚',
    'Evening Walk 🌙',
  ];

  // Double the array for seamless loop
  const displayHabits = [...habits, ...habits];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-t border-white/5">
      <div className="overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {displayHabits.map((habit, idx) => (
            <div
              key={idx}
              className="inline-flex items-center px-8 py-3 font-mono text-xs text-zinc-400"
            >
              {habit}
              <span className="mx-4 text-zinc-700">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
