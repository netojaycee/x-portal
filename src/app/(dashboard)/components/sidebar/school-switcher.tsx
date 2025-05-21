// components/SchoolSwitcher.tsx
"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  Loader2,
  Search,
  UserCog,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useSetViewAsMutation, useGetSchoolsQuery } from "@/redux/api";
import { School } from "@/lib/types/school";
import { RootState } from "@/redux/store";
import { useDebounce } from "use-debounce";
import { ENUM_ROLE } from "@/lib/types/enums";
import NoData from "../NoData";

export function SchoolSwitcher() {
  const { isMobile } = useSidebar();
  const { user } = useSelector((state: RootState) => state.user);
  const [activeSchool, setActiveSchool] = React.useState<School | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [page, setPage] = React.useState(1);
  const [open, setOpen] = React.useState(false);

  const [setViewAs, { isLoading: isToggling, isSuccess, isError, error }] =
    useSetViewAsMutation();

  // Fetch schools
  const { data, isLoading, isFetching } = useGetSchoolsQuery({
    search: debouncedSearchTerm,
    page,
    limit: 5,
  });

  const schools = React.useMemo(() => data?.schools || [], [data?.schools]);
  const total = data?.total || 0;
  const hasMore = page * 5 < total;

  // console.log(user);

  // Set active school based on user.schoolId
  React.useEffect(() => {
    if (user?.schoolId && schools.length > 0) {
      const school = schools.find((s) => s.id === user.schoolId);
      setActiveSchool(school || null);
    } else {
      setActiveSchool(null);
    }
  }, [user?.schoolId, schools]);

  // Handle view_as toggle
  const handleToggle = async (value: ENUM_ROLE, schoolId: string) => {
    if (!user) return;
    try {
      await setViewAs({ view_as: value, schoolId }).unwrap();
      // window.location.href = "/dashboard"; // Force reload
    } catch (error) {
      console.error("Failed to toggle view:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      // router.refresh("/dashboard");
      window.location.href = "/dashboard"; // Force reload
    } else if (isError && error) {
      const errorMessage =
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "error" in error.data
          ? (error.data as { message?: string }).message
          : "An error occurred. Please try again.";
      console.log(errorMessage);
    }
  }, [isSuccess, isError, error]);

  // Switch to a school (view_as: ADMIN)
  const switchToSchool = (school: School) => {
    setActiveSchool(school);
    handleToggle(ENUM_ROLE.ADMIN, school.id);
    setOpen(false);
  };

  // Switch to SuperAdmin
  const switchToSuperAdmin = () => {
    if (!user?.schoolId) return;
    handleToggle(ENUM_ROLE.SUPERADMIN, "");
    setOpen(false);
    setActiveSchool(null);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-white border'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {activeSchool ? (
                  <Image
                    src={
                      activeSchool?.logo?.url
                        ? activeSchool?.logo?.url
                        : `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                            activeSchool.name
                          )}`
                    }
                    alt=''
                    className='size-4 object-cover'
                    width={16}
                    height={16}
                    priority
                  />
                ) : (
                  <GalleryVerticalEnd className='size-4' />
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeSchool?.name || "Select a School"}
                </span>
                <span className='truncate text-xs'>
                  {activeSchool?.subscriptionId || ""}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent className={`p-4 ${isMobile ? "w-full" : "max-w-lg"}`}>
            <DialogHeader className='flex flex-row items-center justify-between'>
              <DialogTitle className='sr-only'>Schools</DialogTitle>
              {user?.role === ENUM_ROLE.SUPERADMIN &&
                user?.view_as === ENUM_ROLE.ADMIN && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={switchToSuperAdmin}
                    className='flex items-center gap-2'
                    disabled={isToggling || !user?.schoolId}
                  >
                    <UserCog className='h-4 w-4' />
                    Switch to SuperAdmin
                  </Button>
                )}
            </DialogHeader>
            <div className='my-2'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search schools...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-8'
                  disabled={isLoading || isFetching}
                />
              </div>
            </div>
            <ScrollArea className='h-[300px] rounded-md border'>
              <div className='p-2 space-y-2'>
                {isLoading || isFetching ? (
                  <div className='flex justify-center p-4'>
                    <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
                  </div>
                ) : schools.length > 0 ? (
                  schools.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => switchToSchool(school)}
                      className='flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer border'
                    >
                      <div className='flex size-6 items-center justify-center rounded-sm border'>
                        {school ? (
                          <Image
                            src={
                              school?.logo?.url
                                ? school?.logo?.url
                                : `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                                    school.name
                                  )}`
                            }
                            alt=''
                            className='size-4 object-cover'
                            width={16}
                            height={16}
                          />
                        ) : (
                          <GalleryVerticalEnd className='size-4' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>{school.name}</div>
                        <div className='text-xs text-muted-foreground'>
                          {school.subscriptionId}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData text={"No School Found"} />
                )}
                {hasMore && (
                  <Button
                    variant='outline'
                    className='w-full mt-2'
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isFetching}
                  >
                    {isFetching && <Loader2 className='animate-spin w-4 h-4' />}
                    {isFetching ? "Loading..." : "Load More"}
                  </Button>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
