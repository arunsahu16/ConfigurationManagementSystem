import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash, MoreHorizontal, Calendar, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { TestRun } from "@shared/schema";

interface TestRunCardProps {
  testRun: TestRun;
  onEdit?: (testRun: TestRun) => void;
  onDelete?: (testRun: TestRun) => void;
  onView?: (testRun: TestRun) => void;
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  running: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const statusIcons = {
  pending: Clock,
  running: Play,
  completed: Calendar,
  failed: Calendar,
};

export default function TestRunCard({ testRun, onEdit, onDelete, onView }: TestRunCardProps) {
  const statusColor = statusColors[testRun.status as keyof typeof statusColors] || statusColors.pending;
  const StatusIcon = statusIcons[testRun.status as keyof typeof statusIcons] || Clock;

  const getDuration = () => {
    if (testRun.startTime && testRun.endTime) {
      const start = new Date(testRun.startTime);
      const end = new Date(testRun.endTime);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
      return `${diffMins}m ${diffSecs}s`;
    }
    if (testRun.startTime) {
      return `Started ${formatDistanceToNow(new Date(testRun.startTime))} ago`;
    }
    return null;
  };

  return (
    <Card className="config-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <StatusIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {testRun.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Test Run
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={cn("text-xs", statusColor)}>
              {testRun.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(testRun)}>
                  <Play className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(testRun)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(testRun)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {testRun.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {testRun.description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          {testRun.startTime && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Started:</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(testRun.startTime).toLocaleDateString()}
              </span>
            </div>
          )}
          
          {getDuration() && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Duration:</span>
              <span className="text-gray-900 dark:text-white">
                {getDuration()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created {formatDistanceToNow(new Date(testRun.createdAt!))} ago
          </div>
          
          <Button variant="outline" size="sm" onClick={() => onView?.(testRun)}>
            View Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
