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
    studentDetails.studentRegNo || "N/A";

  const formattedAdmissionDate = studentDetails.admissionDate
    ? formatDate(new Date(studentDetails.admissionDate), 'dd/MM/yyyy')
    : "Not provided";

  return [
    { label: "First Name", value: studentDetails.firstname },
    { label: "Last Name", value: studentDetails.lastname },
    { label: "Other Name", value: studentDetails.othername || "N/A" },
    { label: "Registration No", value: studentRegNo },
    { label: "Email Address", value: studentDetails.email },

    { label: "Class", value: studentDetails.className || studentDetails.class },
    {
      label: "Arm",
      value: studentDetails.classArmName || studentDetails.classArm,
    },
    { label: "Admission Date", value: formattedAdmissionDate },
    { label: "Date of Birth", value: formattedDOB },
    {
      label: "Gender",
      value: studentDetails.gender === "male" ? "Male" : "Female",
    },

    { label: "Phone", value: studentDetails.phone || studentDetails.contact },
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

