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
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
// import { ModalComponent } from "./modals/ModalComponent";
// import { AddSubscriptionModal } from "./modals/AddSubsriptionModal";
// import { AddSchoolModal } from "./modals/AddSchoolModal";
// import { AddStudentModal } from "./modals/AddStudentModals";
import { ENUM_MODULES } from "@/lib/types/enums";
import { CustomModal } from "./modals/CustomModal";
import NoData from "./NoData";
import Image from "next/image";

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
  label: string | React.ReactNode;
  type: "confirmation" | "edit" | "custom";
  handler: (row: any) => void | undefined;
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
  isSearching?: boolean;
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
  isSearching,
}) => {
  // State for filters, sorting, and pagination

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [modal, setModal] = useState<ENUM_MODULES | null>(null);

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
            {isSearching ? (
              <Loader2 className='animate-spin absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2 text-gray-400' />
            ) : (
              <Search className='absolute top-1/2 left-3 w-5 h-5 transform -translate-y-1/2 text-gray-400' />
            )}
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
                    : title === "Parents List"
                    ? ENUM_MODULES.PARENT
                    : title === "Staff List"
                    ? ENUM_MODULES.STAFF
                    : title === "Subscription Plans"
                    ? ENUM_MODULES.SUBSCRIPTION
                    : title === "Users List"
                    ? ENUM_MODULES.USER
                    : title === "Class List"
                    ? ENUM_MODULES.CLASS
                    : title === "Class Category List"
                    ? ENUM_MODULES.CLASS_CATEGORY
                    : title === "ClassArm List"
                    ? ENUM_MODULES.CLASS_ARM
                    : title === "Subject List"
                    ? ENUM_MODULES.SUBJECT
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
      {title &&
        title !== "Class List" &&
        title !== "Subject List" &&
        title !== "Class Category List" &&
        title !== "Results" && (
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
                    {column.key === "sn" ? (
                      ((currentPage ?? 1) - 1) * rowsPerPage + index + 1
                    ) : column.key === "fullname" ? (
                      `${row.firstname ?? ""} ${row.lastname ?? ""}`.trim() ||
                      "--"
                    ) : column.key === "status" ||
                      column.key === "subStatus" ||
                      column.key === "isActive" ||
                      column.key === "isApproved" ? (
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(
                          column.key === "isActive"
                            ? row[column.key]
                              ? "active"
                              : "inactive"
                            : column.key === "isApproved"
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
                          : column.key === "isApproved"
                          ? row[column.key]
                            ? "Approved"
                            : "Submitted"
                          : row[column.key] || "--"}
                      </span>
                    ) : column.key === "subRole" ? (
                     row.subRole?.name || "--"
                     ) : column.key === "teacher" ? (
                      row?.assignments?.[0]?.classArms?.[0]?.teacher?.staffName || "--"
                    ) : column.key === "classArmName" ? (
                      row?.classArm?.name || row?.classArmName || "--"
                    ) : column.key === "className" ? (
                      row?.class?.name || row?.className || "--"
                    ) : column.key === "submittedBy" ? (
                      row.createdBy?.name || "--"
                    ) : column.key === "session" ? (
                      row.session?.name || "--"
                    ) : column.key === "term" ? (
                      row.termDefinition?.name || "--"
                    ) : column.key === "resultScope" ? (
                      row.resultScope === "EXAM" ? (
                        "Terminal"
                      ) : (
                        row.resultScope || "--"
                      )
                    ) : column.key === "adClass" ? (
                      <div className='flex flex-col gap-1'>
                        <span className='flex items-center gap-1'>
                          <ArrowLeft className='w-4 h-4 text-red-500' />
                          <p className=''>{row.presentClass}</p>
                        </span>
                        <span className='flex items-center gap-1'>
                          <ArrowRight className='w-4 h-4 text-green-500' />
                          <p className=''>{row.classToApply}</p>
                        </span>
                      </div>
                    ) : column.key === "imageUrl" ? (
                      <Image
                        width={40}
                        height={40}
                        src={row.imageUrl}
                        alt={row.name}
                        className='h-10 w-10 bg-gray-400 rounded-md'
                      />
                    ) : column.key === "subPlan" ? (
                      row.subscription?.name || "--"
                    ) : column.key === "subject" ? (
                      row.subject?.name || "--"
                    ) : column.key === "teacher" ? (
                      // Show teacher's firstname and lastname
                      `${row.teacher?.firstname ?? ""} ${
                        row.teacher?.lastname ?? ""
                      }`.trim() || "--"
                    ) : column.key === "date" ? (
                      row.timestamp ||
                      row.createdAt ||
                      row.createdDate ||
                      row.admissionDate ? (
                        new Date(
                          row.timestamp ||
                            row.createdAt ||
                            row.createdDate ||
                            row.admissionDate
                        )
                          .toISOString()
                          .slice(0, 10) // "YYYY-MM-DD"
                      ) : (
                        "--"
                      )
                    ) : column.key === "dateOfBirth" ? (
                      row.dateOfBirth ? (
                        new Date(row.dateOfBirth).toISOString().slice(0, 10) // "YYYY-MM-DD"
                      ) : (
                        "--"
                      )
                    ) : column.key === "classCategory" ? (
                      row?.classCategory?.name || "--"
                    ) : column.key === "time" ? (
                      row.timestamp ? (
                        new Date(row.timestamp)
                          .toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .toLowerCase()
                          .replace(" ", "")
                      ) : (
                        "--"
                      )
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
                          {(getActionOptions
                            ? getActionOptions(row)
                            : actionOptions
                          ).map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => action.handler(row)}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : column.key === "dueDate" ? (
                      row.SchoolSubscription &&
                      Array.isArray(row.SchoolSubscription) &&
                      row.SchoolSubscription[0]?.endDate ? (
                        new Date(row.SchoolSubscription[0].endDate)
                          .toISOString()
                          .slice(0, 10)
                      ) : (
                        "--"
                      )
                    ) : column.key === "category" ? (
                      row.category === "junior" ? (
                        "Junior Secondary School"
                      ) : row.category === "senior" ? (
                        "Senior Secondary School"
                      ) : (
                        row.category || "--"
                      )
                    ) : column.key === "startedDate" ||
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
      {(totalItems ?? 0) > 0 &&
        (showRowsPerPage || pagination || showResultsInfo) && (
          <div className='flex items-center justify-between'>
            {showRowsPerPage && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Show Rows</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    {
                      if (onRowsPerPageChange)
                        onRowsPerPageChange(Number(value));
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
                {/* <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onPageChange && onPageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button> */}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    onPageChange && onPageChange((currentPage ?? 1) - 1)
                  }
                  disabled={(currentPage ?? 1) === 1}
                >
                  {/* Previous */}
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                {(() => {
                  const maxVisiblePages = 3;
                  const halfVisible = Math.floor(maxVisiblePages / 2);
                  let startPage = Math.max(1, (currentPage ?? 1) - halfVisible);
                  const endPage = Math.min(
                    totalPages,
                    startPage + maxVisiblePages - 1
                  );

                  // Adjust startPage if we're near the end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  const pages = [];

                  // Add first page if not visible
                  if (startPage > 1) {
                    pages.push(
                      <Button
                        key={1}
                        variant='outline'
                        size='sm'
                        onClick={() => onPageChange && onPageChange(1)}
                      >
                        1
                      </Button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span
                          key='start-ellipsis'
                          className='px-2 text-gray-500'
                        >
                          ...
                        </span>
                      );
                    }
                  }

                  // Add visible pages
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size='sm'
                        onClick={() => onPageChange && onPageChange(i)}
                      >
                        {i}
                      </Button>
                    );
                  }

                  // Add last page if not visible
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key='end-ellipsis' className='px-2 text-gray-500'>
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages}
                        variant='outline'
                        size='sm'
                        onClick={() => onPageChange && onPageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    );
                  }

                  return pages;
                })()}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    onPageChange && onPageChange((currentPage ?? 1) + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  {/* Next */}
                  <ChevronRight className='h-4 w-4' />
                </Button>
                {/* <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onPageChange && onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button> */}
              </div>
            )}

            {showResultsInfo && (
              <div className='text-sm text-gray-600'>
                Showing {((currentPage ?? 1) - 1) * rowsPerPage + 1} -{" "}
                {Math.min((currentPage ?? 1) * rowsPerPage, totalItems ?? 0)} of{" "}
                {totalItems ?? 0} Results
              </div>
            )}
          </div>
        )}

      {modal !== null && Object.values(ENUM_MODULES).includes(modal) && (
        <CustomModal
          open={!!modal}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={modal}
        />
      )}

      {/* {modal === ENUM_MODULES.SCHOOL && (
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
      {modal === ENUM_MODULES.CLASS && (
        <CustomModal
          open={modal === ENUM_MODULES.CLASS}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.CLASS}
        />
      )}

      {modal === ENUM_MODULES.CLASS_CATEGORY && (
        <CustomModal
          open={modal === ENUM_MODULES.CLASS_CATEGORY}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.CLASS_CATEGORY}
        />
      )}
      {modal === ENUM_MODULES.CLASS_ARM && (
        <CustomModal
          open={modal === ENUM_MODULES.CLASS_ARM}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.CLASS_ARM}
        />
      )}

      {modal === ENUM_MODULES.SUBJECT && (
        <CustomModal
          open={modal === ENUM_MODULES.SUBJECT}
          onOpenChange={handleModalOpenChange}
          isEditMode={false}
          type={ENUM_MODULES.SUBJECT}
        />
      )} */}
    </div>
  );
};

export default CustomTable;
