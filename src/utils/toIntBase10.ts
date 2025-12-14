export function toIntBase10(value: string | null, defaultValue: number = 0): number {
  return Number.parseInt(value || String(defaultValue), 10);
}