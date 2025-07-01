
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
    <Sidebar className="w-20 bg-gray-200 dark:bg-gray-800">
      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onItemClick(item.id)}
                    className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg transition-colors ${
                      activeItem === item.id
                        ? "bg-white dark:bg-gray-700 shadow-md"
                        : "hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    <item.icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">
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
