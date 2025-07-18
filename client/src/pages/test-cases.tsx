import { useState } from "react";
import { useTestCases, useDeleteTestCase } from "@/hooks/use-test-cases";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TestCaseCard from "@/components/test-cases/test-case-card";
import TestCaseForm from "@/components/test-cases/test-case-form";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfigurationCardSkeleton } from "@/components/ui/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, FlaskConical } from "lucide-react";
import type { TestCase } from "@shared/schema";
import type { TestCaseFilters } from "@/lib/types";

export default function TestCases() {
  const [filters, setFilters] = useState<TestCaseFilters>({});
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState<TestCase | undefined>();
  const { toast } = useToast();

  const { data: testCases = [], isLoading, refetch } = useTestCases({
    ...filters,
    search: searchValue,
  });

  const deleteTestCase = useDeleteTestCase();

  const handleFilterChange = (key: keyof TestCaseFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleEdit = (testCase: TestCase) => {
    setEditingTestCase(testCase);
    setIsFormOpen(true);
  };

  const handleDelete = async (testCase: TestCase) => {
    if (confirm(`Are you sure you want to delete "${testCase.name}"?`)) {
      try {
        await deleteTestCase.mutateAsync(testCase.id);
        toast({
          title: "Test case deleted",
          description: "The test case has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete test case. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRun = (testCase: TestCase) => {
    toast({
      title: "Test case execution started",
      description: `Running test case: ${testCase.name}`,
    });
    // Here you would typically start a test execution
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingTestCase(undefined);
  };

  const handleCreateNew = () => {
    setEditingTestCase(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Test Cases
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and organize your test cases for KaneAI and Test Manager
          </p>
        </div>
        
        <Button onClick={handleCreateNew} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Test Case</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search test cases..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select 
          value={filters.category || 'all'} 
          onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="KaneAI">KaneAI</SelectItem>
            <SelectItem value="Test Manager">Test Manager</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.status || 'all'}
          onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Test Cases Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ConfigurationCardSkeleton key={i} />
          ))}
        </div>
      ) : testCases.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No test cases found"
          description="Get started by creating your first test case."
          action={{
            label: "Create Test Case",
            onClick: handleCreateNew,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCases.map((testCase) => (
            <TestCaseCard
              key={testCase.id}
              testCase={testCase}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRun={handleRun}
            />
          ))}
        </div>
      )}

      <TestCaseForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        testCase={editingTestCase}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
