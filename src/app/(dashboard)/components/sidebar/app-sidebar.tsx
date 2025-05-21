"use client";

import * as React from "react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SchoolSwitcher } from "./school-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminMenu, superAdminMenu } from "@/lib/menu";
import Logo from "@/components/local/Logo";
import { Separator } from "@/components/ui/separator";
import { ENUM_ROLE } from "@/lib/types/enums";
import { User } from "@/lib/types";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: ENUM_ROLE;
  user: User | null;
}

export function AppSidebar({ role, user, ...props }: AppSidebarProps) {
  const menuData = role === ENUM_ROLE.ADMIN ? adminMenu : superAdminMenu;

  return (
    <Sidebar collapsible='icon' {...props}>
      <div className='w-full  flex items-center justify-center px-2 py-1'>
        {" "}
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-transparent hover:bg-transparent hover:text-white '
        >
          <div className='w-5 flex items-center justify-center'>
            {" "}
            {/* <Image src={"/logo_white_icon.png"} width={16} height={16} alt="logo_icon" className="w-10 h-10 object-cover"/> */}
          </div>
          <div>
            {" "}
            <Logo white />
          </div>
        </SidebarMenuButton>
      </div>
      <Separator className='my-2' />
      <SidebarHeader>
        {user && user.role === ENUM_ROLE.SUPERADMIN && <SchoolSwitcher />}
      </SidebarHeader>
      <SidebarContent className='scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-primary'>
        <NavMain items={menuData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
