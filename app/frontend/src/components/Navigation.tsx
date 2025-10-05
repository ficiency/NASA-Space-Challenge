import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Flower, Map } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Bloom Dashboard',
      icon: Flower,
    },
    {
      id: 'map',
      label: 'Monterrey Bloom Map',
      icon: Map,
    }
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Flower className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2>BloomingHealth</h2>
            <p className="text-muted-foreground">Health & Bloom Tracker</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={currentPage === item.id}
                onClick={() => onPageChange(item.id)}
                className="w-full justify-start"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}