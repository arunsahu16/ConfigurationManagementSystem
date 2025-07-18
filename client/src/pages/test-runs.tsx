import { useState } from "react";
import { useTestRuns, useDeleteTestRun } from "@/hooks/use-test-runs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TestRunCard from "@/components/test-runs/test-run-card";
import TestRunForm from "@/components/test-runs/test-run-form";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfigurationCardSkeleton } from "@/components/ui/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Play } from "lucide-react";
import type { TestRun } from "@shared/schema";
import type { TestRunFilters } from "@/lib/types";

export default function TestRuns() {
  const [filters, setFilters] = useState<TestRunFilters>({});
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestRun, setEditingTestRun] = useState<TestRun | undefined>();
  const { toast } = useToast();

  const { data: testRuns = [], isLoading, refetch } = useTestRuns({
    ...filters,
    search: searchValue,
  });

  const deleteTestRun = useDeleteTestRun();

  const handleFilterChange = (key: keyof TestRunFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleEdit = (testRun: TestRun) => {
    setEditingTestRun(testRun);
    setIsFormOpen(true);
  };

  const handleDelete = async (testRun: TestRun) => {
    if (confirm(`Are you sure you want to delete "${testRun.name}"?`)) {
      try {
        await deleteTestRun.mutateAsync(testRun.id);
        toast({
          title: "Test run deleted",
          description: "The test run has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete test run. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleView = (testRun: TestRun) => {
    toast({
      title: "View test run details",
      description: `Viewing details for: ${testRun.name}`,
    });
    // Here you would typically navigate to a detailed view
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingTestRun(undefined);
  };

  const handleCreateNew = () => {
    setEditingTestRun(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Test Runs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and manage your test execution runs
          </p>
        </div>
        
        <Button onClick={handleCreateNew} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Test Run</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search test runs..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select 
          value={filters.status || 'all'}
          onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Test Runs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ConfigurationCardSkeleton key={i} />
          ))}
        </div>
      ) : testRuns.length === 0 ? (
        <EmptyState
          icon={Play}
          title="No test runs found"
          description="Get started by creating your first test run."
          action={{
            label: "Create Test Run",
            onClick: handleCreateNew,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testRuns.map((testRun) => (
            <TestRunCard
              key={testRun.id}
              testRun={testRun}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      <TestRunForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        testRun={editingTestRun}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
