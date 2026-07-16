import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import type { CreateContactInput, UpdateContactInput } from "../types/contact.types";

// ---- GET /api/contacts ----
// Every Prisma query returns a Promise, so every handler is now async.
// This is the same shift you'd make in Fiber going from an in-memory
// slice to a real *sql.DB / gorm.DB call — the handler signature stays
// the same, but you now `await` (or in Go, check `err`) around the call.
export async function getAllContacts(req: Request, res: Response) {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
}

// ---- GET /api/contacts/:id ----
export async function getContactById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const contact = await prisma.contact.findUnique({ where: { id } });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contact" });
  }
}

// ---- POST /api/contacts ----
export async function createContact(req: Request, res: Response) {
  try {
    const { name, email, phone, city } = req.body as CreateContactInput;

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const newContact = await prisma.contact.create({
      data: { name, email, phone, city },
    });

    res.status(201).json(newContact);
  } catch (err) {
    // Prisma throws a typed error with code "P2002" when a @unique
    // constraint is violated — here, a duplicate email.
    // This is the same idea as checking for a unique-index violation
    // error code in Go's database/sql or a Mongo E11000 error.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(409).json({ message: "A contact with this email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create contact" });
  }
}

// ---- PUT /api/contacts/:id ----
export async function updateContact(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateContactInput;

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: updates,
    });

    res.json(updatedContact);
  } catch (err) {
    // Prisma throws "P2025" when the record to update doesn't exist —
    // we translate that into a proper 404 instead of a 500.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Contact not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update contact" });
  }
}

// ---- DELETE /api/contacts/:id ----
export async function deleteContact(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await prisma.contact.delete({ where: { id } });

    res.json({ message: "Contact deleted", contact: deleted });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Contact not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to delete contact" });
  }
}