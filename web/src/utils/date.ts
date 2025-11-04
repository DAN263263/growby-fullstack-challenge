/** convierte distintos formatos a Date o null (soporta ISO, "YYYY-MM-DDTHH:mm", epoch en s/ms) */

export function parseToDate(val: string | number | null | undefined): Date | null {
  if (val == null) return null;
  if (typeof val === "number") {
    const ms = val > 1e12 ? val : val * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === "string") {
    const tries = [val, val.replace(" ", "T")];
    for (const t of tries) {
      const d = new Date(t);
      if (!isNaN(d.getTime())) return d;
    }
    const n = Number(val);
    if (!isNaN(n)) {
      const ms = n > 1e12 ? n : n * 1000;
      const d2 = new Date(ms);
      return isNaN(d2.getTime()) ? null : d2;
    }
  }
  return null;
}
export function formatDateSafe(val: string | number | null | undefined): string {
  const d = parseToDate(val);
  return d ? d.toLocaleString() : "Invalid date";
}