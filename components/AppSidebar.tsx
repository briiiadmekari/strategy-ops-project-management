"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  ListChecksIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TOKEN_KEY } from "@/constant/auth";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { title: "My Tasks", href: "/my-tasks", icon: ClipboardListIcon },
  { title: "All Tasks", href: "/all-tasks", icon: ListChecksIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4 flex items-center gap-2 justify-center flex-row">
        <Image
          src="/mekari-icon-default.png"
          alt="Mekari Logo"
          width={40}
          height={40}
          priority
          className="dark:hidden"
        />
        <Image
          src="/mekari-icon-inverse.png"
          alt="Mekari Logo"
          width={40}
          height={40}
          priority
          className="hidden dark:block"
        />
        <span className="text-xs font-semibold tracking-tight text-muted-foreground">
          Strategy Operation Project Management Tool
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <SunIcon className="!hidden dark:!block" />
              <MoonIcon className="dark:!hidden" />
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOutIcon />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
