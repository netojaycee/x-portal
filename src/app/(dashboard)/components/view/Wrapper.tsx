"use client";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";
import {
  Bell,
  Calendar,
  ChevronDown,
  CreditCard,
  Loader2,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ENUM_ROLE } from "@/lib/types/enums";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Logout from "@/components/local/Logout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useGetSessionsQuery } from "@/redux/api";

function getActiveTermSessionText(sessions: any[]): string {
  // Find the current session (where status is true)
  const currentSession = sessions.find((session) => session.status === true);

  if (!currentSession) {
    return "No active term";
  }

  // Find the current term within the current session (where status is true)
  const currentTerm = currentSession.terms.find(
    (term: any) => term.status === true
  );

  if (!currentTerm) {
    return "No active term";
  }

  return `${currentTerm.name} ${currentSession.name}`;
}

export default function Wrapper({
  children,
  pageTitle,
  role = ENUM_ROLE.ADMIN,
  wrapperStyle,
}: {
  wrapperStyle?: string;
  children: React.ReactNode;
  pageTitle?: string;
  role?: ENUM_ROLE;
}) {
  const userData = useSelector((state: RootState) => state.user.user);
  const { data, isLoading } = useGetSessionsQuery(
    {},
    { skip: !userData.schoolId }
  );
  // console.log("Sessions data", data && data);
  const sessions = data?.data || [];
  console.log(wrapperStyle, pageTitle);

  return (
    <SidebarProvider>
      <AppSidebar user={userData} role={role} />
      <SidebarInset>
        <header className='fixed top-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 bg-white shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:lg:left-16 group-has-[[data-collapsible=collapsed]]/sidebar-wrapper:lg:left-0 lg:left-64'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <p className='text-sm font-semibold text-muted-foreground font-lato'>
              Welcome, {userData?.firstname || userData?.email || "Anonymous"}!
            </p>
          </div>

          <div className='flex items-center gap-6 px-4'>
            {role === ENUM_ROLE.ADMIN && (
              <span className='flex items-center gap-3 text-[#4A4A4A]'>
                <Calendar className='size-4' />
                {isLoading ? (
                  <Loader2 className='animate-spin w-4 h-4' />
                ) : (
                  <p className='text-sm'>
                    {getActiveTermSessionText(sessions)}
                  </p>
                )}
              </span>
            )}
            <div className='border h-5 border-yellow-300' />
            <Bell className='h-5 w-5 text-muted-foreground' />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-3 cursor-pointer'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    {userData && (
                      <AvatarImage
                        src={
                          userData?.avatar?.url
                            ? userData.avatar.url
                            : `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                                userData?.firstname || "anonymous"
                              )}`
                        }
                        alt={userData?.firstname || "Anonymous"}
                      />
                    )}
                  </Avatar>{" "}
                  {userData ? (
                    <span className='hidden md:inline-flex font-lato font-semibold text-sm'>
                      {userData?.firstname || "Anonymous"}{" "}
                      {userData?.lastname || "Anonymous"}
                    </span>
                  ) : (
                    <span className='hidden md:inline-flex font-lato font-semibold text-sm'>
                      Anonymous
                    </span>
                  )}
                  <ChevronDown className='ml-auto h-4 w-4 text-muted-foreground' />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/payment")}
                  >
                    <CreditCard />
                    Subscription
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <Logout />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-16 bg-[#f5f5f5] min-h-screen '>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
