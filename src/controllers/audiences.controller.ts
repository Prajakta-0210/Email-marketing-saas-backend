import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import type { CreateAudienceInput, UpdateAudienceInput } from "../types/audience.types";

// ---- GET /api/audiences ----
export async function getAllAudiences(req: Request, res: Response) {
  try {
    const audiences = await prisma.audience.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json(audiences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch audiences" });
  }
}

// ---- GET /api/audiences/:id ----
export async function getAudienceById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const audience = await prisma.audience.findUnique({ where: { id } });

    if (!audience) {
      return res.status(404).json({ message: "Audience not found" });
    }

    res.json(audience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch audience" });
  }
}

// ---- POST /api/audiences ----
export async function createAudience(req: Request, res: Response) {
  try {
    const { name, description, filters, contactCount } = req.body as CreateAudienceInput;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const newAudience = await prisma.audience.create({
      data: {
        name,
        description,
        filters: filters ?? [],
        contactCount: contactCount ?? 0,
      },
    });

    res.status(201).json(newAudience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create audience" });
  }
}

// ---- PUT /api/audiences/:id ----
export async function updateAudience(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateAudienceInput;

    const updatedAudience = await prisma.audience.update({
      where: { id },
      data: updates,
    });

    res.json(updatedAudience);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Audience not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update audience" });
  }
}

// ---- DELETE /api/audiences/:id ----
export async function deleteAudience(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await prisma.audience.delete({ where: { id } });

    res.json({ message: "Audience deleted", audience: deleted });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Audience not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to delete audience" });
  }
}