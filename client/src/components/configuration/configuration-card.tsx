import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dock, 
  Smartphone, 
  Cloud, 
  Edit, 
  Copy, 
  Trash, 
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Configuration } from "@shared/schema";

interface ConfigurationCardProps {
  configuration: Configuration;
  onEdit?: (config: Configuration) => void;
  onDuplicate?: (config: Configuration) => void;
  onDelete?: (config: Configuration) => void;
  draggable?: boolean;
}

const typeIcons = {
  desktop: Dock,
  real_device: Smartphone,
  virtual_device: Cloud,
};

const typeColors = {
  desktop: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  real_device: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  virtual_device: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
};

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  testing: "bg-yellow-500",
};

const statusLabels = {
  active: "Active",
  inactive: "Inactive", 
  testing: "Testing",
};

export default function ConfigurationCard({ 
  configuration, 
  onEdit, 
  onDuplicate, 
  onDelete,
  draggable = false
}: ConfigurationCardProps) {
  const Icon = typeIcons[configuration.type];
  const typeColorClass = typeColors[configuration.type];
  const statusColor = statusColors[configuration.status];
  const statusLabel = statusLabels[configuration.status];

  const handleDragStart = (e: React.DragEvent) => {
    if (draggable) {
      e.dataTransfer.setData('application/json', JSON.stringify(configuration));
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  const getConfigDetails = () => {
    switch (configuration.type) {
      case 'desktop':
        return [
          { label: 'OS', value: configuration.os },
          { label: 'Browser', value: configuration.browser },
          { label: 'Resolution', value: configuration.resolution },
        ];
      case 'real_device':
        return [
          { label: 'OS', value: `${configuration.os} ${configuration.osVersion}` },
          { label: 'Manufacturer', value: configuration.manufacturer },
          { label: 'Device', value: configuration.deviceName },
        ];
      case 'virtual_device':
        return [
          { label: 'OS', value: `${configuration.os} ${configuration.osVersion}` },
          { label: 'Device', value: configuration.deviceName },
          { label: 'Browser', value: configuration.browser },
        ];
      default:
        return [];
    }
  };

  const details = getConfigDetails().filter(detail => detail.value);

  return (
    <Card 
      className={cn(
        "config-card cursor-pointer", 
        draggable && "cursor-move"
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", typeColorClass)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {configuration.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {configuration.type === 'real_device' ? 'Real Device' : 
                 configuration.type === 'virtual_device' ? 'Virtual Device' : 
                 'Dock'} Configuration
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className={cn("w-2 h-2 rounded-full", statusColor)} />
              <Badge variant="secondary" className="text-xs">
                {statusLabel}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(configuration)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(configuration)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(configuration)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {details.map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{label}:</span>
              <span className="text-gray-900 dark:text-white font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Used in 12 tests
          </div>
          {configuration.tags && configuration.tags.length > 0 && (
            <div className="flex space-x-1">
              {configuration.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {configuration.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{configuration.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
