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

// Subscription and Payment Types
export interface SubscriptionPackage {
    id: string;
    name: string;
    description?: string;
    amount: number; // Changed from price to amount to match backend
    duration: number; // Duration in months
    studentLimit?: number;
    features: {
        studentLimit?: number;
        teachers?: number;
        subjects?: number;
        storage?: string;
        support?: string;
        cbt?: boolean;
        feeManagement?: boolean;
        bulkSMS?: boolean;
        attendance?: boolean;
        results?: boolean;
        parentPortal?: boolean;
        apiAccess?: boolean;
        [key: string]: any; // Allow additional features
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    // Frontend compatibility fields
    price?: number; // Computed from amount for backward compatibility
    validity?: number; // Computed from duration for backward compatibility
    isPopular?: boolean; // Can be set in frontend logic
}

export interface CurrentSubscription {
    id: string;
    packageId: string;
    packageName: string;
    schoolId: string;
    startDate: string;
    expiresAt: string;
    isActive: boolean;
    isExpired: boolean;
    daysRemaining: number;
    canExtend: boolean;
    package?: SubscriptionPackage;
    paymentReference?: string;
    paymentMethod?: string;
}

export interface SubscriptionPackagesResponse {
    success: boolean;
    data: SubscriptionPackage[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CreatePaymentInput {
    packageId: string;
    isExtension?: boolean;
}

export interface SubscribeSchoolInput {
    packageId: string;
    email: string;
    paymentMethod?: string;
    metadata?: {
        schoolName?: string;
        adminName?: string;
        [key: string]: any;
    };
}

export interface ExtendSubscriptionInput {
    packageId: string;
    email: string;
    additionalMonths?: number;
    metadata?: {
        reason?: string;
        [key: string]: any;
    };
}

export interface PaymentResponse {
    success: boolean;
    authorizationUrl?: string;
    authorization_url?: string; // Backend might use snake_case
    reference: string;
    message?: string;
}

export interface PaymentVerificationResponse {
    success: boolean;
    status: string;
    data: {
        reference: string;
        amount: number;
        packageName: string;
        paidAt: string;
        subscriptionDetails: {
            startDate: string;
            expiresAt: string;
            isActive: boolean;
        };
    };
}

export interface SubscriptionsResponse {
    packages: SubscriptionPackage[];
    currentSubscription: CurrentSubscription | null;
}

// New SchoolPlan interface matching the updated API
export interface SchoolPlan {
    schoolInfo: {
        id: string;
        name: string;
        slug: string;
        subscriptionStatus: boolean;
        subscriptionExpiresAt: string;
        isExpired: boolean;
        daysUntilExpiry: number;
    };
    currentPlan: {
        id: string;
        name: string;
        amount: number;
        duration: number;
        studentLimit: number;
        features: {
            cbt?: boolean;
            feeManagement?: boolean;
            bulkSMS?: boolean;
            attendance?: boolean;
            results?: boolean;
            parentPortal?: boolean;
            apiAccess?: boolean;
            [key: string]: boolean | undefined;
        };
        isActive: boolean;
    };
    usage: {
        currentStudents: number;
        studentLimit: number;
        usagePercentage: number;
    };
    paymentHistory: Array<{
        id: string;
        amount: number;
        paymentDate: string;
        paymentStatus: string;
        reference: string;
        subscription: {
            name: string;
            duration: number;
        };
    }>;
    status: {
        canAddStudents: boolean;
        needsUpgrade: boolean;
        isActive: boolean;
    };
}

// Package creation interface for SuperAdmin
export interface CreateSubscriptionPackageInput {
    name: string;
    description?: string;
    amount: number;
    duration: number;
    studentLimit: number;
    features: Record<string, boolean>;
    isActive?: boolean;
}

// Package update interface for SuperAdmin
export interface UpdateSubscriptionPackageInput {
    id: string;
    data: Partial<CreateSubscriptionPackageInput>;
}

// Subscription analytics interface for SuperAdmin
export interface SubscriptionAnalytics {
    month: string;
    subscriptions: number;
    revenue: number;
}

// Offline assignment interface for SuperAdmin
export interface AssignSubscriptionInput {
    schoolId: string;
    packageId: string;
    paymentMethod: string;
    paymentReference: string;
    metadata?: {
        paymentMode?: string;
        verifiedBy?: string;
        [key: string]: any;
    };
}