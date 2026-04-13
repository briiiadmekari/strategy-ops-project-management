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
  UsersIcon,
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
import { Toggle } from "@/components/ui/toggle";
import { TOKEN_KEY } from "@/constant/auth";
import { useMe } from "@/composables/queries";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: LayoutDashboardIcon },
  { title: "My Tasks", href: "/my-tasks", icon: ClipboardListIcon },
  { title: "All Tasks", href: "/all-tasks", icon: ListChecksIcon },
];

const ADMIN_ITEMS = [
  { title: "Members", href: "/members", icon: UsersIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: meData } = useMe();
  const isSuperadmin = meData?.data?.role === "superadmin";

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

        {isSuperadmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Option</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_ITEMS.map((item) => (
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
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Toggle
                variant="outline"
                size="sm"
                pressed={theme === "dark"}
                onPressedChange={(pressed) =>
                  setTheme(pressed ? "dark" : "light")
                }
                aria-label="Toggle dark mode"
              >
                <SunIcon className="!hidden dark:!block" />
                <MoonIcon className="dark:!hidden" />
              </Toggle>
              <span className="text-sm text-muted-foreground">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-600 bg-red-500/10 dark:bg-red-500/10 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500"
            >
              <LogOutIcon />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
