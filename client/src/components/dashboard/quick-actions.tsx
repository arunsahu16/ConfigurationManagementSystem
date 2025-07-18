// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Dock, Smartphone, Cloud, Layers } from "lucide-react";
// import { useState } from "react";
// import ConfigurationWizard from "@/components/configuration/configuration-wizard";
// import AllocationModal from "@/components/allocation/allocation-modal";

// export default function QuickActions() {
//   const [wizardOpen, setWizardOpen] = useState(false);
//   const [wizardType, setWizardType] = useState<'desktop' | 'real_device' | 'virtual_device' | null>(null);
//   const [allocationOpen, setAllocationOpen] = useState(false);

//   const openWizardWithType = (type: 'desktop' | 'real_device' | 'virtual_device') => {
//     setWizardType(type);
//     setWizardOpen(true);
//   };

//   const handleWizardClose = () => {
//     setWizardOpen(false);
//     setWizardType(null);
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <Button
//             variant="outline"
//             className="w-full justify-start h-auto p-4 group"
//             onClick={() => openWizardWithType('desktop')}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
//                 <Dock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div className="text-left">
//                 <p className="font-medium text-gray-900 dark:text-white">Dock Config</p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Create new desktop configuration</p>
//               </div>
//             </div>
//           </Button>

//           <Button
//             variant="outline"
//             className="w-full justify-start h-auto p-4 group"
//             onClick={() => openWizardWithType('real_device')}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
//                 <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
//               </div>
//               <div className="text-left">
//                 <p className="font-medium text-gray-900 dark:text-white">Device Config</p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Set up mobile device testing</p>
//               </div>
//             </div>
//           </Button>

//           <Button
//             variant="outline"
//             className="w-full justify-start h-auto p-4 group"
//             onClick={() => setAllocationOpen(true)}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
//                 <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <div className="text-left">
//                 <p className="font-medium text-gray-900 dark:text-white">Bulk Allocation</p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Assign configs to multiple tests</p>
//               </div>
//             </div>
//           </Button>
//         </CardContent>
//       </Card>

//       <ConfigurationWizard 
//         open={wizardOpen} 
//         onClose={handleWizardClose}
//         initialType={wizardType}
//       />

//       <AllocationModal
//         open={allocationOpen}
//         onClose={() => setAllocationOpen(false)}
//       />
//     </>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dock, Layers } from "lucide-react";
import { useState } from "react";
import ConfigurationWizard from "@/components/configuration/configuration-wizard";
import AllocationModal from "@/components/allocation/allocation-modal";

export default function QuickActions() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<'desktop' | null>(null);
  const [allocationOpen, setAllocationOpen] = useState(false);

  const openWizardWithType = (type: 'desktop') => {
    setWizardType(type);
    setWizardOpen(true);
  };

  const handleWizardClose = () => {
    setWizardOpen(false);
    setWizardType(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Dock Configuration */}
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4 group"
            onClick={() => openWizardWithType('desktop')}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                <Dock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  Dock Config
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  Create new desktop configuration
                </p>
              </div>
            </div>
          </Button>

          {/* Bulk Allocation */}
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4 group"
            onClick={() => setAllocationOpen(true)}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  Bulk Allocation
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  Assign configs to multiple tests
                </p>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <ConfigurationWizard 
        open={wizardOpen} 
        onClose={handleWizardClose}
        initialType={wizardType}
      />

      <AllocationModal
        open={allocationOpen}
        onClose={() => setAllocationOpen(false)}
      />
    </>
  );
}
