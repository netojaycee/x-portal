import { ENUM_GENDER } from "./enums";



export interface CreateStudentInput {
    firstname: string;
    lastname: string;
    othername?: string;
    username: string;
    email?: string;
    phone?: string;
    gender?: ENUM_GENDER;
    password: string;

    dateOfBirth?: string;
    admissionDate?: string;
    classId?: string;
    classArmId?: string;
    parentId?: string;
    schoolId?: string;
}
  
  
export interface UpdateStudentInput {
    firstname?: string;
    lastname?: string;
    othername?: string;
    email?: string;
    phone?: string;
    gender?: ENUM_GENDER;
    dateOfBirth?: string | null;
    admissionDate?: string | null;
    classId?: string | null;
    classArmId?: string | null;
    parentId?: string | null;
}
  
  