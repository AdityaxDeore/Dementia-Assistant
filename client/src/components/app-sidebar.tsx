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
  PenTool,
  UserCheck,
  Gamepad2,
  Castle,
  GraduationCap,
  AlertTriangle,
  BarChart
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
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Cognitive Assessment",
    url: "/assessment",
    icon: Brain,
  },
  {
    title: "Cognitive Support",
    url: "/ai-buddy",
    icon: MessageCircle,
  },
  {
    title: "Memory Journal",
    url: "/diary",
    icon: PenTool,
  },
  {
    title: "Daily Care",
    url: "/wellness",
    icon: Heart,
  },
  {
    title: "Care Routines",
    url: "/goals",
    icon: Target,
  },
  {
    title: "Memory Games",
    url: "/petcare-game",
    icon: Gamepad2,
  },
  {
    title: "Cognitive Tools",
    url: "/inner-gatekeeper",
    icon: Castle,
  },
];

const supportItems = [
  {
    title: "Caregiver Support",
    url: "/mentorship",
    icon: UserCheck,
  },
  {
    title: "Healthcare Connect",
    url: "/anonymous-chat",
    icon: User,
  },
  {
    title: "Caregiver Community",
    url: "/peer-support",
    icon: Users,
  },
  {
    title: "Professional Network",
    url: "/professional-community",
    icon: GraduationCap,
  },
  {
    title: "Care Resources",
    url: "/resources",
    icon: BookOpen,
  },
  {
    title: "Memory Activities",
    url: "/creative",
    icon: Palette,
  },
];

const helpItems = [
  {
    title: "Emergency Care",
    url: "/crisis",
    icon: AlertTriangle,
  },
  {
    title: "Care Safety",
    url: "/anti-ragging",
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
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = (url: string) => {
    if (url === "/dashboard" && location === "/dashboard") return true;
    if (url !== "/dashboard" && location.startsWith(url)) return true;
    return false;
  };

  // Handle navigation with auto-close functionality
  const handleNavigation = () => {
    // Auto-close sidebar on mobile when navigation occurs
    if (isMobile) {
      setTimeout(() => {
        setOpenMobile(false);
      }, 150); // Small delay for better UX
    }
  };

  return (
    <Sidebar data-testid="sidebar-main" className="modern-card border-0 shadow-lg">
      <SidebarContent className="bg-background/50 pt-4 sm:pt-5 md:pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground px-3 py-2">Wellness</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                    className={`modern-button group px-3 py-2 rounded-xl transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] active:scale-[0.98] ${
                      isActive(item.url) ? 'bg-primary text-primary-foreground shadow-md' : ''
                    }`}
                  >
                    <Link 
                      href={item.url} 
                      className="flex items-center gap-3"
                      onClick={handleNavigation}
                    >
                      <item.icon className="w-5 h-5 icon-interactive transition-transform duration-200" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground px-3 py-2">Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                    className={`modern-button group px-3 py-2 rounded-xl transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] active:scale-[0.98] ${
                      isActive(item.url) ? 'bg-primary text-primary-foreground shadow-md' : ''
                    }`}
                  >
                    <Link 
                      href={item.url} 
                      className="flex items-center gap-3"
                      onClick={handleNavigation}
                    >
                      <item.icon className="w-5 h-5 icon-interactive transition-transform duration-200" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground px-3 py-2">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                    className={`modern-button group px-3 py-2 rounded-xl transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] active:scale-[0.98] ${
                      isActive(item.url) ? 'bg-primary text-primary-foreground shadow-md' : ''
                    }`}
                  >
                    <Link 
                      href={item.url} 
                      className="flex items-center gap-3"
                      onClick={handleNavigation}
                    >
                      <item.icon className="w-5 h-5 icon-interactive transition-transform duration-200" />
                      <span className="text-sm font-medium">{item.title}</span>
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