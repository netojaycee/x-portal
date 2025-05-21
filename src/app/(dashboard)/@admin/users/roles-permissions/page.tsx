"use client";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import NoData from "@/app/(dashboard)/components/NoData";
import LoaderComponent from "@/components/local/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModalState, ModalType, Subrole } from "@/lib/types";
import { ENUM_MODULES } from "@/lib/types/enums";
import { useGetSubrolesQuery } from "@/redux/api";
import { ChevronsRight, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function RolesPermissionsPage() {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error } = useGetSubrolesQuery({
    q: debouncedSearchTerm,
  });

  const subrolesData = data?.data || [];

  console.log(data && data);
  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const router = useRouter();

  const handleSubRoleClick = (subRole: any) => {
    // Store subrole.name in localStorage
    localStorage.setItem("selectedSubRoleName", subRole.name);
    // Navigate to the sub-role details page
    router.push(`/users/roles-permissions/${subRole.id}`);
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between gap-2'>
        <div className='relative w-64'>
          <Input
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 rounded-2xl bg-white'
          />
          <Search className='absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2 text-gray-400' />
        </div>

        <div className='flex items-center gap-2'>
          {/* {filters.showFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='rounded-md flex items-center gap-2'
                >
                  Filter <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[200px] '>
                <DropdownMenuItem onClick={() => {}}>All</DropdownMenuItem>
                {filterOptions.map((option) => (
                  <DropdownMenuItem key={option} onClick={() => {}}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )} */}

          <Button
            onClick={() => openModal("add", null)}
            className='rounded-md flex items-center gap-2 bg-primary text-white'
          >
            <Plus /> Create role
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 py-4 gap-4'>
        {isLoading ? (
          <div className='h-[20vh] flex flex-col items-center justify-center py-8'>
            <LoaderComponent />
          </div>
        ) : isError ? (
          <div className='col-span-full flex flex-col items-center justify-center py-8'>
            <p className='text-red-500 font-semibold mb-2'>
              Failed to load roles.
            </p>
            <p className='text-gray-500 text-sm'>
              {(() => {
                if (!error) return "An unexpected error occurred.";
                if ("message" in error && typeof error.message === "string") {
                  return error.message;
                }
                if ("status" in error && "data" in error) {
                  // Try to extract a message from error.data if possible
                  if (
                    typeof error.data === "object" &&
                    error.data !== null &&
                    "message" in error.data &&
                    typeof (error.data as any).message === "string"
                  ) {
                    return (error.data as any).message;
                  }
                  return `Error status: ${error.status}`;
                }
                return "An unexpected error occurred.";
              })()}
            </p>
          </div>
        ) : subrolesData.length === 0 ? (
          <div className='col-span-full flex flex-col items-center justify-center py-8'>
            <NoData text='No roles found' />
          </div>
        ) : (
          subrolesData.map((subrole: Subrole) => (
            <Card
              key={subrole.id}
              onClick={() => handleSubRoleClick(subrole)}
              className=' bg-[#FFFFEA] hover:bg-[#F7F7E9] cursor-pointer shadow-md transition duration-200 ease-in-out'
            >
              <CardContent>
                <div className='flex flex-col py-4 items-center justify-center'>
                  <span className='font-bold tex-lg md:text-xl flex items-center'>
                    <p>{subrole.name}</p> <ChevronsRight />
                  </span>
                  <span className='text-sm text-gray-600'>
                    Click to set permission
                  </span>
                  <span className='text-sm font-semibold text-primary'>
                    {subrole.permissions.length}/20
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {modal.type === "add" && (
        <CustomModal
          open={modal.type === "add"}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SUBROLE}
        />
      )}

      {modal.type === "edit" && (
        <CustomModal
          open={modal.type === "edit"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          isEditMode={true}
          type={ENUM_MODULES.SUBROLE}
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.data}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SUBROLE}
          status={"delete"}
        />
      )}
    </div>
  );
}
