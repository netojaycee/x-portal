"use client";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModalState, ModalType } from "@/lib/types";
import { ENUM_MODULES } from "@/lib/types/enums";
import { ChevronsRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RolesPermissionsPage() {
  const [modal, setModal] = useState<ModalState>({ type: null });

  const openModal = (type: Exclude<ModalType, "">, row: any) =>
    setModal({ type, data: row });

  // unified handler
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between gap-2'>
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

        <div className='relative w-64'>
          <Input
            placeholder='Search...'
            // value={searchTerm}
            // onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10 rounded-2xl bg-white'
          />
          <Search className='absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2 text-gray-400' />
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 py-4'>
        <Link href={`/users/roles-permissions/${"g"}`} className=''>
          <Card className='w-[300px] bg-[#FFFFEA]'>
            <CardContent>
              <div className='flex flex-col py-4 items-center justify-center'>
                <span className='font-bold tex-lg md:text-xl flex items-center'>
                  <p>Role Permissions</p> <ChevronsRight />
                </span>
                <span className='text-sm text-gray-600'>
                  Click to set permission
                </span>
                <span className='text-sm font-semibold text-primary'>
                  15/20
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
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
