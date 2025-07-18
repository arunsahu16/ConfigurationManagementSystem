import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfigurations } from "@/hooks/use-configurations";
import { useTestCases } from "@/hooks/use-test-cases";
import { useTestRuns } from "@/hooks/use-test-runs";
import { useCreateBulkAllocations } from "@/hooks/use-allocations";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, X } from "lucide-react";
import ConfigurationCard from "@/components/configuration/configuration-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { cn } from "@/lib/utils";
import type { Configuration, TestCase, TestRun } from "@shared/schema";
import type { AllocationRequest } from "@/lib/types";

interface AllocationModalProps {
  open: boolean;
  onClose: () => void;
}

interface DraggedConfig {
  configuration: Configuration;
  targetType: 'test-case' | 'test-run';
  targetId: number;
}

export default function AllocationModal({ open, onClose }: AllocationModalProps) {
  const [searchConfigs, setSearchConfigs] = useState("");
  const [searchTests, setSearchTests] = useState("");
  const [allocations, setAllocations] = useState<AllocationRequest[]>([]);
  const [draggedItem, setDraggedItem] = useState<Configuration | null>(null);
  
  const { toast } = useToast();
  const createBulkMutation = useCreateBulkAllocations();

  const { data: configurations = [], isLoading: loadingConfigs } = useConfigurations({
    search: searchConfigs,
  });

  const { data: testCases = [], isLoading: loadingTestCases } = useTestCases({
    search: searchTests,
  });

  const { data: testRuns = [], isLoading: loadingTestRuns } = useTestRuns({
    search: searchTests,
  });

  const filteredConfigs = configurations.filter(config =>
    config.name.toLowerCase().includes(searchConfigs.toLowerCase())
  );

  const filteredTestCases = testCases.filter(tc =>
    tc.name.toLowerCase().includes(searchTests.toLowerCase())
  );

  const filteredTestRuns = testRuns.filter(tr =>
    tr.name.toLowerCase().includes(searchTests.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, config: Configuration) => {
    setDraggedItem(config);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, targetType: 'test-case' | 'test-run', targetId: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const newAllocation: AllocationRequest = {
      configurationId: draggedItem.id,
      ...(targetType === 'test-case' ? { testCaseId: targetId } : { testRunId: targetId }),
    };

    // Check if allocation already exists
    const exists = allocations.some(alloc => 
      alloc.configurationId === newAllocation.configurationId &&
      alloc.testCaseId === newAllocation.testCaseId &&
      alloc.testRunId === newAllocation.testRunId
    );

    if (!exists) {
      setAllocations(prev => [...prev, newAllocation]);
    }
    
    setDraggedItem(null);
  };

  const removeAllocation = (index: number) => {
    setAllocations(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (allocations.length === 0) {
      toast({
        title: "No allocations to save",
        description: "Please drag configurations to test cases or test runs.",
        variant: "destructive",
      });
      return;
    }

    createBulkMutation.mutate(
      { allocations },
      {
        onSuccess: () => {
          toast({
            title: "Allocations saved successfully",
            description: `${allocations.length} configuration(s) allocated.`,
          });
          setAllocations([]);
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Failed to save allocations",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const getConfigurationById = (id: number) => {
    return configurations.find(config => config.id === id);
  };

  const getTestCaseById = (id: number) => {
    return testCases.find(tc => tc.id === id);
  };

  const getTestRunById = (id: number) => {
    return testRuns.find(tr => tr.id === id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuration Allocation</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Assign configurations to test cases and test runs
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Available Configurations */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Available Configurations
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search configurations..."
                  value={searchConfigs}
                  onChange={(e) => setSearchConfigs(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg min-h-96 max-h-96 overflow-y-auto p-4">
              {loadingConfigs ? (
                <div className="space-y-4">
                  <LoadingSkeleton className="h-24" count={3} />
                </div>
              ) : filteredConfigs.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No configurations found"
                  description="Try adjusting your search criteria."
                />
              ) : (
                <div className="space-y-3">
                  {filteredConfigs.map((config) => (
                    <div
                      key={config.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={(e) => handleDragStart(e, config)}
                    >
                      <ConfigurationCard 
                        configuration={config} 
                        draggable={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Test Cases & Runs */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Test Cases & Runs
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search test cases and runs..."
                  value={searchTests}
                  onChange={(e) => setSearchTests(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg min-h-96 max-h-96 overflow-y-auto p-4">
              {loadingTestCases || loadingTestRuns ? (
                <div className="space-y-4">
                  <LoadingSkeleton className="h-16" count={4} />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Test Cases */}
                  {filteredTestCases.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Test Cases</h5>
                      <div className="space-y-2">
                        {filteredTestCases.map((testCase) => (
                          <div
                            key={`tc-${testCase.id}`}
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'test-case', testCase.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {testCase.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {testCase.category} • {testCase.priority} priority
                                </p>
                              </div>
                              <div className="text-xs text-gray-400">
                                Test Case
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Test Runs */}
                  {filteredTestRuns.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Test Runs</h5>
                      <div className="space-y-2">
                        {filteredTestRuns.map((testRun) => (
                          <div
                            key={`tr-${testRun.id}`}
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'test-run', testRun.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {testRun.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Status: {testRun.status}
                                </p>
                              </div>
                              <div className="text-xs text-gray-400">
                                Test Run
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredTestCases.length === 0 && filteredTestRuns.length === 0 && (
                    <EmptyState
                      icon={Plus}
                      title="No test cases or runs found"
                      description="Drag configurations here to allocate them to tests"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Allocations */}
        {allocations.length > 0 && (
          <div className="px-6 pb-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
              Pending Allocations ({allocations.length})
            </h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {allocations.map((allocation, index) => {
                const config = getConfigurationById(allocation.configurationId);
                const testCase = allocation.testCaseId ? getTestCaseById(allocation.testCaseId) : null;
                const testRun = allocation.testRunId ? getTestRunById(allocation.testRunId) : null;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {config?.name}
                      </span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {testCase?.name || testRun?.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAllocation(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700 space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={allocations.length === 0 || createBulkMutation.isPending}
          >
            Save Allocations ({allocations.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
