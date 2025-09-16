import {
  Home,
  MessageCircle,
  BookOpen,
  Users,
  Palette,
  Heart,
  Target,
  Settings,
  Shield,
  Phone,
  User,
  Brain,
  PenTool
} from "lucide-react";
import { Link, useLocation } from "wouter";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Assessment",
    url: "/onboarding",
    icon: Brain,
  },
  {
    title: "AI Buddy",
    url: "/ai-buddy",
    icon: MessageCircle,
  },
  {
    title: "Personal Diary",
    url: "/diary",
    icon: PenTool,
  },
  {
    title: "Wellness",
    url: "/wellness",
    icon: Heart,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Target,
  },
];

const supportItems = [
  {
    title: "Anonymous Chat",
    url: "/anonymous-chat",
    icon: Shield,
  },
  {
    title: "Peer Support",
    url: "/peer-support",
    icon: Users,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: BookOpen,
  },
  {
    title: "Creative Zone",
    url: "/creative",
    icon: Palette,
  },
];

const helpItems = [
  {
    title: "Crisis Support",
    url: "/crisis",
    icon: Phone,
  },
  {
    title: "Report Issue",
    url: "/report",
    icon: Shield,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  const isActive = (url: string) => {
    if (url === "/" && location === "/") return true;
    if (url !== "/" && location.startsWith(url)) return true;
    return false;
  };

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Wellness</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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