export function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">{kicker}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
    </div>
  );
}
