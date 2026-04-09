export function ordinalSuffix(d: number): string {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
}

export function formatDate(date: Date = new Date()): string {
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = date.getDate();
  return `${M[date.getMonth()]} ${String(d).padStart(2,"0")}${ordinalSuffix(d)}, ${date.getFullYear()}`;
}
