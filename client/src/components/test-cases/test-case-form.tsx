import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useCreateTestCase, useUpdateTestCase } from "@/hooks/use-test-cases";
import { useToast } from "@/hooks/use-toast";
import type { TestCase } from "@shared/schema";

const testCaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Active", "Inactive", "Testing"]),
  expectedResults: z.string().optional(),
  steps: z.array(z.string().min(1)).min(1, "At least one step is required"),
});

type TestCaseFormData = z.infer<typeof testCaseSchema>;

interface TestCaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testCase?: TestCase;
  onSuccess?: () => void;
}

export default function TestCaseForm({
  open,
  onOpenChange,
  testCase,
  onSuccess,
}: TestCaseFormProps) {
  const [currentStep, setCurrentStep] = useState("");
  const { toast } = useToast();
  const createTestCase = useCreateTestCase();
  const updateTestCase = useUpdateTestCase();

  const form = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseSchema),
    mode: "onChange", // Enables real-time validation
    defaultValues: {
      name: testCase?.name || "",
      description: testCase?.description || "",
      category: testCase?.category || "",
      priority:
        (testCase?.priority as "Low" | "Medium" | "High") || "Medium",
      status: (testCase?.status as "Active" | "Inactive" | "Testing") || "Active",
      expectedResults: testCase?.expectedResults || "",
      steps: Array.isArray(testCase?.steps) ? testCase.steps : [],
    },
  });

  const watchedSteps = form.watch("steps");

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const addStep = () => {
    if (currentStep.trim()) {
      const currentSteps = form.getValues("steps");
      form.setValue("steps", [...currentSteps, currentStep.trim()]);
      setCurrentStep("");
    }
  };

  const removeStep = (index: number) => {
    const currentSteps = form.getValues("steps");
    form.setValue("steps", currentSteps.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TestCaseFormData) => {
    try {
      if (testCase) {
        await updateTestCase.mutateAsync({
          id: testCase.id,
          updates: { ...data, steps: data.steps, status: data.status.toLowerCase() as "active" | "inactive" | "testing" },
        });
        toast({
          title: "Test case updated",
          description: "The test case has been updated successfully.",
        });
      } else {
        await createTestCase.mutateAsync({
          ...data,
          steps: data.steps,
          createdBy: 1,
          status: data.status.toLowerCase() as "active" | "inactive" | "testing",
          priority: data.priority.toLowerCase(),
        });
        toast({
          title: "Test case created",
          description: "The test case has been created successfully.",
        });
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save test case. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testCase ? "Edit Test Case" : "Create New Test Case"}
          </DialogTitle>
          <DialogDescription>
            {testCase
              ? "Update the test case details below."
              : "Create a new test case for your testing needs."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Case Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Login Functionality Test"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="KaneAI">KaneAI</SelectItem>
                        <SelectItem value="Test Manager">Test Manager</SelectItem>
                        <SelectItem value="API Testing">API Testing</SelectItem>
                        <SelectItem value="UI Testing">UI Testing</SelectItem>
                        <SelectItem value="Integration">Integration</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this test case covers..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Test Steps</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a test step..."
                  value={currentStep}
                  onChange={(e) => setCurrentStep(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addStep();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addStep}
                  size="sm"
                  variant="outline"
                  disabled={!currentStep.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {watchedSteps.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {watchedSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                    >
                      <span className="flex-1 text-sm">
                        {index + 1}. {step}
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeStep(index)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No steps added yet.
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="expectedResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Results</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the expected outcome of this test..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  createTestCase.isPending ||
                  updateTestCase.isPending
                }
              >
                {createTestCase.isPending || updateTestCase.isPending
                  ? "Saving..."
                  : testCase
                  ? "Update Test Case"
                  : "Create Test Case"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
