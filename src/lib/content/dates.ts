const displayDateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC"
});

export function formatDisplayDate(date: Date): string {
  return displayDateFormatter.format(date);
}
