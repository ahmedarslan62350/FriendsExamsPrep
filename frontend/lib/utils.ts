export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (!hours) {
    return `${mins}m`;
  }

  if (!mins) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

export function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}
