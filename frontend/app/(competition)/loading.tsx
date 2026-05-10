export default function CompetitionLoading() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-panel h-36 animate-pulse rounded-[28px] bg-white/6" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-panel h-[420px] animate-pulse rounded-[28px] bg-white/6" />
        <div className="glass-panel h-[420px] animate-pulse rounded-[28px] bg-white/6" />
      </div>
    </div>
  );
}
