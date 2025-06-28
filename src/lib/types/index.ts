import { ENUM_GENDER, ENUM_ROLE } from "./enums";

export interface BaseUser {
    id: string;
    firstname?: string;
    lastname?: string;
    othername?: string;
    username: string;
    email?: string;
    phone?: string;
    gender?: ENUM_GENDER;
    isActive: boolean;
    emailVerifiedAt?: string;
    password: string;
    isDeleted: boolean;
    plainPassword: string;
    role: ENUM_ROLE;
    rememberToken?: string;
    avatar?: Image | null;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    schoolId?: string;
    schoolSlug?: string;
    subRoleId?: string;
    view_as?: ENUM_ROLE;
    permissions?: string[];
}

export interface AuthResponse {
    user: BaseUser;
    message: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}



export interface Image {
    url: string;
    pubId: string;
}

// export type ModalType = "add" | "edit" | "delete" | "permission" | "status" | "approve" | "reject" | "custom" | "confirmation" | null;
export type ModalType =
    | "status"
    | "add"
    | "edit"
    | "delete"
    | "permission"
    | "approve"
    | "custom"
    | "confirmation"
    | "reject"
    | null
    | undefined;
    
export interface ModalState {
    type: ModalType;
    data?: any;
}

export interface GetUsersResponse {
    users: User[];
    total: number;
}

export interface GetUsersQuery {
    q?: string;
    page?: number;
    limit?: number;
    schoolId?: string | null;
    gender?: 'male' | 'female';
    subRoleId?: string;
    subRoleFlag?: 'student' | 'staff' | 'parent';
}

export interface StudentData {
    studentId?: string;
    classId?: string;
    classArmId?: string;
    admissionDate?: string;
    dateOfBirth?: string;
    parentId?: string;
}

export interface StaffData {
    staffId?: string;
    department?: string;
    position?: string;
    hireDate?: string;
    qualifications?: string;
}

export interface ParentData {
    occupation?: string;
    address?: string;
    relationship?: string;
}

export interface User extends BaseUser {
    student?: StudentData;
    staff?: StaffData;
    parent?: ParentData;
}


export interface CreateUserInput {
    firstname?: string;
    lastname?: string;
    othername?: string;
    username: string;
    email?: string;
    phone?: string;
    gender?: "male" | "female";
    password: string;
    schoolId?: string;

    subRoleId: string; // The subRole to assign (e.g., student, staff, parent)

    student?: CreateStudentDetails;
    staff?: CreateStaffDetails;
    parent?: CreateParentDetails;
}


export interface CreateStudentDetails {
    studentId?: string;
    classId?: string;
    classArmId?: string;
    admissionDate?: string;
    dateOfBirth?: string;
    parentId?: string;
}

export interface CreateStaffDetails {
    staffId?: string;
    department?: string;
    position?: string;
    hireDate?: string;
    qualifications?: string;
}

export interface CreateParentDetails {
    occupation?: string;
    address?: string;
    relationship?: string;
}


export interface UpdateUserInput {
    firstname?: string;
    lastname?: string;
    othername?: string;
    email?: string;
    phone?: string;
    gender?: 'male' | 'female';
    password?: string;
    subRoleId?: string; // You might allow updating subRole

    student?: UpdateStudentDetails;
    staff?: UpdateStaffDetails;
    parent?: UpdateParentDetails;
}

export interface UpdateStudentDetails {
    classId?: string;
    classArmId?: string;
    admissionDate?: string;
    dateOfBirth?: string;
    parentId?: string;
}

export interface UpdateStaffDetails {
    department?: string;
    position?: string;
    hireDate?: string;
    qualifications?: string;
}

export interface UpdateParentDetails {
    occupation?: string;
    address?: string;
    relationship?: string;
}


export interface Subrole {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    schoolId?: string;
    isDeleted: boolean;
}

export interface Permission {
    id: string;
    name: string;
    description?: string;
}