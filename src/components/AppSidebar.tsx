
import { Home, Plus, History, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, id: "home" },
  { title: "Adicionar", icon: Plus, id: "add" },
  { title: "Histórico", icon: History, id: "history" },
  { title: "Configurações", icon: Settings, id: "settings" },
];

interface AppSidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export const AppSidebar = ({ activeItem, onItemClick }: AppSidebarProps) => {
  return (
    <Sidebar className="w-16 md:w-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-white/20 dark:border-gray-700/50">
      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onItemClick(item.id)}
                    className={`w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                      activeItem === item.id
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 hover:text-white hover:shadow-md hover:scale-102"
                    }`}
                  >
                    <item.icon className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="text-xs mt-1 hidden md:block">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
