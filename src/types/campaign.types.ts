export interface CreateCampaignInput {
  name: string;
  subject?: string;
  body?: string;
  recipients?: number;
  scheduledDate?: string; // ISO date string from the client
}

export interface UpdateCampaignInput {
  name?: string;
  subject?: string;
  body?: string;
  status?: "Draft" | "Scheduled" | "Sending" | "Sent" | "Paused";
  recipients?: number;
  sent?: number;
  openRate?: number;
  clickRate?: number;
  scheduledDate?: string;
}