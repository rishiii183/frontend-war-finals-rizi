import { format } from "date-fns";

export const MIN = 60_000;

export function fmtTime(ts: number) {
  return format(new Date(ts), "HH:mm");
}

export function fmtClock(ts: number) {
  return format(new Date(ts), "HH:mm:ss");
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
