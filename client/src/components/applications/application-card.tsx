import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Edit, Trash, MoreHorizontal, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import type { Application } from "@shared/schema";

interface ApplicationCardProps {
  application: Application;
  onEdit?: (application: Application) => void;
  onDelete?: (application: Application) => void;
  onViewConfigs?: (application: Application) => void;
}

const platformColors = {
  iOS: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  Android: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Web: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
};

export default function ApplicationCard({ 
  application, 
  onEdit, 
  onDelete, 
  onViewConfigs 
}: ApplicationCardProps) {
  const platformColor = platformColors[application.platform as keyof typeof platformColors] || platformColors.Web;

  return (
    <Card className="config-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {application.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Version {application.version}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${platformColor}`}>
              {application.platform}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewConfigs?.(application)}>
                  <Package className="mr-2 h-4 w-4" />
                  View Configurations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(application)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(application)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {application.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {application.description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          {application.packageName && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Package:</span>
              <span className="text-gray-900 dark:text-white font-mono text-xs">
                {application.packageName}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Platform:</span>
            <span className="text-gray-900 dark:text-white">
              {application.platform}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Updated {formatDistanceToNow(new Date(application.updatedAt!))} ago
          </div>
          
          <Button variant="outline" size="sm" onClick={() => onViewConfigs?.(application)}>
            View Configs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
