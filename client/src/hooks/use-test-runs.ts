import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TestRun, InsertTestRun } from "@shared/schema";
import type { TestRunFilters } from "@/lib/types";

export function useTestRuns(filters?: TestRunFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.search) queryParams.append('search', filters.search);
  
  const queryString = queryParams.toString();
  const url = `/api/test-runs${queryString ? `?${queryString}` : ''}`;

  return useQuery<TestRun[]>({
    queryKey: ['/api/test-runs', filters],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch test runs');
      }
      return response.json();
    },
  });
}

export function useTestRun(id: number) {
  return useQuery<TestRun>({
    queryKey: ['/api/test-runs', id],
    enabled: !!id,
  });
}

export function useCreateTestRun() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertTestRun) => {
      const response = await apiRequest('POST', '/api/test-runs', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-runs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useUpdateTestRun() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTestRun> }) => {
      const response = await apiRequest('PUT', `/api/test-runs/${id}`, data);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-runs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/test-runs', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useDeleteTestRun() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/test-runs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-runs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}
