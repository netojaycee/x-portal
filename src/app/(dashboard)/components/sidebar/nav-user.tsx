"use client";

import { Bell, ChevronsUpDown, School } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/lib/types";
import Logout from "@/components/local/Logout";

export function NavUser({ user }: { user: User | null }) {
  const { isMobile } = useSidebar();
  


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                {user && (
                  <AvatarImage
                    src={
                      user?.avatar?.url
                        ? user.avatar.url
                        : `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                            user?.firstname || "anonymous"
                          )}`
                    }
                    alt={user?.firstname || "anonymous"}
                  />
                )}
                <AvatarFallback className='rounded-lg'>
                  <School className='h-4 w-4' />
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                {user && (
                  <span className='truncate font-semibold'>
                    {user?.firstname || "anonymous"} {user?.lastname || "anonymous"}
                  </span>
                )}
                <span className='truncate text-xs'>{user?.email || "anonymous"}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? "bottom" : "right"}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  {user && (
                    <AvatarImage
                      src={
                        user?.avatar?.url
                          ? user.avatar.url
                          : `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                              user?.firstname || "anonymous"
                            )}`
                      }
                      alt={user?.firstname || "anonymous"}
                    />
                  )}
                  <AvatarFallback className='rounded-lg'>
                    <School className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                {user && (
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.firstname || "anonymous"}
                    </span>
                    <span className='truncate text-xs'>{user?.email || "anonymous"}</span>
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem> */}
            <Logout />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
