export interface DashboardStats {
  totalConfigurations: number;
  activeTestRuns: number;
  successRate: number;
  totalApplications: number;
}

export interface ConfigurationFilters {
  type?: string;
  status?: string;
  search?: string;
}

export interface TestCaseFilters {
  category?: string;
  status?: string;
  search?: string;
}

export interface TestRunFilters {
  status?: string;
  search?: string;
}

export interface AllocationRequest {
  configurationId: number;
  testCaseId?: number;
  testRunId?: number;
}

export interface BulkAllocationRequest {
  allocations: AllocationRequest[];
}

export type ViewMode = 'grid' | 'list';

export interface Activity {
  id: number;
  userId: number;
  action: string;
  resourceType: string;
  resourceId: number;
  resourceName: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface ConfigurationWizardData {
  step: number;
  type: 'desktop' | 'real_device' | 'virtual_device' | null;
  formData: Record<string, any>;
}
