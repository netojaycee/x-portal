export interface GetSchoolsResponse {
    schools: School[];
    total: number;
}

export interface GetSchoolsQuery {
    search?: string;
    page?: number;
    limit?: number;
    schoolId?: string | null; // For user.schoolId filtering
}

export interface Image {
    url: string;
    pubId: string;
}

export interface School {
    id: string;
    name: string;
    email: string;
    contact: string;
    isActive: boolean;
    subscription?: string;
    address?: string | null;
    logo?: Image | null;
    // createdAt: string;
    // updatedAt: string;
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