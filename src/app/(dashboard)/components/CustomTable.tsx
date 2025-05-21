"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
// import { ModalComponent } from "./modals/ModalComponent";
// import { AddSubscriptionModal } from "./modals/AddSubsriptionModal";
// import { AddSchoolModal } from "./modals/AddSchoolModal";
// import { AddStudentModal } from "./modals/AddStudentModals";
import { ENUM_MODULES } from "@/lib/types/enums";
import { CustomModal } from "./modals/CustomModal";
import NoData from "./NoData";

// Define types for the table data and configuration
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

interface FilterConfig {
  showSearch?: boolean;
  showFilter?: boolean;
}

interface ActionOption {
  label: string;
  type: "confirmation" | "edit" | "custom";
  handler: (row: any) => void;
  key: string;
}

interface CustomTableProps {
  columns: TableColumn[];
  data: any[];
  filters?: FilterConfig;
  rowsPerPageOptions?: number[];
  pagination?: boolean;
  showRowsPerPage?: boolean;
  showResultsInfo?: boolean;
  showActionButton?: boolean;
  actionButtonText?: string;
  actionButtonIcon?: React.ReactNode;
  title?: string;
  actionOptions?: ActionOption[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (limit: number) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  totalItems?: number;
  getActionOptions?: (row: any) => ActionOption[];
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  filters = { showSearch: true, showFilter: false },
  rowsPerPageOptions = [10, 50, 100, 200, 1000],
  pagination = true,
  showRowsPerPage = true,
  showResultsInfo = true,
  showActionButton = false,
  actionButtonText = "Action",
  actionButtonIcon = <Filter className='h-4 w-4' />,
  title,
  actionOptions = [],
  currentPage,
  onPageChange,
  rowsPerPage = 10,
  onRowsPerPageChange,
  searchTerm,
  onSearchChange,
  totalItems,
  getActionOptions,
}) => {
  // State for filters, sorting, and pagination

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  // const [modalType, setModalType] = useState<
  //   | "confirmation"
  //   | "editSchool"
  //   | "editSubscription"
  //   | "assignPermission"
  //   | "addSchool"
  //   | "addSubscription"
  //   | "addStudent"
  //   | "editStudent"
  //   | null
  // >(null);
  const [modal, setModal] = useState<ENUM_MODULES | null>(null);

  // const [selectedRow, setSelectedRow] = useState<any>(null);
  // const [actionLabel, setActionLabel] = useState<string>("");

  // Extract unique filter values (e.g., status or plan)
  const filterOptions = useMemo(() => {
    const statuses = Array.from(
      new Set(data.map((item) => item.status))
    ).filter(Boolean);
    const plans = Array.from(
      new Set(data.map((item) => item.plan || item.subPlan))
    ).filter(Boolean);
    return [...statuses, ...plans];
  }, [data]);

  const totalPages = Math.ceil((totalItems ?? 1) / rowsPerPage);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Status color mapping
  const getStatusColor = (status: string | boolean) => {
    switch (typeof status === "string" ? status.toLowerCase() : status) {
      case "active":
        return "bg-green-100 text-green-800";
      case true:
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case false:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Modal handlers
  // const handleActionClick = (row: any, action: ActionOption) => {
  //   setSelectedRow(row);
  //   setActionLabel(action.label);
  //   if (action.type === "confirmation") {
  //     setModalType("confirmation");
  //   } else if (action.type === "edit") {
  //     setModalType(
  //       action.key === "subscription"
  //         ? "editSubscription"
  //         : action.key === "student"
  //         ? "editStudent"
  //         : "editSchool"
  //     );
  //   } else if (
  //     action.type === "custom" &&
  //     action.label === "Assign Permission"
  //   ) {
  //     setModalType("assignPermission");
  //   }
  //   action.handler(row); // Call the table-specific handler
  // };

  // const handleConfirmation = async () => {
  //   console.log(`Performing ${actionLabel} for`, selectedRow);
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  //   setModalType(null);
  //   setSelectedRow(null);
  //   setActionLabel("");
  // };

  // const handleEditSchool = async (updatedData: any) => {
  //   console.log(`Updating school ${selectedRow?.name} with`, updatedData);
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  //   setModalType(null);
  //   setSelectedRow(null);
  // };

  // const handleEditSubscription = async (updatedData: any) => {
  //   console.log(
  //     `Updating subscription ${selectedRow?.package} with`,
  //     updatedData
  //   );
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  //   setModalType(null);
  //   setSelectedRow(null);
  // };

  // const handleAssignPermission = async (permissions: string[]) => {
  //   console.log(`Assigning permissions to ${selectedRow?.name}:`, permissions);
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  //   setModalType(null);
  //   setSelectedRow(null);
  // };

  // const handleModalClose = () => {
  //   setModalType(null);
  //   setSelectedRow(null);
  //   setActionLabel("");
  // };

  // const handleAddClick = () => {
  //   setModalType(
  // title === "Schools List"
  //   ? "addSchool"
  //   : title === "Students List"
  //   ? "addStudent"
  //   : "addSubscription"
  //   );
  // };

  // const handleEditStudent = async (updatedData: any) => {
  //   console.log(`Updating student ${selectedRow?.package} with`, updatedData);
  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  //   setModalType(null);
  //   setSelectedRow(null);
  // };

  const openModal = (type: Exclude<ENUM_MODULES | null, "">) => setModal(type);
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) setModal(null);
  };

  return (
    <div className='space-y-4'>
      {/* Top: Search, Filter, Action Button */}
      <div className='flex items-center justify-between gap-2'>
        {filters.showSearch && (
          <div className='relative w-64'>
            <Input
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className='pl-10 rounded-2xl'
            />
            <Search className='absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2 text-gray-400' />
          </div>
        )}
        <div className='flex items-center gap-2'>
          {filters.showFilter && (
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
          )}
          {showActionButton && (
            <Button
              onClick={() =>
                openModal(
                  title === "Schools List"
                    ? ENUM_MODULES.SCHOOL
                    : title === "Students List"
                    ? ENUM_MODULES.STUDENT
                    : title === "Subscription Plans"
                    ? ENUM_MODULES.SUBSCRIPTION
                    : title === "Users List"
                    ? ENUM_MODULES.USER
                    : null
                )
              }
              className='rounded-md flex items-center gap-2 bg-primary text-white'
            >
              {actionButtonIcon}
              {actionButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Title */}
      {title && (
        <h2 className='text-base md:text-xl font-semibold font-lato'>
          {title}
        </h2>
      )}

      {/* Table */}
      <Table className='bg-white rounded-2xl'>
        <TableHeader className='bg-[#E1E8F8]'>
          <TableRow className=''>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`${
                  column.sortable ? "cursor-pointer" : ""
                } font-semibold text-gray-700 `}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className='flex items-center'>
                  {column.label}
                  {column.sortable && (
                    <ChevronsUpDown className='ml-1 h-3 w-3' />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className=''>
          {(totalItems ?? 0) > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.key === "status" ||
                    column.key === "subStatus" ||
                    column.key === "isActive" ? (
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(
                          column.key === "isActive"
                            ? row[column.key]
                              ? "active"
                              : "inactive"
                            : row[column.key]
                        )}`}
                      >
                        {column.key === "isActive"
                          ? row[column.key]
                            ? "Active"
                            : "Inactive"
                          : row[column.key] || "--"}
                      </span>
                    ) : column.key === "actions" &&
                      (getActionOptions || actionOptions.length > 0) ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {/* {actionOptions.map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              onClick={() => handleActionClick(row, action)}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))} */}

                          {(getActionOptions
                            ? getActionOptions(row)
                            : actionOptions
                          ).map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              onClick={() => action.handler(row)}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : column.key === "dueDate" ||
                      column.key === "startedDate" ||
                      column.key === "createDate" ? (
                      row[column.key] || "--"
                    ) : column.key === "studentLimit" &&
                      row[column.key] === "Unlimited" ? (
                      "Unlimited"
                    ) : (
                      row[column.key] || "--"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='text-center py-8'>
                <NoData text={"No data found"} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Bottom: Rows Per Page, Pagination, Results Info */}
      {(totalItems ?? 0) > 0 && (showRowsPerPage || pagination || showResultsInfo) && (
        <div className='flex items-center justify-between'>
          {showRowsPerPage && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Show Rows</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => {
                  {
                    if (onRowsPerPageChange) onRowsPerPageChange(Number(value));
                    if (onPageChange) onPageChange(1); // Reset to first page
                  }
                }}
              >
                <SelectTrigger className='w-[100px] rounded-2xl'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rowsPerPageOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {pagination && (totalItems ?? 0) > rowsPerPage && (
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange && onPageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange && onPageChange((currentPage ?? 1) - 1)}
                disabled={(currentPage ?? 1) === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size='sm'
                    onClick={() => onPageChange && onPageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange && onPageChange((currentPage ?? 1) + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onPageChange && onPageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          )}

          {showResultsInfo && (
            <div className='text-sm text-gray-600'>
              Showing {((currentPage ?? 1) - 1) * rowsPerPage + 1} -{" "}
              {Math.min((currentPage ?? 1) * rowsPerPage, totalItems ?? 0)} of {totalItems ?? 0}{" "}
              Results
            </div>
          )}
        </div>
      )}

      {modal === ENUM_MODULES.SCHOOL && (
        <CustomModal
          open={modal === ENUM_MODULES.SCHOOL}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.SCHOOL}
        />
      )}

      {modal === ENUM_MODULES.STUDENT && (
        <CustomModal
          open={modal === ENUM_MODULES.STUDENT}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.STUDENT}
        />
      )}

      {modal === ENUM_MODULES.SUBSCRIPTION && (
        <CustomModal
          open={modal === ENUM_MODULES.SUBSCRIPTION}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.SUBSCRIPTION}
        />
      )}

      {modal === ENUM_MODULES.USER && (
        <CustomModal
          open={modal === ENUM_MODULES.USER}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.USER}
        />
      )}
      {/* {modalType === "addSchool" ? (
        <AddSchoolModal onCancel={handleModalClose} />
      ) : modalType === "addSubscription" ? (
        <AddSubscriptionModal onCancel={handleModalClose} />
      ) : modalType === "addStudent" ? (
        <AddStudentModal onCancel={handleModalClose} />
      ) : (
        <ModalComponent
          modalType={modalType}
          selectedRow={selectedRow}
          actionLabel={actionLabel}
          onClose={handleModalClose}
          onConfirm={handleConfirmation}
          onEditSchool={handleEditSchool}
          onEditSubscription={handleEditSubscription}
          onAssignPermission={handleAssignPermission}
          onEditStudent={handleEditStudent}
        />
      )} */}
    </div>
  );
};

export default CustomTable;
