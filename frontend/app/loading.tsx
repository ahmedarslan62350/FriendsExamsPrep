export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel rounded-[32px] p-10 text-center">
        <div className="mx-auto size-14 animate-pulse rounded-full bg-[linear-gradient(135deg,#8B71FF_0%,#22D3EE_100%)]" />
        <h2 className="mt-6 text-2xl font-bold text-white">Booting the competition...</h2>
        <p className="mt-3 text-sm text-slate-400">Loading rankings, streaks, targets, and all the social pressure.</p>
      </div>
    </div>
  );
}
