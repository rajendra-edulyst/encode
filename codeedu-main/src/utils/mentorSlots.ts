/**
 * Normalizes API `slot_available` (count or legacy 0/1) from mentor + list/rating rows.
 */
export function getMentorAvailableSlotCount(
  mentor?: { slot_available?: number | string | null },
  mentorRating?: { slot_available?: number | string | null } | null,
): number {
  const parse = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  };
  return Math.max(parse(mentor?.slot_available), parse(mentorRating?.slot_available));
}

export function mentorHasAvailableSlots(
  mentor?: { slot_available?: number | string | null },
  mentorRating?: { slot_available?: number | string | null } | null,
): boolean {
  return getMentorAvailableSlotCount(mentor, mentorRating) > 0;
}
