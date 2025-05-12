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
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminMenu, superAdminMenu } from "@/lib/menu";
import Logo from "@/components/local/Logo";
import { Separator } from "@/components/ui/separator";
import { ENUM_ROLE } from "@/lib/types/enums";
import { User } from "@/lib/types";

// This is sample data.
// const data = {
//   schools: [
//     {
//       name: "Acme Inc",
//       logo: "/cap.svg",
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       logo: "/avatar.svg",
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: "/computer.svg",
//       plan: "Free",
//     },
//   ],
// };

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: ENUM_ROLE;
  user: User | null;
}

export function AppSidebar({ role, user, ...props }: AppSidebarProps) {
  const menuData = role === ENUM_ROLE.ADMIN ? adminMenu : superAdminMenu;
//  fetch school here

  return (
    <Sidebar collapsible='icon' {...props}>
      <div className='py-3'>
        {" "}
        <Logo white />
      </div>
      <Separator className='my-2' />
      <SidebarHeader>
        {user && user.role === ENUM_ROLE.SUPERADMIN && (
          <SchoolSwitcher
            // viewAs={role}
            // actualRole={user.role}
            // schools={data.schools}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
