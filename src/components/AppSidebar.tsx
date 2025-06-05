
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Trophy,
  Users,
  MessageCircle,
  User,
  Plus,
  Crown,
  Settings
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: Trophy },
  { title: "Leaderboard", url: "/leaderboard", icon: Crown },
  { title: "Find Players", url: "/players", icon: Users },
  { title: "Social Hub", url: "/social", icon: MessageCircle },
  { title: "Profile", url: "/profile", icon: User },
];

const tournamentItems = [
  { title: "Create Tournament", url: "/create-tournament", icon: Plus },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-purple-600/20 text-cyan-400 border-r-2 border-cyan-400" 
      : "text-gray-300 hover:bg-purple-600/10 hover:text-white";
  };

  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-purple-500/30 bg-gradient-to-b from-gray-900 to-purple-900/50">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-cyan-400 font-bold text-sm uppercase tracking-wide">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClass(item.url)} transition-all duration-200 flex items-center space-x-3 px-3 py-2 rounded-lg`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tournament Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-cyan-400 font-bold text-sm uppercase tracking-wide">
            {!collapsed && "Tournaments"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tournamentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClass(item.url)} transition-all duration-200 flex items-center space-x-3 px-3 py-2 rounded-lg`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
