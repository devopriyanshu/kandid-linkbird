// hooks/useLeads.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  company: string | null;
  status: "Pending" | "Contacted" | "Responded" | "Converted";
  lastContactDate: string | null;
  interactionHistory: string | null;
  createdAt: string;
  updatedAt: string;
  campaignId: number;
  campaignName: string;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LeadsFilters {
  search?: string;
  status?: string;
  campaign?: string;
  page?: number;
  limit?: number;
}

const fetchLeads = async (
  filters: LeadsFilters = {}
): Promise<LeadsResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.campaign) params.set("campaign", filters.campaign);
  if (filters.page) params.set("page", filters.page.toString());
  if (filters.limit) params.set("limit", filters.limit.toString());

  const response = await fetch(`/api/leads?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
};

const createLead = async (
  leadData: Partial<Lead>
): Promise<{ success: boolean; data: Lead }> => {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    throw new Error("Failed to create lead");
  }

  return response.json();
};

const updateLead = async (
  leadData: Partial<Lead> & { id: number }
): Promise<{ success: boolean; data: Lead }> => {
  const response = await fetch("/api/leads", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    throw new Error("Failed to update lead");
  }

  return response.json();
};

export const useLeads = (filters: LeadsFilters = {}) => {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => fetchLeads(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      // Invalidate and refetch leads data
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLead,
    onSuccess: () => {
      // Invalidate and refetch leads data
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
