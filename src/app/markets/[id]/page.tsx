import Link from "next/link";

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  const marketId = decodeURIComponent(params.id);

  return (
    <div className="min-h-screen bg-obsidian px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/markets"
          className="inline-flex items-center text-sm text-emerald-300 hover:text-emerald-200 transition"
        >
          ← Back to markets
        </Link>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">Market Detail</p>
          <h1 className="text-3xl font-bold text-white">{marketId}</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Placeholder detail view. Wire this up to real market data, order books, and trades when available.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
          <p className="text-white font-semibold">What’s next</p>
          <ul className="list-disc list-inside text-zinc-300 text-sm space-y-1">
            <li>Pull live odds, volume, and settlement timeline.</li>
            <li>Add an order book or simple buy/sell buttons.</li>
            <li>Surface related markets and your position (if any).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

