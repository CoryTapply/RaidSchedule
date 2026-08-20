/**
 * Shapes below are verified against a live GET /api/v4/users/{APIKEY}/events
 * response (602 events / 732 sign-ups inspected), not just the documented
 * schema. Confirmed live: no status/roster/"comp" field and no difficulty
 * field anywhere. The documented field is `closingTime`; the real field is
 * `closeTime` — kept as `closeTime` here to match reality.
 *
 * Important real-world quirk: `className` is not always a WoW class. It's
 * whatever label the raid leader configured as a sign-up option for that
 * event's template, so it can also be a role ("Tank") or an attendance
 * marker ("Absence", "Tentative") — see normalize.ts for how each is
 * handled. Treat this file as the one place to update if a live response
 * turns out to carry further quirks.
 */

export interface RawRaidHelperSignUp {
  name: string;
  id: number;
  userId: string;
  className: string;
  specName: string;
  spec2Name?: string;
  spec3Name?: string;
  entryTime: number;
}

export interface RawRaidHelperEvent {
  id: string;
  channelId: string;
  leaderId: string;
  leaderName: string;
  title: string;
  description: string;
  /** Unix seconds. */
  startTime: number;
  /** Unix seconds. */
  endTime: number;
  /** Unix seconds. */
  closeTime: number;
  templateId: string;
  color: string;
  imageUrl?: string;
  softresId?: string;
  /** Unix seconds. */
  lastUpdated: number;
  /** String-encoded count, e.g. "11". Not currently surfaced in the UI. */
  signUpCount?: string;
  signUps: RawRaidHelperSignUp[];
}
