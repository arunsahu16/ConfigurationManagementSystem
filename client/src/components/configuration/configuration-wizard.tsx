import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertConfigurationSchema } from "@shared/schema";
import { useCreateConfiguration } from "@/hooks/use-configurations";
import { useApplications } from "@/hooks/use-applications";
import { useToast } from "@/hooks/use-toast";
import { Dock, Smartphone, Cloud, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";

interface ConfigurationWizardProps {
  open: boolean;
  onClose: () => void;
  initialType?: 'desktop' | 'real_device' | 'virtual_device' | null;
}

const steps = [
  { id: 1, name: 'Type Selection' },
  { id: 2, name: 'Configuration' },
  { id: 3, name: 'Review' },
];

const configTypes = [
  {
    type: 'desktop' as const,
    icon: Dock,
    title: 'Dock',
    description: 'Configure browsers on desktop operating systems',
    details: 'OS • Browser • Resolution',
  },
  {
    type: 'real_device' as const,
    icon: Smartphone,
    title: 'Real Device',
    description: 'Test on actual mobile devices and tablets',
    details: 'Device • OS • Application',
  },
  {
    type: 'virtual_device' as const,
    icon: Cloud,
    title: 'Virtual Device',
    description: 'Emulated devices for scalable testing',
    details: 'Emulator • Browser • OS',
  },
];

export default function ConfigurationWizard({ open, onClose, initialType }: ConfigurationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'desktop' | 'real_device' | 'virtual_device' | null>(initialType || null);
  const { toast } = useToast();
  
  const createMutation = useCreateConfiguration();
  const { data: applications = [] } = useApplications();

  const form = useForm({
    resolver: zodResolver(insertConfigurationSchema),
    defaultValues: {
      name: '',
      type: selectedType,
      status: 'active' as const,
      os: '',
      osVersion: '',
      browser: '',
      browserVersion: '',
      resolution: '1920x1080',
      manufacturer: '',
      deviceName: '',
      cloudType: 'public' as const,
      applicationId: undefined,
      tags: [],
      description: '',
      isTemplate: false,
      createdBy: 1,
    },
  });

  const watchedType = form.watch('type');

  const handleNext = () => {
    if (currentStep === 1 && !selectedType) {
      toast({
        title: "Please select a configuration type",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 1) {
      form.setValue('type', selectedType!);
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const formData = form.getValues();
    
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Configuration created successfully",
          description: `${formData.name} has been created.`,
        });
        handleClose();
      },
      onError: (error) => {
        toast({
          title: "Failed to create configuration",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedType(initialType || null);
    form.reset();
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Configuration Type
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {configTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.type;
                
                return (
                  <div
                    key={type.type}
                    className={cn(
                      "border-2 rounded-lg p-6 cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5"
                    )}
                    onClick={() => setSelectedType(type.type)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        {type.title}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {type.description}
                      </p>
                      <div className="text-xs text-gray-400">
                        {type.details}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedType === 'desktop' ? 'Dock Configuration' :
               selectedType === 'real_device' ? 'Real Device Configuration' :
               'Virtual Device Configuration'}
            </h4>
            
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuration Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Chrome Windows Latest" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedType === 'desktop' && (
                  <>
                    <FormField
                      control={form.control}
                      name="os"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating System</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Windows 11">Windows 11</SelectItem>
                              <SelectItem value="Windows 10">Windows 10</SelectItem>
                              <SelectItem value="macOS Sonoma">macOS Sonoma</SelectItem>
                              <SelectItem value="macOS Ventura">macOS Ventura</SelectItem>
                              <SelectItem value="Ubuntu 22.04">Ubuntu 22.04</SelectItem>
                              <SelectItem value="Ubuntu 20.04">Ubuntu 20.04</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="browser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Browser</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Browser" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Chrome">Chrome</SelectItem>
                              <SelectItem value="Firefox">Firefox</SelectItem>
                              <SelectItem value="Safari">Safari</SelectItem>
                              <SelectItem value="Edge">Edge</SelectItem>
                              <SelectItem value="Opera">Opera</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="browserVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Browser Version</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 118.0 or Latest" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="resolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Screen Resolution</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Resolution" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1920x1080">1920x1080 (Default)</SelectItem>
                              <SelectItem value="1366x768">1366x768</SelectItem>
                              <SelectItem value="1440x900">1440x900</SelectItem>
                              <SelectItem value="2560x1440">2560x1440</SelectItem>
                              <SelectItem value="3840x2160">3840x2160</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {watchedType === 'real_device' && (
                  <>
                    <FormField
                      control={form.control}
                      name="cloudType"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Cloud Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Cloud Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public Cloud</SelectItem>
                              <SelectItem value="private">Private Cloud</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="os"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating System</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="iOS">iOS</SelectItem>
                              <SelectItem value="Android">Android</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Input placeholder="Regex pattern or specific name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deviceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Regex pattern or specific model" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="osVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OS Version</FormLabel>
                          <FormControl>
                            <Input placeholder="Regex pattern or specific version" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applicationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application (Optional)</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(value === 'none' ? undefined : parseInt(value))} 
                            value={field.value?.toString() || 'none'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Application" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {applications.map((app) => (
                                <SelectItem key={app.id} value={app.id.toString()}>
                                  {app.name} v{app.version}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {watchedType === 'virtual_device' && (
                  <>
                    <FormField
                      control={form.control}
                      name="os"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating System</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Android">Android</SelectItem>
                              <SelectItem value="iOS">iOS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="browser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Browser</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Browser" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Chrome Mobile">Chrome Mobile</SelectItem>
                              <SelectItem value="Safari Mobile">Safari Mobile</SelectItem>
                              <SelectItem value="Firefox Mobile">Firefox Mobile</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Google, Apple" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deviceName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Pixel 7, iPhone 14" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="osVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OS Version</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 13, 17.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional details about this configuration"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </div>
        );

      case 3:
        const formData = form.getValues();
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Review Configuration
            </h4>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {selectedType === 'desktop' && <Dock className="w-6 h-6 text-primary" />}
                  {selectedType === 'real_device' && <Smartphone className="w-6 h-6 text-primary" />}
                  {selectedType === 'virtual_device' && <Cloud className="w-6 h-6 text-primary" />}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {formData.name}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedType === 'desktop' ? 'Dock Configuration' :
                     selectedType === 'real_device' ? 'Real Device Configuration' :
                     'Virtual Device Configuration'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {formData.os && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">OS:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.os} {formData.osVersion}
                    </span>
                  </div>
                )}
                {formData.browser && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Browser:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.browser} {formData.browserVersion}
                    </span>
                  </div>
                )}
                {formData.manufacturer && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Manufacturer:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.manufacturer}
                    </span>
                  </div>
                )}
                {formData.deviceName && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Device:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.deviceName}
                    </span>
                  </div>
                )}
                {formData.resolution && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Resolution:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.resolution}
                    </span>
                  </div>
                )}
                {formData.cloudType && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Cloud Type:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formData.cloudType === 'public' ? 'Public Cloud' : 'Private Cloud'}
                    </span>
                  </div>
                )}
              </div>
              
              {formData.description && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Description:</span>
                  <p className="mt-1 text-gray-900 dark:text-white">{formData.description}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuration Wizard</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a new test configuration
          </p>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm",
                      currentStep >= step.id
                        ? "text-primary font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleNext}
              disabled={createMutation.isPending}
              className="flex items-center space-x-2"
            >
              {currentStep === 3 ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create Configuration</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
