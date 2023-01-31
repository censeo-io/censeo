import { z } from 'zod';

export const MeetingId = z.string().brand('MeetingId');
export type MeetingId = z.infer<typeof MeetingId>;

export const MeetingName = z.string().max(100).brand('MeetingName');
export type MeetingName = z.infer<typeof MeetingName>;

export const MeetingOwner = z.string().email().brand('MeetingOwner');
export type MeetingOwner = z.infer<typeof MeetingOwner>;

export const MeetingOwners = z
  .array(MeetingOwner)
  .nonempty()
  // Ensure we have a distinct, case-insensitive list
  .transform((owners) =>
    Array.from(new Set(owners.map((owner) => owner.toLowerCase()))),
  )
  .brand('MeetingOwners');
export type MeetingOwners = z.infer<typeof MeetingOwners>;

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
    created: MeetingCreated.default(() => new Date()),
  })
  .brand('NewMeeting');
export type NewMeeting = z.infer<typeof NewMeeting>;
