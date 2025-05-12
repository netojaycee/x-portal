import { ENUM_GENDER, ENUM_ROLE } from "./enums";
import { Image } from "./school";


export interface User {
    id: string;
    firstname: string;
    lastname: string;
    othername?: string | null;
    email: string;
    phone?: string | null;
    gender?: ENUM_GENDER | null;
    isActive: boolean;
    emailVerifiedAt?: string | null;
    role: ENUM_ROLE;
    view_as?: ENUM_ROLE | null;
    schoolId?: string | null;
    subRoleId?: string | null;
    createdAt: string;
    updatedAt: string;
    avatar: Image | null;
}

export interface AuthResponse {
    user: User;
    message: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface Student {
    sn: number;
    name: string;
    gender: ENUM_GENDER;
    class: string;
    arms: string;
    parentGuardian: string;
    createdDate: string;
    status: "Active" | "Inactive";
}

export interface Parent {
    sn: number;
    name: string;
    emailAddress: string;
    contact: string;
    occupation: string;
    createdDate: string;
    status: "Linked" | "Un-Linked";
}

