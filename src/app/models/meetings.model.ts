import { z } from 'zod';

export const MeetingId = z.string().brand('MeetingId');
export type MeetingId = z.infer<typeof MeetingId>;

export const MeetingName = z.string().max(100).brand('MeetingName');
export type MeetingName = z.infer<typeof MeetingName>;

export const MeetingUser = z.string().email().brand('MeetingUser');
export type MeetingUser = z.infer<typeof MeetingUser>;

export const MeetingOwners = z
  .array(MeetingUser)
  .nonempty()
  // Ensure we have a distinct, case-insensitive list
  .transform((owners) =>
    Array.from(new Set(owners.map((owner) => owner.toLowerCase()))),
  )
  .brand('MeetingOwners');
export type MeetingOwners = z.infer<typeof MeetingOwners>;

export const MeetingVoters = z
  .array(MeetingUser)
  // Ensure we have a distinct, case-insensitive list
  .transform((owners) =>
    Array.from(new Set(owners.map((owner) => owner.toLowerCase()))),
  )
  .brand('MeetingVoters');
export type MeetingVoters = z.infer<typeof MeetingVoters>;

export const MeetingCreated = z.date().brand('MeetingCreated');
export type MeetingCreated = z.infer<typeof MeetingCreated>;

export const MeetingTimestamp = z
  .object({
    nanoseconds: z.number().min(0),
    seconds: z.number().min(0),
  })
  .brand('MeetingTimestamp');
export type MeetingTimestamp = z.infer<typeof MeetingTimestamp>;

export const Meeting = z
  .object({
    id: MeetingId,
    name: MeetingName,
    owners: MeetingOwners,
    voters: MeetingVoters,
    created: MeetingCreated.or(
      MeetingTimestamp.transform(
        (timestamp) => new Date(timestamp.seconds * 1000),
      ),
    ),
  })
  .brand('Meeting');
export type Meeting = z.infer<typeof Meeting>;

export const NewMeeting = z
  .object({
    name: MeetingName,
    owners: MeetingOwners,
    voters: MeetingVoters,
    created: MeetingCreated.default(() => new Date()),
  })
  .brand('NewMeeting');
export type NewMeeting = z.infer<typeof NewMeeting>;
