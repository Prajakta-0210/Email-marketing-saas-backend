// The `Contact` shape itself now comes from Prisma — it auto-generates
// a TypeScript type from the `model Contact { ... }` block in
// prisma/schema.prisma. We don't hand-write it anymore (that's the
// whole point of an ORM: one source of truth for the shape of your data).
//
// We only keep the *input* types here — these describe what the
// client is allowed to send us, which is intentionally narrower than
// the full Contact (e.g. no id, no createdAt — the server controls those).

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  city?: string;
}

export interface UpdateContactInput {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  status?: "Subscribed" | "Unsubscribed" | "Bounced";
}