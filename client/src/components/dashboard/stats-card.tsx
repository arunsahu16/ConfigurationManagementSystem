import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trending?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor, 
  iconBgColor,
  trending = 'neutral'
}: StatsCardProps) {
  return (
    <Card className="config-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <p className={cn(
                "text-sm mt-1 flex items-center",
                trending === 'up' ? "text-green-600" : 
                trending === 'down' ? "text-red-600" : 
                "text-gray-600 dark:text-gray-400"
              )}>
                {trending === 'up' && "↗"}
                {trending === 'down' && "↘"}
                <span className="ml-1">{change}</span>
              </p>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
