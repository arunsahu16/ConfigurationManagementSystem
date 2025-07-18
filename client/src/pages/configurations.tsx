import { useState } from "react";
import ConfigurationList from "@/components/configuration/configuration-list";
import ConfigurationWizard from "@/components/configuration/configuration-wizard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Configuration } from "@shared/schema";

export default function Configurations() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null);

  const handleEdit = (config: Configuration) => {
    setEditingConfig(config);
    setWizardOpen(true);
  };

  const handleDuplicate = (config: Configuration) => {
    // Create a copy of the configuration for duplication
    console.log("Duplicate configuration:", config);
    setWizardOpen(true);
  };

  const handleWizardClose = () => {
    setWizardOpen(false);
    setEditingConfig(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage test configurations for different environments and devices
          </p>
        </div>
        
        <Button onClick={() => setWizardOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Configuration</span>
        </Button>
      </div>

      <ConfigurationList
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
      />

      <ConfigurationWizard
        open={wizardOpen}
        onClose={handleWizardClose}
      />
    </div>
  );
}
