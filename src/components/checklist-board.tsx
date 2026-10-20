"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "hk-trip-checklist-v1";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: string[] } = { raw: null, value: EMPTY };

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw !== cache.raw) cache = { raw, value: raw ? (JSON.parse(raw) as string[]) : EMPTY };
    return cache.value;
  } catch {
    return cache.value;
  }
}

function write(next: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    cache = { raw: JSON.stringify(next), value: next };
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function ChecklistBoard({ groups, clearLabel, localOnly }: { groups: { id: string; title: string; items: readonly string[] }[]; clearLabel: string; localOnly: string }) {
  const done = useSyncExternalStore(subscribe, read, () => EMPTY);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const doneCount = groups.reduce((n, g) => n + g.items.filter((_, i) => done.includes(`${g.id}:${i}`)).length, 0);

  const toggle = useCallback(
    (id: string) => write(done.includes(id) ? done.filter((d) => d !== id) : [...done, id]),
    [done],
  );

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${(doneCount / total) * 100}%` }} />
        </div>
        <span className="text-sm font-semibold tabular-nums">
          {doneCount}/{total}
        </span>
        {doneCount ? (
          <button type="button" onClick={() => write([])} className="text-xs text-muted underline-offset-2 hover:underline">
            {clearLabel}
          </button>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((g) => (
          <section key={g.id} className="rounded-2xl border border-line bg-card p-4">
            <h2 className="mb-2 font-display text-lg font-semibold">{g.title}</h2>
            <ul className="space-y-1">
              {g.items.map((item, i) => {
                const id = `${g.id}:${i}`;
                const checked = done.includes(id);
                return (
                  <li key={id}>
                    <label className="flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-paper">
                      <input type="checkbox" checked={checked} onChange={() => toggle(id)} className="mt-1 h-4 w-4 shrink-0 accent-teal" />
                      <span className={`text-[15px] leading-relaxed ${checked ? "text-muted line-through" : ""}`}>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{localOnly}</p>
    </>
  );
}
