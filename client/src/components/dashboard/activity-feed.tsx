// import { useQuery } from "@tanstack/react-query";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { formatDistanceToNow } from "date-fns";
// import { Plus, Edit, Play, Trash } from "lucide-react";
// import type { Activity } from "@/lib/types";

// const actionIcons = {
//   created: Plus,
//   updated: Edit,
//   allocated: Play,
//   deleted: Trash,
// };

// const actionColors = {
//   created: "bg-primary/10 text-primary",
//   updated: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
//   allocated: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
//   deleted: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
// };

// export default function ActivityFeed() {
//   const { data: activities = [], isLoading } = useQuery<Activity[]>({
//     queryKey: ['/api/activity'],
//   });

//   if (isLoading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Activity</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex items-start space-x-3 p-3 animate-pulse">
//                 <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
//                   <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>Recent Activity</CardTitle>
//         <Button variant="ghost" size="sm">
//           View All
//         </Button>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {activities.length === 0 ? (
//             <p className="text-center text-gray-500 dark:text-gray-400 py-8">
//               No recent activity
//             </p>
//           ) : (
//             activities.map((activity) => {
//               const Icon = actionIcons[activity.action as keyof typeof actionIcons] || Plus;
//               const colorClass = actionColors[activity.action as keyof typeof actionColors] || actionColors.created;
              
//               return (
//                 <div 
//                   key={activity.id} 
//                   className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                 >
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
//                     <Icon className="w-4 h-4" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-gray-900 dark:text-white">
//                       <span className="font-medium capitalize">{activity.action}</span>{" "}
//                       {activity.resourceType.replace('_', ' ')}{" "}
//                       <span className="font-medium">{activity.resourceName}</span>
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       {formatDistanceToNow(new Date(activity.createdAt))} ago
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";
import { Plus, Edit, Play, Trash } from "lucide-react";
import { useState } from "react";
import type { Activity } from "@/lib/types";

const actionIcons = {
  created: Plus,
  updated: Edit,
  allocated: Play,
  deleted: Trash,
};

const actionColors = {
  created: "bg-primary/10 text-primary",
  updated: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  allocated: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  deleted: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
};

export default function ActivityFeed() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activity'],
  });

  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const visibleActivities = showAll ? sorted : sorted.slice(0, 5);

  const groupedActivities = visibleActivities.reduce((acc, activity) => {
    const date = new Date(activity.createdAt);
    const group =
      isToday(date)
        ? "Today"
        : isYesterday(date)
          ? "Yesterday"
          : format(date, "dd MMM yyyy");

    if (!acc[group]) acc[group] = [];
    acc[group].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, acts]) => (
            <div key={date}>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{date}</p>
              <div className="space-y-3">
                {acts.map((activity) => {
                  const Icon = actionIcons[activity.action as keyof typeof actionIcons] || Plus;
                  const colorClass = actionColors[activity.action as keyof typeof actionColors] || actionColors.created;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium capitalize">{activity.action}</span>{" "}
                          {activity.resourceType.replace("_", " ")}{" "}
                          <span className="font-medium">{activity.resourceName}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(activity.createdAt))} ago
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {activities.length > 5 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "View Less" : "View More"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
