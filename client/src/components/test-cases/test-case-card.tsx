import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Edit, Trash, MoreHorizontal, Play, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TestCase } from "@shared/schema";
import { toast } from "sonner";

interface TestCaseCardProps {
  testCase: TestCase;
  onEdit?: (testCase: TestCase) => void;
  onDelete?: (testCase: TestCase) => void;
  onRun?: (testCase: TestCase) => void;
  onDuplicate?: (testCase: TestCase) => void;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const statusColors = {
  Active: "bg-green-500",
  Inactive: "bg-gray-500",
  Testing: "bg-yellow-500",
};

export default function TestCaseCard({
  testCase,
  onEdit,
  onDelete,
  onRun,
  onDuplicate,
}: TestCaseCardProps) {
  const priorityColor = priorityColors[testCase.priority as keyof typeof priorityColors] || priorityColors.medium;
  const statusColor = statusColors[testCase.status as keyof typeof statusColors] || statusColors.Active;

  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    setIsDeleted(true);
    toast(
      `Test case "${testCase.name}" deleted.`,
      {
        action: {
          label: "Undo",
          onClick: () => {
            setIsDeleted(false);
          },
        },
        duration: 5000,
      }
    );

    setTimeout(() => {
      if (isDeleted) onDelete?.(testCase);
    }, 5000);
  };

  if (isDeleted) return null;

  return (
    <Card className="config-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{testCase.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{testCase.category}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className={cn("w-2 h-2 rounded-full", statusColor)} />
              <Badge variant="secondary" className="text-xs">{testCase.status}</Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRun?.(testCase)}>
                  <Play className="mr-2 h-4 w-4" />
                  Run Test
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(testCase)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(testCase)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {testCase.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {testCase.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Badge className={cn("text-xs", priorityColor)}>
            {testCase.priority} priority
          </Badge>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Array.isArray(testCase.steps) ? `${testCase.steps.length} steps` : '0 steps'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
