import { useState } from "react";
import { useConfigurations, useDeleteConfiguration } from "@/hooks/use-configurations";
import { useToast } from "@/hooks/use-toast";
import ConfigurationCard from "./configuration-card";
import ConfigurationFilters from "./configuration-filters";
import { ConfigurationCardSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, Edit, Copy, Trash, Dock, Smartphone, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Configuration } from "@shared/schema";
import type { ConfigurationFilters as Filters, ViewMode } from "@/lib/types";

interface ConfigurationListProps {
  onEdit?: (config: Configuration) => void;
  onDuplicate?: (config: Configuration) => void;
}

const typeIcons = {
  desktop: Dock,
  real_device: Smartphone,
  virtual_device: Cloud,
};

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  testing: "bg-yellow-500",
};

export default function ConfigurationList({ onEdit, onDuplicate }: ConfigurationListProps) {
  const [filters, setFilters] = useState<Filters>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { toast } = useToast();

  const { data: configurations = [], isLoading } = useConfigurations(filters);
  const deleteMutation = useDeleteConfiguration();

  const handleDelete = (config: Configuration) => {
    if (confirm(`Are you sure you want to delete "${config.name}"?`)) {
      deleteMutation.mutate(config.id, {
        onSuccess: () => {
          toast({
            title: "Configuration deleted",
            description: `${config.name} has been deleted.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to delete configuration",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    toast({
      title: "Export started",
      description: "Your configurations are being exported.",
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, config: Configuration) => {
        const Icon = typeIcons[config.type];
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {config.type.replace('_', ' ')}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant="secondary">
          {value === 'real_device' ? 'Real Device' : 
           value === 'virtual_device' ? 'Virtual Device' : 
           'Dock'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        const color = statusColors[value as keyof typeof statusColors];
        return (
          <div className="flex items-center space-x-2">
            <div className={cn("w-2 h-2 rounded-full", color)} />
            <span className="capitalize">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, config: Configuration) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(config)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate?.(config)}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(config)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ConfigurationFilters
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExport={handleExport}
        />
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ConfigurationCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfigurationFilters
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
      />

      {configurations.length === 0 ? (
        <EmptyState
          icon={Server}
          title="No configurations found"
          description="Get started by creating your first configuration."
          action={{
            label: "Create Configuration",
            onClick: () => {
              // This would trigger the configuration wizard
              console.log("Create configuration");
            },
          }}
        />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configurations.map((config) => (
                <ConfigurationCard
                  key={config.id}
                  configuration={config}
                  onEdit={onEdit}
                  onDuplicate={onDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={configurations}
              emptyState={
                <EmptyState
                  icon={Server}
                  title="No configurations found"
                  description="Try adjusting your filters or create a new configuration."
                />
              }
            />
          )}
        </>
      )}
    </div>
  );
}
