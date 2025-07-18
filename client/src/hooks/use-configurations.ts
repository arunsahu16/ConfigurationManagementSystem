import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Configuration, InsertConfiguration } from "@shared/schema";
import type { ConfigurationFilters } from "@/lib/types";

export function useConfigurations(filters?: ConfigurationFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.type) queryParams.append('type', filters.type);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.search) queryParams.append('search', filters.search);
  
  const queryString = queryParams.toString();
  const url = `/api/configurations${queryString ? `?${queryString}` : ''}`;

  return useQuery<Configuration[]>({
    queryKey: ['/api/configurations', filters],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch configurations');
      }
      return response.json();
    },
  });
}

export function useConfiguration(id: number) {
  return useQuery<Configuration>({
    queryKey: ['/api/configurations', id],
    enabled: !!id,
  });
}

export function useCreateConfiguration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertConfiguration) => {
      const response = await apiRequest('POST', '/api/configurations', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/configurations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertConfiguration> }) => {
      const response = await apiRequest('PUT', `/api/configurations/${id}`, data);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/configurations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/configurations', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useDeleteConfiguration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/configurations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/configurations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}
