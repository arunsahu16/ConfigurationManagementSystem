import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateTestRun, useUpdateTestRun } from "@/hooks/use-test-runs";
import { useToast } from "@/hooks/use-toast";
import type { TestRun } from "@shared/schema";
import ReactSelect from "react-select";

const testRunSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  configurationId: z.string().min(1, "Configuration is required"),
  targetType: z.enum(["testCase", "application"]),
  testTargetIds: z.array(z.string()).min(1, "Select at least one test case or app"),
});

type TestRunFormData = z.infer<typeof testRunSchema>;

interface TestRunFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testRun?: TestRun;
  onSuccess?: () => void;
  configurations?: { id: string; name: string }[];
  testCases?: { id: string; name: string }[];
  applications?: { id: string; name: string }[];
}

export default function TestRunForm({
  open,
  onOpenChange,
  testRun,
  onSuccess,
  configurations = [],
  testCases = [],
  applications = [],
}: TestRunFormProps) {
  const { toast } = useToast();
  const createTestRun = useCreateTestRun();
  const updateTestRun = useUpdateTestRun();

  const form = useForm<TestRunFormData>({
    resolver: zodResolver(testRunSchema),
    defaultValues: {
      name: testRun?.name || "",
      description: testRun?.description || "",
      configurationId: (testRun as any)?.configurationId || "",
      testTargetIds: (testRun && "testTargetIds" in testRun && Array.isArray((testRun as any).testTargetIds)) ? (testRun as any).testTargetIds : [],
      targetType: "testCase",
    },
  });

  const selectedType = useWatch({ control: form.control, name: "targetType" });

  const onSubmit = async (data: TestRunFormData) => {
    try {
      if (testRun) {
        await updateTestRun.mutateAsync({
          id: testRun.id,
          data: {
            ...data,
            status: testRun.status,
          },
        });
        toast({ title: "Test run updated", description: "Updated successfully." });
      } else {
        await createTestRun.mutateAsync({
          ...data,
          createdBy: 1,
          status: "pending",
        });
        toast({ title: "Test run created", description: "Created successfully." });
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save test run.",
        variant: "destructive",
      });
    }
  };

  const currentOptions = selectedType === "testCase" ? testCases : applications;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{testRun ? "Edit Test Run" : "Create Test Run"}</DialogTitle>
          <DialogDescription>Select configuration and targets to run.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Run Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Regression Run Sprint 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="configurationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration</FormLabel>
                  <ShadSelect onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select configuration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {configurations.map((config) => (
                        <SelectItem key={config.id} value={config.id}>{config.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </ShadSelect>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Type</FormLabel>
                  <ShadSelect onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="testCase">Test Case</SelectItem>
                      <SelectItem value="application">Application</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testTargetIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{selectedType === "testCase" ? "Test Cases" : "Applications"}</FormLabel>
                  <FormControl>
                    <ReactSelect
                      isMulti
                      options={currentOptions.map((t) => ({ label: t.name, value: t.id }))}
                      value={field.value.map((id) => ({
                        label: currentOptions.find((t) => t.id === id)?.name || id,
                        value: id,
                      }))}
                      onChange={(vals) => field.onChange(vals.map((v) => v.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Describe purpose and scope" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTestRun.isPending || updateTestRun.isPending}>
                {createTestRun.isPending || updateTestRun.isPending ? "Saving..." : testRun ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
