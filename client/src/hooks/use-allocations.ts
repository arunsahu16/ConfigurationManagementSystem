import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ConfigurationAllocation, InsertConfigurationAllocation } from "@shared/schema";
import type { AllocationRequest, BulkAllocationRequest } from "@/lib/types";

export function useAllocations() {
  return useQuery<ConfigurationAllocation[]>({
    queryKey: ['/api/allocations'],
  });
}

export function useCreateAllocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertConfigurationAllocation) => {
      const response = await apiRequest('POST', '/api/allocations', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/allocations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useCreateBulkAllocations() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BulkAllocationRequest) => {
      const response = await apiRequest('POST', '/api/allocations/bulk', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/allocations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/allocations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/allocations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
    },
  });
}
