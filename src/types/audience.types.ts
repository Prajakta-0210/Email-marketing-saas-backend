export interface CreateAudienceInput {
  name: string;
  description?: string;
  filters?: string[];
  contactCount?: number;
}

export interface UpdateAudienceInput {
  name?: string;
  description?: string;
  filters?: string[];
  contactCount?: number;
}