import { Search, Plus, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ConfigurationWizard from "@/components/configuration/configuration-wizard";

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Configuration Dashboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage test configurations and allocations
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search configurations..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* Quick Actions */}
            <Button 
              onClick={() => setWizardOpen(true)}
              className="font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Config
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
      </header>

      <ConfigurationWizard 
        open={wizardOpen} 
        onClose={() => setWizardOpen(false)} 
      />
    </>
  );
}
