import { useState } from "react";
import { useApplications, useDeleteApplication } from "@/hooks/use-applications";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApplicationCard from "@/components/applications/application-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfigurationCardSkeleton } from "@/components/ui/loading-skeleton";
import { Plus, Search, Smartphone } from "lucide-react";
import type { Application } from "@shared/schema";

export default function Applications() {
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();

  const { data: applications = [], isLoading } = useApplications();
  const deleteMutation = useDeleteApplication();

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    app.version.toLowerCase().includes(searchValue.toLowerCase()) ||
    app.platform.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleEdit = (application: Application) => {
    console.log("Edit application:", application);
  };

  const handleDelete = (application: Application) => {
    if (confirm(`Are you sure you want to delete "${application.name}"?`)) {
      deleteMutation.mutate(application.id, {
        onSuccess: () => {
          toast({
            title: "Application deleted",
            description: `${application.name} has been deleted.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to delete application",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleViewConfigs = (application: Application) => {
    console.log("View configurations for:", application);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Applications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage applications and their versions for testing
          </p>
        </div>
        
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search applications..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Applications Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ConfigurationCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={Smartphone}
          title="No applications found"
          description={searchValue ? "Try adjusting your search criteria." : "Get started by adding your first application."}
          action={{
            label: "Add Application",
            onClick: () => console.log("Add application"),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewConfigs={handleViewConfigs}
            />
          ))}
        </div>
      )}
    </div>
  );
}
