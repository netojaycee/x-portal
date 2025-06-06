import { Image } from ".";

export interface GetSchoolsResponse {
    schools: School[];
    total: number;
}

export interface GetSchoolsQuery {
    search?: string;
    page?: number;
    limit?: number;
    subscriptionId?: string | null; // For filtering schools with no subscription
    schoolId?: string | null; // For user.schoolId filtering
}



export interface School {
    id: string;
    name: string;
    email: string;
    contact: string;
    address?: string;
    subscriptionId?: string;
    subscription?: {
        id: string;
        name: string;
        duration: number;
        studentLimit: number;
        isActive: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
    } | null;
    SchoolSubscription: any;
    logo?: Image | null;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}
  

export interface CreateSchoolInput {
    name: string;
    email: string;
    contact: string;
    address?: string;
}

export interface UpdateSchoolInput {
    name?: string;
    email?: string;
    contact?: string;
    address?: string | null;
}