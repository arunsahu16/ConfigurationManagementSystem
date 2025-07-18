import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TestCase, InsertTestCase } from "@shared/schema";
import type { TestCaseFilters } from "@/lib/types";

export function useTestCases(filters?: TestCaseFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.append('category', filters.category);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.search) queryParams.append('search', filters.search);
  
  const queryString = queryParams.toString();
  const url = `/api/test-cases${queryString ? `?${queryString}` : ''}`;

  return useQuery<TestCase[]>({
    queryKey: ['/api/test-cases', filters],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch test cases');
      }
      return response.json();
    },
  });
}

export function useCreateTestCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertTestCase) => {
      const response = await apiRequest('POST', '/api/test-cases', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useUpdateTestCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertTestCase> }) => {
      const response = await apiRequest('PATCH', `/api/test-cases/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useDeleteTestCase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/test-cases/${id}`);
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}
