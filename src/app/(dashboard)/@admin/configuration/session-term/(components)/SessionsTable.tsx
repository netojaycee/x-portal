"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {  Pencil, Plus, Trash } from "lucide-react";
import { ENUM_MODULES } from "@/lib/types/enums";
import LoaderComponent from "@/components/local/LoaderComponent";
import NoData from "@/app/(dashboard)/components/NoData";
import { CustomModal } from "@/app/(dashboard)/components/modals/CustomModal";
import { Switch } from "@/components/ui/switch";
import { ModalType } from "@/lib/types";

// Define types for session and term data
interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
}

interface Session {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  terms: Term[];
}

interface ModalState {
  type: ModalType;
  session?: Session;
}

interface SessionTablesProps {
  sessions: Session[];
  isLoading?: boolean;
}

const SessionTables: React.FC<SessionTablesProps> = ({
  sessions,
  isLoading,
}) => {
  const [modal, setModal] = useState<ModalState>({ type: null });

  const openModal = (
    type: Exclude<ModalState["type"], null>,
    session: Session
  ) => setModal({ type, session });

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal({ type: null });
  };

  const getActionOptions = (session: Session) => {
    const otherOptions = [
      {
        key: "session",
        label: "Assign Arm",
        type: "custom" as const,
        handler: () => openModal("status", session),
      },
      {
        key: "session",
        label: "Edit",
        type: "edit" as const,
        handler: () => openModal("edit", session),
      },
      {
        key: "session",
        label: "Delete",
        type: "confirmation" as const,
        handler: () => openModal("delete", session),
      },
    ];

    return [...otherOptions];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className='space-y-6'>
      {/* Action Button */}
      <div className='flex justify-end'>
        <Button
          onClick={() => openModal("add", {} as Session)} // Empty session for create mode
          className='rounded-md flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600'
        >
          <Plus className='h-4 w-4' />
          Add New Session
        </Button>
      </div>

      {/* Render a table for each session */}
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <div
            key={session.id}
            className='border rounded-2xl border-gray-300 p-4'
          >
            {/* Session Header */}
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2 '>
                <h3 className='text-base font-semibold font-lato'>
                  {session.name} Session
                </h3>
                <span
                  className={` ${
                    session.status === "Active" ? "bg-[#E1E8F8]" : "bg-white"
                  } rounded-full flex items-center gap-1 px-[3px] py-[2px]`}
                >
                  {" "}
                  <Switch
                    checked={session.status === "Active"}
                    className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-400'
                    disabled
                  />{" "}
                  <p className='text-xs font-semibold text-gray-500'>
                    {session.status === "Active" ? "Activated" : "Deactivated"}
                  </p>
                </span>
              </div>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {getActionOptions(session).map((action) => (
                    <DropdownMenuItem
                      key={action.label}
                      onClick={() => action.handler(session)}
                    >
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu> */}
              <div className='flex items-center gap-2'>
                {getActionOptions(session).map((action) => (
                  <Button
                    key={action.label}
                    className={`text-xs rounded-md flex items-center gap-2 ${
                      action.label === "Assign Arm"
                        ? "bg-primary text-white hover:bg-primary/90"
                        : action.label === "Edit"
                        ? "border border-primary text-primary bg-white hover:bg-gray-100"
                        : "bg-gray-100 text-black hover:bg-gray-200 border border-gray-300"
                    }`}
                    onClick={() => action.handler()}
                  >
                    {action.label === "Edit" && <Pencil className='h-4 w-4' />}
                    {action.label === "Delete" && <Trash className='h-4 w-4' />}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Terms Table */}
            <div className='w-full mx-auto'>
              <Table className='w-full'>
                <TableHeader className='bg-[#E1E8F8] rounded-t-2xl'>
                  <TableRow>
                    <TableHead className='font-semibold text-gray-700'>
                      Term Name
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Start Date
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      End Date
                    </TableHead>
                    <TableHead className='font-semibold text-gray-700'>
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='bg-white'>
                  {session.terms.length > 0 ? (
                    session.terms.map((term) => (
                      <TableRow key={term.id}>
                        <TableCell>{term.name}</TableCell>
                        <TableCell>
                          {new Date(term.startDate).toISOString().slice(0, 10)}
                        </TableCell>
                        <TableCell>
                          {new Date(term.endDate).toISOString().slice(0, 10)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`flex items-center gap-2 w-32 px-2 py-1 rounded-2xl text-xs font-medium ${getStatusColor(
                              term.status
                            )} bg-opacity-70`}
                            style={{
                              backgroundColor:
                                term.status === "Active"
                                  ? "rgba(34,197,94,0.07)" // green-500/70
                                  : "rgba(239,68,68,0.07)", // red-500/70
                              color:
                                term.status === "Active"
                                  ? "#22c55e" // green-500
                                  : "#ef4444", // red-500
                            }}
                          >
                            <span
                              className='inline-block w-2 h-2 rounded-full'
                              style={{
                                backgroundColor:
                                  term.status === "Active"
                                    ? "#22c55e"
                                    : "#ef4444",
                              }}
                            />
                            {term.status === "Active"
                              ? "Current term"
                              : "Inactive"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center py-8'>
                        <NoData text='No terms found for this session' />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      ) : (
        <div className='text-center py-8'>
          <NoData text='No sessions found' />
        </div>
      )}

      {/* Modals */}
      {modal.type === "edit" && (
        <CustomModal
          open={modal.type === "edit"}
          selectedRow={modal.session}
          onOpenChange={handleModalOpenChange}
          isEditMode={true}
          type={ENUM_MODULES.SESSION}
        />
      )}

      {modal.type === "add" && (
        <CustomModal
          open={modal.type === "add"}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SESSION}
        />
      )}

      {modal.type === "status" && (
        <CustomModal
          open={modal.type === "status"}
          selectedRow={modal.session}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SESSION}
          status='custom'
        />
      )}

      {modal.type === "delete" && (
        <CustomModal
          open={modal.type === "delete"}
          selectedRow={modal.session}
          onOpenChange={handleModalOpenChange}
          type={ENUM_MODULES.SESSION}
          status='delete'
        />
      )}
    </div>
  );
};
export default SessionTables;
