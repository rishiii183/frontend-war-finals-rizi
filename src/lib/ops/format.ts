export const MIN = 60_000;

export function fmtTime(ts: number) {
  const d = new Date(ts);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function fmtClock(ts: number) {
  const d = new Date(ts);
  return `${fmtTime(ts)}:${String(d.getUTCSeconds()).padStart(2, "0")}`;
}

export function fmtDelta(ms: number) {
  const m = Math.round(ms / MIN);
  const abs = Math.abs(m);
  const s = abs >= 60 ? `${Math.floor(abs / 60)}h ${abs % 60}m` : `${abs}m`;
  return m < 0 ? `-${s}` : `+${s}`;
}

export function fmtMoney(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
