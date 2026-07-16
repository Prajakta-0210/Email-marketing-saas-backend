import type { Contact } from "../types/contact.types";

// TEMPORARY: a plain array standing in for a database table.
// This resets every time the server restarts — that's expected.
// Once we add Prisma + PostgreSQL, this whole file gets deleted
// and controllers will query the real database instead.
//
// Fiber/Go comparison: this is like keeping a package-level
// []Contact slice before you've wired up a real database driver.
export const contacts: Contact[] = [
  {
    id: "ct_001",
    name: "Liam Carter",
    email: "liam.carter@example.com",
    phone: "+1 415 555 0132",
    city: "San Francisco",
    status: "Subscribed",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "ct_002",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    phone: "+1 212 555 0198",
    city: "New York",
    status: "Subscribed",
    createdAt: "2026-05-03T00:00:00.000Z",
  },
  {
    id: "ct_003",
    name: "Noah Bennett",
    email: "noah.bennett@example.com",
    phone: "+44 20 7946 0958",
    city: "London",
    status: "Unsubscribed",
    createdAt: "2026-05-06T00:00:00.000Z",
  },
];
