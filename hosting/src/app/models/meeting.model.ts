import { z } from 'zod';
import { UserEmail } from './user.model';

export const MeetingId = z.string().brand('MeetingId');
export type MeetingId = z.infer<typeof MeetingId>;
export const toMeetingId = (id: unknown) => MeetingId.parse(id);

export const MeetingName = z.string().min(5).max(100).brand('MeetingName');
export type MeetingName = z.infer<typeof MeetingName>;

export const MeetingOwners = z
  .array(UserEmail)
  .nonempty()
  // Ensure we have a distinct, case-insensitive list
  .transform((owners) =>
    Array.from(new Set(owners.map((owner) => owner.toLowerCase()))),
  )
  .brand('MeetingOwners');
export type MeetingOwners = z.infer<typeof MeetingOwners>;
export const toMeetingOwners = (o: unknown) => MeetingOwners.parse(o);

export const MeetingVoters = z
  .array(UserEmail)
  // Ensure we have a distinct, case-insensitive list
  .transform((owners) =>
    Array.from(new Set(owners.map((owner) => owner.toLowerCase()))),
  )
  .brand('MeetingVoters');
export type MeetingVoters = z.infer<typeof MeetingVoters>;

export const MeetingCreated = z.date().brand('MeetingCreated');
export type MeetingCreated = z.infer<typeof MeetingCreated>;
export const toMeetingCreated = () => MeetingCreated.parse(new Date());

export const MeetingTimestamp = z
  .object({
    nanoseconds: z.number().min(0),
    seconds: z.number().min(0),
  })
  .brand('MeetingTimestamp');
export type MeetingTimestamp = z.infer<typeof MeetingTimestamp>;

export const MeetingCreatedOrTimestamp = MeetingCreated.or(
  MeetingTimestamp.transform((timestamp) => new Date(timestamp.seconds * 1000)),
).brand('MeetingCreatedOrTimestamp');
export type MeetingCreatedOrTimestamp = z.infer<
  typeof MeetingCreatedOrTimestamp
>;

const MeetingBase = z.object({
  name: MeetingName,
  owners: MeetingOwners,
  voters: MeetingVoters,
  created: MeetingCreatedOrTimestamp,
});

export const Meeting = MeetingBase.brand('Meeting');
export type Meeting = z.infer<typeof Meeting>;
export const toMeeting = (m: unknown) => Meeting.parse(m);

export const NewMeeting = MeetingBase.partial()
  .extend({
    created: MeetingCreatedOrTimestamp.default(toMeetingCreated),
  })
  .brand('NewMeeting');
export type NewMeeting = z.infer<typeof NewMeeting>;
export const toNewMeeting = () => NewMeeting.parse({});

export const MeetingWithId = MeetingBase.extend({ id: MeetingId }).brand(
  'MeetingWithId',
);
export type MeetingWithId = z.infer<typeof MeetingWithId>;
export const toMeetingWithId = (m: unknown) => MeetingWithId.parse(m);

// Meeting types
//   - List of meetings (each item will have data + id)     --> MeetingWithId
//   - Meeting from DB (will have data, no id)              --> Meeting
//   - New meeting
//     - Initially (will have no/partial data, no id)       --> NewMeeting
//     - After validation (will have data, no id)           --> Meeting
