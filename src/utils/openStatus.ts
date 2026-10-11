/**
 * Determines whether La Cucina Povera is currently open.
 *
 * Schedule:
 *   - Wednesday & Thursday: 19:00 – 22:00 every week
 *   - Friday, Saturday, Sunday: 17:00 – 22:00 on alternate (open) weekends
 *
 * Anchor: the weekend of 11–13 Oct 2025 is an OPEN weekend.
 * Every subsequent weekend alternates: closed → open → closed → …
 *
 * Override:
 *   "auto"   – use the schedule (default)
 *   "open"   – force open regardless of schedule
 *   "closed" – force closed regardless of schedule
 */

// Friday of the anchor open weekend (11 Oct 2025 is a Saturday, so anchor Friday = 10 Oct 2025)
// We use the ISO week containing 11 Oct 2025 — specifically we tag by the Friday of that week.
const ANCHOR_FRIDAY = new Date('2025-10-10T00:00:00'); // Fri 10 Oct 2025

/**
 * Returns the Friday of the week containing `date` (Mon–Sun week, but
 * we only care about Fri/Sat/Sun so Friday is our anchor day-of-week).
 */
function fridayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun,1=Mon,...,5=Fri,6=Sat
  // Distance back to Friday: Sun→-2 days (or +5), Sat→-1, Fri→0, Mon→4, …
  const daysToFriday = day === 0 ? -2 : day === 6 ? -1 : day - 5;
  d.setDate(d.getDate() + daysToFriday);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns true if the weekend containing `date` is an open weekend.
 */
function isOpenWeekend(date: Date): boolean {
  const thisFriday = fridayOf(date);
  const anchorFriday = new Date(ANCHOR_FRIDAY);
  anchorFriday.setHours(0, 0, 0, 0);
  const weeksDiff = Math.round(
    (thisFriday.getTime() - anchorFriday.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  // Use ((n % 2) + 2) % 2 to handle negative weeksDiff correctly
  return ((weeksDiff % 2) + 2) % 2 === 0; // even = open (anchor is week 0)
}

export function computeIsOpen(
  now: Date,
  override: string
): boolean {
  if (override === 'open') return true;
  if (override === 'closed') return false;

  const day = now.getDay();   // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
  const h = now.getHours();
  const m = now.getMinutes();
  const timeMinutes = h * 60 + m;

  const open19  = 19 * 60;  // 7 pm
  const open17  = 17 * 60;  // 5 pm
  const close22 = 22 * 60;  // 10 pm

  // Wednesday & Thursday: 19:00 – 22:00
  if (day === 3 || day === 4) {
    return timeMinutes >= open19 && timeMinutes < close22;
  }

  // Friday, Saturday, Sunday: 17:00 – 22:00 on open weekends
  if (day === 5 || day === 6 || day === 0) {
    if (!isOpenWeekend(now)) return false;
    return timeMinutes >= open17 && timeMinutes < close22;
  }

  return false;
}
