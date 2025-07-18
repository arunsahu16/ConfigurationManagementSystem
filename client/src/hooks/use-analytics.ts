import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@/lib/types";

export function useAnalytics() {
  return useQuery<DashboardStats>({
    queryKey: ['/api/analytics/stats'],
  });
}

export function useActivityLog(limit?: number) {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', limit.toString());
  
  const queryString = queryParams.toString();
  const url = `/api/activity${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['/api/activity', limit],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch activity log');
      }
      return response.json();
    },
  });
}
