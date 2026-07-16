import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import type { CreateCampaignInput, UpdateCampaignInput } from "../types/campaign.types";

// ---- GET /api/campaigns ----
export async function getAllCampaigns(req: Request, res: Response) {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
}

// ---- GET /api/campaigns/:id ----
export async function getCampaignById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch campaign" });
  }
}

// ---- POST /api/campaigns ----
export async function createCampaign(req: Request, res: Response) {
  try {
    const { name, subject, body, recipients, scheduledDate } = req.body as CreateCampaignInput;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const newCampaign = await prisma.campaign.create({
      data: {
        name,
        subject,
        body,
        recipients: recipients ?? 0,
        // scheduledDate comes in as a string (e.g. "2026-07-20") —
        // Prisma's DateTime field needs a real JS Date object.
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      },
    });

    res.status(201).json(newCampaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create campaign" });
  }
}

// ---- PUT /api/campaigns/:id ----
export async function updateCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateCampaignInput;

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...updates,
        scheduledDate: updates.scheduledDate ? new Date(updates.scheduledDate) : undefined,
      },
    });

    res.json(updatedCampaign);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Campaign not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update campaign" });
  }
}

// ---- DELETE /api/campaigns/:id ----
export async function deleteCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await prisma.campaign.delete({ where: { id } });

    res.json({ message: "Campaign deleted", campaign: deleted });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Campaign not found" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to delete campaign" });
  }
}