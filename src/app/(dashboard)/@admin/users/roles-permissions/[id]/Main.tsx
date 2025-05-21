"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  useGetPermissionsSchoolQuery,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
} from "@/redux/api";
import LoaderComponent from "@/components/local/LoaderComponent";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RolePermissionsProps {
  roleId: string;
}

export const Main: React.FC<RolePermissionsProps> = ({ roleId }) => {
  const router = useRouter();
  const { data: allPermissions = [], isLoading: loadingAll } =
    useGetPermissionsSchoolQuery();
  const { data: rolePermissions = [], isLoading: loadingRole } =
    useGetRolePermissionsQuery(roleId);
  const [
    updateRolePermissions,
    { isLoading: isSaving, isError, error, isSuccess },
  ] = useUpdateRolePermissionsMutation();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const subroleName = localStorage.getItem("selectedSubRoleName");
  // useEffect(() => {
  //   const subroleName = localStorage.getItem("selectedSubRoleName");
  // }, []);

  // Initialize selectedIds when rolePermissions load
  useEffect(() => {
    if (rolePermissions) {
      setSelectedIds(new Set(rolePermissions.map((p) => p.id)));
    }
  }, [rolePermissions]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(allPermissions.map((p) => p.id)));
  };

  const handleSelectNone = () => {
    setSelectedIds(new Set());
  };

  const handleSave = async () => {
    await updateRolePermissions({
      roleId,
      permissionIds: Array.from(selectedIds),
    }).unwrap();
    // TODO: show success notification/toast
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Role permissions updated successfully");
    } else if (isError && error) {
      const errorMessage =
        "data" in error && typeof error.data === "object" && error.data
          ? (error.data as { message?: string })?.message
          : "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error]);

  if (loadingAll || loadingRole) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-4'>
        {/* back button with role name */}
        <Button
          className='cursor-pointer'
          variant='ghost'
          onClick={() => router.back()}
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Roles & Permissions / {subroleName}
        </Button>
      </div>
      <div className='flex items-center justify-between mb-4'>
        <div className='space-y-3'>
          {" "}
          <h2 className='text-lg font-semibold'>{subroleName} Permissions</h2>
          <p className='text-sm text-muted-foreground'>
            Select the permissions suitable for this role.
          </p>
        </div>

        {/* Selection filter: Select All / None */}
        <Select
          onValueChange={(value) => {
            if (value === "all") handleSelectAll();
            if (value === "none") handleSelectNone();
          }}
          defaultValue=''
        >
          <SelectTrigger className='w-36'>
            <SelectValue placeholder='Selection' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Select All</SelectItem>
            <SelectItem value='none'>Select None</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className='p-4'>
        <div className='grid grid-cols-5 gap-3 max-h-[70vh] overflow-y-auto'>
          {allPermissions.map((perm) => (
            <div key={perm.id} className='flex items-center space-x-2'>
              <Checkbox
                id={`perm-${perm.id}`}
                checked={selectedIds.has(perm.id)}
                onCheckedChange={() => handleToggle(perm.id)}
              />
              <Label htmlFor={`perm-${perm.id}`} className='capitalize text-[12px]'>
                {perm.name}
              </Label>
            </div>
          ))}
        </div>

        <div className='mt-6 flex justify-center'>
          <Button
            type='submit'
            disabled={isSaving}
            onClick={handleSave}
            className='flex items-center justify-center gap-2 bg-primary hover:bg-primary/90'
          >
            {isSaving ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Please wait</span>
              </>
            ) : (
              <>
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
