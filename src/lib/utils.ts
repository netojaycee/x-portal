import { clsx, type ClassValue } from "clsx"
import { formatDate } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const rowsPerPageOptions = [10, 50, 100, 200, 1000]

export function stripCountryCode(phoneNumber: string | number): string {
  const phoneStr = phoneNumber.toString();
  // if (phoneStr.length < 11) {
  //   throw new Error("Phone number must have at least 11 digits");
  // }
  return phoneStr.slice(3);
}

// Utility to map API student data to the structure expected by StudentBio

export function formatStudentDetails(studentDetails: any) {
  // Fallback for missing data
  if (!studentDetails) return [];

  const formattedDOB = studentDetails.dateOfBirth
    ? formatDate(new Date(studentDetails.dateOfBirth), 'dd/MM/yyyy')
    : "Not provided";

  const studentRegNo =
    studentDetails.regNo || "N/A";

  const formattedAdmissionDate = studentDetails.admission.admissionDate
    ? formatDate(new Date(studentDetails.admission.admissionDate), 'dd/MM/yyyy')
    : "Not provided";

  return [
    { label: "First Name", value: studentDetails.firstname },
    { label: "Last Name", value: studentDetails.lastname },
    { label: "Other Name", value: studentDetails.othername || "N/A" },
    { label: "Registration No", value: studentRegNo },
    { label: "Email Address", value: studentDetails.email },

    { label: "Class", value: studentDetails.currentClass?.name },
    {
      label: "Arm",
      value: studentDetails.currentClassArm?.name,
    },
    { label: "Admission Date", value: formattedAdmissionDate },
    { label: "Date of Birth", value: formattedDOB },
    {
      label: "Gender",
      value: studentDetails.gender === "male" ? "Male" : "Female",
    },

    { label: "Contact", value: studentDetails.contact || studentDetails.contact },
    { label: "Religion", value: studentDetails.religion },
    { label: "Nationality", value: studentDetails.nationality },
    { label: "State of Origin", value: studentDetails.stateOfOrigin },
    { label: "LGA", value: studentDetails.lga },

    {
      label: "Status",
      value: studentDetails.isActive ? "Active" : "Inactive",
      className: studentDetails.isActive ? "text-green-600" : "text-red-600",
    },
    {
      label: "Admission Status",
      value: studentDetails.admissionStatus
        ? studentDetails.admissionStatus.charAt(0).toUpperCase() +
        studentDetails.admissionStatus.slice(1)
        : "N/A",
    },
    { label: "Username", value: studentDetails.username },
  ];
}


export function formatStaffDetails(staffDetails: any) {
  if (!staffDetails) return [];
  return [
    { label: "First Name", value: staffDetails.firstname },
    { label: "Last Name", value: staffDetails.lastname },
    { label: "Other Name", value: staffDetails.othername || "N/A" },
    { label: "Staff Reg No", value: staffDetails.staffRegNo || "N/A" },
    { label: "Email", value: staffDetails.email },
    { label: "Contact", value: staffDetails.contact },
    { label: "Qualifications", value: Array.isArray(staffDetails.qualifications) ? staffDetails.qualifications.join(", ") : staffDetails.qualifications },
    { label: "Gender", value: staffDetails.gender === "male" ? "Male" : "Female" },
    { label: "Username", value: staffDetails.username },
    { label: "Status", value: staffDetails.isActive ? "Active" : "Inactive", className: staffDetails.isActive ? "text-green-600" : "text-red-600" },
  ];
}


// Parent information shape for the Parent/Guardian Info section
export function formatParentDetails(parentData: any) {
  return [
    {
      label: "First Name",
      value: parentData.firstname || parentData.firstName,
    },
    { label: "Last Name", value: parentData.lastname || parentData.lastName },
    {
      label: "Other Name",
      value: parentData.othername || parentData.otherName || "N/A",
    },
    { label: "Email", value: parentData.email },
    { label: "Contact", value: parentData.contact || parentData.tel },
    { label: "Address", value: parentData.address },
    {
      label: "Relationship",
      value: parentData.relationship || "Not specified",
    },
    { label: "Occupation", value: parentData.occupation || "Not specified" },
    // {
    //   label: "Parent ID",
    //   value: studentDetails.parentId || parentData.id || "N/A",
    // },
  ];
}

