import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import { clearUserInfo, setUserInfo } from "./slices/userSlice";
import { AuthResponse, GetUsersQuery, GetUsersResponse, Permission, Subrole, UpdateUserInput, User } from "@/lib/types";
import { LoginCredentials, loginSchema, RegisterCredentials, registerSchema } from "@/lib/schema";
import { setUser } from "./slices/userSlice";
import { ENUM_ROLE } from "@/lib/types/enums";
import { CreateSchoolInput, GetSchoolsQuery, GetSchoolsResponse, School, UpdateSchoolInput } from "@/lib/types/school";
// import { setCookie } from "@/lib/cookieUtils";


const BASE_URL =
    process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL || "https://api.x-portal.bitekitchen.com.ng"
        : `http://localhost:${process.env.PORT || 3000}`;

// Base query with TypeScript annotations
const baseQuery: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    // baseUrl: "https://x-portal-server-x2uk.onrender.com",
    // baseUrl: "http://localhost:3000",
    credentials: 'include',
    prepareHeaders: (headers: Headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

// Define the API
export const api = createApi({
    baseQuery,
    tagTypes: [
        "User",
        "Subscriptions",
        "Schools",
        "Users",
        "Subroles",
        "PermissionsSchool",
        "RolePermissions",
        "Logs",
        "Sessions",
        "Classes",
        "ClassArms",
        "Subjects",
        "Admissions",
        "Students",
        "SessionClassClassArms",
        "MarkingSchemes",
        "GradingSystem",
        "AssessmentSchemes",
        "ReportSettings",
        "Payments",
        "Configuration",
        "ClassCategory",
        "Terms",
        "SessionTerms",
        "SessionClass",
        "SessionClassSubject",
        "Scores",
        "SessionsPublic",
        "ClassesPublic",
        "Results",
        "MarkingSchemesClass",
        "BroadsheetResults",
        "Transcript",
        "PromotionStudents",
    ],
    endpoints: (builder) => ({
        // Register Endpoint
        register: builder.mutation<AuthResponse, RegisterCredentials>({
            query: (credentials) => ({
                url: "/auth/register",
                method: "POST",
                body: registerSchema.parse(credentials),
            }),
            onQueryStarted: async (_arg, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // setCookie("token", data.token, 24 * 60 * 60); // 1 day
                } catch (error) {
                    console.error("Register failed:", error);
                }
            },
        }),

        // Login Endpoint
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: loginSchema.parse(credentials),
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data.user));
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
        }),

        getProfile: builder.query<User, void>({
            query: () => ({ url: "/auth/profile" }),
            providesTags: (result) =>
                result ? [{ type: 'User', id: result.id }, 'User'] : ['User'],
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setUser(data));

                } catch (error) {
                    console.error("Get user failed:", error);
                }
            },
        }),

        setViewAs: builder.mutation<{ view_as: string; schoolId: string; schoolSlug: string },
            { view_as: ENUM_ROLE; schoolId: string; schoolSlug: string }>({
                query: ({ view_as, schoolId, schoolSlug }) => ({
                    url: '/auth/set-view-as',
                    method: 'PATCH',
                    body: { view_as, schoolId, schoolSlug },
                }),
                invalidatesTags: ['User'], // Refetch /profile
            }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),

        getSchools: builder.query<GetSchoolsResponse, GetSchoolsQuery>({
            query: ({ search, page = 1, limit = 5, subscriptionId }) => {
                const params = new URLSearchParams();
                if (search) params.append('search', search.toLowerCase());
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (subscriptionId) params.append('subscriptionId', subscriptionId);
                return {
                    url: `/schools/list?${params.toString()}`,
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.schools.map(({ id }) => ({ type: 'Schools' as const, id })),
                        { type: 'Schools', id: 'LIST' },
                    ]
                    : [{ type: 'Schools', id: 'LIST' }],
        }),

        getSchoolById: builder.query<any, string>({
            query: (id) => { return { url: `/schools/${id}` } },
            providesTags: (result) => (result ? [{ type: 'Schools', id: result.id }] : []),
        }),

        createSchool: builder.mutation<School, CreateSchoolInput>({
            query: (input) => ({
                url: '/schools',
                method: 'POST',
                body: input,
            }),
            invalidatesTags: [{ type: 'Schools', id: 'LIST' }],
        }),
        updateSchool: builder.mutation<School, { id: string; input: UpdateSchoolInput }>({
            query: ({ id, input }) => ({
                url: `/schools/${id}`,
                method: 'PATCH',
                body: input,
            }),
            invalidatesTags: (result) => (result ? [{ type: 'Schools', id: result.id }, { type: 'Schools', id: 'LIST' }] : []),
        }),
        deleteSchool: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/schools/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Schools', id }, { type: 'Schools', id: 'LIST' }],
        }),
        toggleSchoolActive: builder.mutation<School, string>({
            query: (id) => ({
                url: `/schools/${id}/toggle-active`,
                method: 'PATCH',
            }),
            invalidatesTags: (result) => (result ? [{ type: 'Schools', id: result.id }, { type: 'Schools', id: 'LIST' }] : []),
        }),

        getUsers: builder.query<GetUsersResponse, GetUsersQuery>({
            query: ({ q, page = 1, limit = 5, subRoleFlag = "", schoolId = "", gender }) => {
                const params = new URLSearchParams();
                if (q) params.append('q', q.toLowerCase());
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (subRoleFlag) params.append('subRoleFlag', subRoleFlag);
                if (schoolId) params.append('schoolId', schoolId);
                if (gender) params.append('gender', gender);
                return {
                    url: `/users/get/all-users?${params.toString()}`,
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.users.map(({ id }) => ({ type: 'Users' as const, id })),
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
        }),

        getUserById: builder.query<any, string>({
            query: (id) => { return { url: `/users/id/${id}` } },
            providesTags: (result) => (result ? [{ type: 'User', id: result.id }] : []),
        }),
        createUser: builder.mutation<User, any>({
            query: (input) => ({
                url: '/users',
                method: 'POST',
                body: input,
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        updateUser: builder.mutation<User, { id: string; input: UpdateUserInput }>({
            query: ({ id, input }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: input,
            }),
            invalidatesTags: (result) => (result ? [{ type: 'User', id: result.id }, { type: 'User', id: 'LIST' }] : []),
        }),
        deleteUser: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
        }),

        createSubrole: builder.mutation<Subrole, any>({
            query: (input) => ({
                url: '/sub-roles',
                method: 'POST',
                body: input,
            }),
            invalidatesTags: [{ type: 'Subroles', id: 'LIST' }],
        }),
        updateSubrole: builder.mutation<Subrole, { id: string; input: any }>({
            query: ({ id, input }) => ({
                url: `/sub-roles/${id}`,
                method: 'PATCH',
                body: input,
            }),
            invalidatesTags: (result) => (result ? [{ type: 'Subroles', id: result.id }, { type: 'Subroles', id: 'LIST' }] : []),
        }),
        deleteSubrole: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/sub-roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Subroles', id }, { type: 'Subroles', id: 'LIST' }],
        }),
        getSubroles: builder.query({
            query: ({ q }) => {
                const params = new URLSearchParams();
                if (q) params.append('q', q.toLowerCase());
                // params.append('page', page.toString());
                // params.append('limit', limit.toString());
                return {
                    url: `/sub-roles?${params.toString()}`,
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }: { id: string }) => ({ type: 'Subroles' as const, id })),
                        { type: 'Subroles', id: 'LIST' },
                    ]
                    : [{ type: 'Subroles', id: 'LIST' }],
        }),

        getSubroleById: builder.query<Subrole, string>({
            query: (id) => { return { url: `/sub-roles/${id}` } },
            providesTags: (result) => (result ? [{ type: 'Subroles', id: result.id }] : []),
        }),
        getPermissionsSchool: builder.query<Permission[], void>({
            query: () => { return { url: '/permissions/scope/school' } },
            providesTags: ['PermissionsSchool'],
        }),
        getRolePermissions: builder.query<Permission[], string>({
            query: (roleId) => { return { url: `/permissions/sub-role/${roleId}` } },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'RolePermissions' as const, id })),
                        { type: 'RolePermissions', id: 'LIST' },
                    ]
                    : [{ type: 'RolePermissions', id: 'LIST' }],
        }),
        updateRolePermissions: builder.mutation<void, { roleId: string; permissionIds: string[] }>({
            query: ({ roleId, permissionIds }) => ({
                url: `/permissions/sub-role/${roleId}`,
                method: 'PATCH',
                body: { permissionIds },
            }),
            invalidatesTags: (result, error, { roleId }) => [
                { type: 'RolePermissions', id: 'LIST' },
                { type: 'RolePermissions', id: roleId },
                { type: 'Subroles', id: 'LIST' },
                { type: 'Subroles', id: roleId },
            ],
        }),

        // getLogs
        getLogs: builder.query<any, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 }) => ({
                url: "/logs",
                params: { page, limit },
            }),
            providesTags: ["Logs"],
        }),
        assignSubscription: builder.mutation<void, { schoolId: string; subscriptionId: string }>({
            query: ({ schoolId, subscriptionId }) => ({
                url: '/subscription/assign-subscription-to-school',
                method: 'POST',
                body: { schoolId, subscriptionId },
            }),
            invalidatesTags: ['Schools'], // Refresh school list after assignment
        }),

        createSubscription: builder.mutation({
            query: (subscription) => ({
                url: "/subscription/create",
                method: "POST",
                body: subscription,
            }),
            invalidatesTags: ["Subscriptions"],
        }),
        updateSubscription: builder.mutation({
            query: ({ sn, ...updates }) => ({
                url: `/subscriptions/${sn}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["Subscriptions"],
        }),

        getSubscriptions: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: "/subscription/fetch",
                params: { page, limit },
            }),
            providesTags: ["Subscriptions"],
        }),

        updateSchoolConfiguration: builder.mutation({
            query: (updates) => ({
                url: `/configuration/school-information`,
                method: "PATCH",
                body: updates,

            }),
            invalidatesTags: ["Configuration"],
        }),

        // configuration
        // endpoints to get configuration
        getSchoolConfiguration: builder.query({
            query: () => ({
                url: "/configuration/school-information",
            }),
            providesTags: ["Configuration"],
        }),
        updateSchoolStaff: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/school/${id}/staff`,
                method: "PATCH",
                body: updates,
            }),
            // invalidatesTags: ["Subscriptions"],
        }),
        updateSystemSettings: builder.mutation({
            query: (updates) => ({
                url: `/system-settings`,
                method: "PATCH",
                body: updates,
            }),
            // invalidatesTags: ["Subscriptions"],
        }),
        getSessions: builder.query({
           query: () => ({
                    url: "/sessions",
                }),
                providesTags: ["Sessions"],
            }),
        getSessionsPublic: builder.query({
            query: ({ schoolId }) => ({
                url: `/sessions/public?schoolId=${schoolId}`,
            }),
            providesTags: ["SessionsPublic"],
                 }),
        createSession: builder.mutation({
            query: (session) => ({
                url: "/sessions",
                method: "POST",
                body: session,
            }),
            invalidatesTags: ["Sessions"],
        }),
        updateSession: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/sessions/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["Sessions"],
        }),
        deleteSession: builder.mutation({
            query: (id) => ({
                url: `/sessions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Sessions"],
        }),
        getClasses: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/classes?page=${page}&limit=${limit}`,
            }),
            providesTags: ["Classes"],
        }),
        getClassesPublic: builder.query({
            query: ({ schoolId }) => ({
                url: `/classes/public?schoolId=${schoolId}`,
            }),
            providesTags: ["ClassesPublic"],
        }),
        createClass: builder.mutation({
            query: (input) => ({
                url: "/classes",
                method: "POST",
                body: input,
            }),
            invalidatesTags: ["Classes"],
        }),

        updateClass: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/classes/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["Classes"],
        }),
        deleteClass: builder.mutation({
            query: (id) => ({
                url: `/classes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Classes"],
        }),
        getClassCategories: builder.query({
            query: () => ({
                url: "/classes/category/get/all",
            }),
            providesTags: ["ClassCategory"],
        }),
        createClassCategory: builder.mutation({
            query: (input) => ({
                url: "/classes/category",
                method: "POST",
                body: input,
            }),
            invalidatesTags: ["ClassCategory"],
        }),

        updateClassCategory: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/classes/category/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["ClassCategory"],
        }),
        deleteClassCategory: builder.mutation({
            query: (id) => ({
                url: `/classes/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ClassCategory"],
        }),
        getClassArms: builder.query({
            query: () => ({
                url: `/arm`,
            }),
            providesTags: ["ClassArms"],
        }),
        createClassArms: builder.mutation({
            query: (input) => ({
                url: "/arm",
                method: "POST",
                body: input,
            }),
            invalidatesTags: ["ClassArms"],
        }),

        updateClassArms: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/arm/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["ClassArms"],
        }),
        deleteClassArms: builder.mutation({
            query: (id) => ({
                url: `/arm/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ClassArms"],
        }),
        assignArms: builder.mutation({
            query: (credentials) => ({
                url: `/sessions/assign-class-to-session/${credentials.sessionId}`,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Classes", "Sessions"],
        }),
        getSubject: builder.query({
            query: () => ({
                url: `/subject`,
            }),
            providesTags: ["Subjects"],
        }),
        createSubject: builder.mutation({
            query: (input) => ({
                url: "/subject",
                method: "POST",
                body: input,
            }),
            invalidatesTags: ["Subjects"],
        }),

        updateSubject: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `/subject/${id}`,
                method: "PATCH",
                body: updates,
            }),
            invalidatesTags: ["Subjects"],
        }),
        deleteSubject: builder.mutation({
            query: (id) => ({
                url: `/subject/subject/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Subjects"],
        }),
        assignSubject: builder.mutation({
            query: (credentials) => ({
                url: `/subject/assign/${credentials.subjectId}`,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Subjects"],
        }),

        manageAdmission: builder.mutation({
            query: (credentials) => ({
                url: `/admissions/${credentials.id}/status`,
                method: "PATCH",
                body: credentials,
            }),
            invalidatesTags: ["Admissions", "Students"],
        }),
        createAdmission: builder.mutation({
            query: (credentials) => ({
                url: `/admissions`,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Admissions"],
        }),
        createAdmissionPublic: builder.mutation({
            query: (credentials) => ({
                url: `/admissions/public?schoolId=${credentials?.schoolId}`,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Admissions"],
        }),
        createStudent: builder.mutation({
            query: (credentials) => ({
                url: `/subject/assign/subject`,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Subjects"],
        }),
        getAdmissions: builder.query({
            query: ({ page = 1, limit = 10, q = '', status = '' }) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (q) params.append('q', q.toLowerCase());
                if (status) params.append('status', status);
                return {
                    url: `/admissions?${params.toString()}`,
                };
            },
            providesTags: ['Admissions'],
        }),

        getAdmissionById: builder.query<any, string>({
            query: (id) => ({
                url: `/admissions/detail/${id}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'Admissions', id: result.id }] : ['Admissions'],
        }),
        getClassClassArmsBySessionId: builder.query({
            query: (sessionId) => ({
                // url: `/sessions/session-class-class-arms/${sessionId}`,
                url: `/sessions/fetch-class-class-arm/${sessionId}`,

            }),
            providesTags: ["SessionClassClassArms"],
        }),


        // Attendance Management Endpoints
        getAttendanceStudents: builder.query({
            query: ({ sessionId, term, classId, classArmId }) => {
                const params = new URLSearchParams();
                params.append('sessionId', sessionId);
                params.append('term', term);
                params.append('classId', classId);
                params.append('classArmId', classArmId);
                // params.append('date', date);

                return {
                    url: `/attendance/students?${params.toString()}`,
                };
            },
            providesTags: ['Students'],
        }),

        markAttendance: builder.mutation({
            query: (data) => ({
                url: '/attendance/mark',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Students'],
        }),

        // Marking Scheme Endpoints
        getMarkingSchemes: builder.query({
            query: () => {

                return {
                    url: `/configuration/marking-scheme`,
                };
            },
            providesTags: ['MarkingSchemes'],
        }),

        getMarkingSchemeById: builder.query({
            query: (id) => ({
                url: `/configuration/marking-scheme/${id}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'MarkingSchemes', id: result.id }] : ['MarkingSchemes'],
        }),
        getMarkingSchemeByClass: builder.query({
            query: ({classId, termDefinitionId}) => ({
                url: `/configuration/marking-scheme/class/${classId}/term/${termDefinitionId}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'MarkingSchemesClass', id: result.id }] : ['MarkingSchemesClass'],
        }),

        createMarkingScheme: builder.mutation({
            query: (data) => ({
                url: '/configuration/marking-scheme',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['MarkingSchemes'],
        }),

        updateMarkingScheme: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/configuration/marking-scheme/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['MarkingSchemes'],
        }),

        deleteMarkingScheme: builder.mutation({
            query: (id) => ({
                url: `/configuration/marking-scheme/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MarkingSchemes'],
        }),

        assignMarkingScheme: builder.mutation({
            query: (data) => ({
                url: `/configuration/marking-scheme/${data.schemeId}/assign`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['MarkingSchemes'],
        }),

        getTerms: builder.query({
            query: () => ({
                url: `/configuration/terms`,
            }),
            providesTags: ['Terms'],
        }),

        // Grading Scheme Endpoints
        getGradingSystem: builder.query({
            query: () => {

                return {
                    url: `/configuration/grading-system`,
                };
            },
            providesTags: ['GradingSystem'],
        }),

        getGradingSystemById: builder.query({
            query: (id) => ({
                url: `/configuration/grading-system/${id}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'GradingSystem', id: result.id }] : ['GradingSystem'],
        }),

        createGradingSystem: builder.mutation({
            query: (data) => ({
                url: '/configuration/grading-system',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['GradingSystem'],
        }),

        updateGradingSystem: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/configuration/grading-system/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['GradingSystem'],
        }),

        deleteGradingSystem: builder.mutation({
            query: (id) => ({
                url: `/configuration/grading-system/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['GradingSystem'],
        }),

        assignGradingSystem: builder.mutation({
            query: (data) => ({
                url: `/configuration/grading-system/${data.gradingSystemId}/assign`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['GradingSystem'],
        }),

        // Continuous Assessment Scheme Endpoints
        getAssessmentSchemes: builder.query({
            query: () => {

                return {
                    url: `/configuration/continuous-assessment`,
                };
            },
            providesTags: ['AssessmentSchemes'],
        }),

        getAssessmentSchemeById: builder.query({
            query: (id) => ({
                url: `/assessment-schemes/${id}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'AssessmentSchemes', id: result.id }] : ['AssessmentSchemes'],
        }),

        createAssessmentScheme: builder.mutation({
            query: (data) => ({
                url: '/configuration/continuous-assessment',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['AssessmentSchemes'],
        }),

        updateAssessmentScheme: builder.mutation({
            query: (data) => ({
                url: `/configuration/continuous-assessment/${data.id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['AssessmentSchemes'],
        }),

        deleteAssessmentScheme: builder.mutation({
            query: (id) => ({
                url: `/configuration/continuous-assessment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AssessmentSchemes'],
        }),

        assignClassesToAssessmentScheme: builder.mutation({
            query: (data) => ({
                url: '/configuration/continuous-assessment/assign-classes',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['AssessmentSchemes'],
        }),

        // Report Settings Endpoints
        getReportSettings: builder.query({
            query: ({ classId }) => ({
                url: `/report-settings/${classId}`,
            }),
            providesTags: ["ReportSettings"],
        }),

        getAllReportSettings: builder.query({
            query: () => ({
                url: `/report-settings/all`,
            }),
            providesTags: ["ReportSettings"],
        }),

        saveReportSettings: builder.mutation({
            query: (data) => ({
                url: `/report-settings`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ReportSettings"],
        }),

        bulkSaveReportSettings: builder.mutation({
            query: (data) => ({
                url: `/report-settings/bulk`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ReportSettings"],
        }),

        // Payment/Subscription Endpoints
        getSubscriptionPackages: builder.query({
            query: () => ({
                url: `/subscriptions/packages`,
            }),
            providesTags: ["Subscriptions"],
        }),

        createPayment: builder.mutation({
            query: (data) => ({
                url: `/payments/create`,
                method: "POST",
                body: data,
            }),
        }),

        verifyPayment: builder.mutation({
            query: ({ reference }) => ({
                url: `/payments/verify/${reference}`,
                method: "GET",
            }),
        }),

        getCurrentSubscription: builder.query({
            query: () => ({
                url: `/subscriptions/current`,
            }),
            providesTags: ["Subscriptions"],
        }),
        // Add these new endpoints to the existing API

        // Get terms for a specific session
        getSessionTerms: builder.query({
            query: (sessionId: string) => ({
                url: `/sessions/${sessionId}/terms`,
                method: "GET",
            }),
            providesTags: ["SessionTerms"],
        }),

        // Get classes for a specific session
        getSessionClasses: builder.query({
            query: (sessionId: string) => ({
                url: `/classes/session/${sessionId}`,
                method: "GET",
            }),
            providesTags: ["SessionClass"],
        }),

        // Get subjects for a specific class arm
        getClassSubjects: builder.query({
            query: ({ classId, classArmId }: {
                classId: string;
                classArmId: string;
            }) => ({
                url: `/subject/class/${classId}/class-arm/${classArmId}`,
                method: "GET",
            }),
            providesTags: ["SessionClassSubject"],
        }),

        // Score Management Endpoints

        // Get students in a specific class arm for score entry
        getSessionClassStudents: builder.query({
            query: ({ sessionId, classId, classArmId }: {
                sessionId: string;
                classId: string;
                classArmId: string;
            }) => ({
                url: `/classes/sessions/${sessionId}/class/${classId}/arm/${classArmId}/students`,
                method: "GET",
                // body: { sessionId, classId, classArmId },
            }),
            providesTags: ["Students"],
        }),

        // Get marking scheme assigned to a class for a specific term
        getClassMarkingScheme: builder.query({
            query: ({ classId, termId }: {
                classId: string;
                termId: string;
            }) => ({
                url: `/configuration/marking-scheme/class/${classId}/term/${termId}`,
                method: "GET",
            }),
            providesTags: ["MarkingSchemes"],
        }),

        // Get existing scores for students in a class arm for a subject
        getStudentScores: builder.query({
            query: ({ sessionId, classId, classArmId, termId, subjectId, studentId }: {
                sessionId?: string;
                classId?: string;
                classArmId?: string;
                termId?: string;
                subjectId?: string;
                studentId?: string;
            }) => {
                const params = new URLSearchParams();
                if (sessionId) params.append('sessionId', sessionId);
                if (classId) params.append('classId', classId);
                if (classArmId) params.append('classArmId', classArmId);
                if (termId) params.append('termId', termId);
                if (subjectId) params.append('subjectId', subjectId);
                if (studentId) params.append('studentId', studentId);

                return {
                    url: `/scores/fetch?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Scores"],
        }),

        // Submit/Update student scores
        submitStudentScores: builder.mutation({
            query: (scoresData: {
                sessionId: string;
                classId: string;
                classArmId: string;
                termId: string;
                subjectId: string;
                scores: Array<{
                    studentId: string;
                    componentId: string;
                    subComponentId?: string; // For CA sub-components
                    parentComponentId?: string; // For CA sub-components
                    score: number;
                    maxScore: number;
                    type: "CA" | "EXAM";
                }>;
            }) => ({
                url: `/scores/save`,
                method: "POST",
                body: scoresData,
            }),
            invalidatesTags: ["Scores"],
        }),
        getResults: builder.query<any, any>({
            query: ({ q, page = 1, limit = 10, all = false, type }) => {
                const params = new URLSearchParams();
                if (q) params.append('q', q.toLowerCase());
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (all === true) params.append('all', all.toString());
                if (type) params.append('type', type);
                return {
                    url: `/results?${params.toString()}`,
                };
            },
            providesTags: ["Results"],
        }),
        // compute result mutation
        computeResult: builder.mutation({
            query: (data) => ({
                url: `/results/submit`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Results"],
        }),

        // approve result
        approveResult: builder.mutation({
            query: (id) => ({
                url: `/results/${id}/approve`,
                method: "PATCH",
                // body: data,
            }),
            invalidatesTags: ["Results"],
        }),

        // get result by id
        getResultById: builder.query({
            query: (id) => ({
                url: `/results/${id}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'Results', id: result.id }] : ['Results'],
        }),
        getBroadsheetResultById: builder.query({
            query: ({id, type}) => ({
                url: `/results/${id}/${type}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'BroadsheetResults', id: result.id }] : ['BroadsheetResults'],
        }),
        getTranscript: builder.query({
            query: ({ studentIdentifier, classCategoryId }) => ({
                url: `/results/transcript/${classCategoryId}/${studentIdentifier}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'Transcript', id: result.id }] : ['Transcript'],
        }),
       
        getStudentsPromotion: builder.query({
            query: ({ classId, classArmId, sessionId }) => ({
                url: `/results/promotion/${sessionId}/${classId}/${classArmId}`,
            }),
            providesTags: (result) =>
                result ? [{ type: 'PromotionStudents', id: result.id }] : ['PromotionStudents'],
        }),

        // use promote students mutation
        promoteStudents: builder.mutation({
            query: (credentials) => ({
                url: `/results/promotion/promote`,
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["PromotionStudents", "Students", "Results"],
        }),

    }),
});

// Export hooks with TypeScript types
export const {
    useRegisterMutation,
    useLoginMutation,
    useGetProfileQuery,
    useSetViewAsMutation,
    useLogoutMutation,
    useGetSchoolsQuery,
    useGetSchoolByIdQuery,
    useCreateSchoolMutation,
    useUpdateSchoolMutation,
    useDeleteSchoolMutation,
    useToggleSchoolActiveMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useCreateSubroleMutation,
    useUpdateSubroleMutation,
    useDeleteSubroleMutation,
    useGetSubrolesQuery,
    useGetSubroleByIdQuery,
    useGetPermissionsSchoolQuery,
    useGetRolePermissionsQuery,
    useUpdateRolePermissionsMutation,
    useGetLogsQuery,
    useAssignSubscriptionMutation,
    useGetSubscriptionsQuery,
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useUpdateSchoolConfigurationMutation,
    useGetSchoolConfigurationQuery,
    useUpdateSchoolStaffMutation,
    useUpdateSystemSettingsMutation,
    useGetSessionsQuery,
    useGetSessionsPublicQuery,
    useCreateSessionMutation,
    useUpdateSessionMutation,
    useDeleteSessionMutation,
    useGetClassesQuery,
    useGetClassesPublicQuery,
    useAssignArmsMutation,
    useGetClassArmsQuery,
    useCreateClassArmsMutation,
    useUpdateClassArmsMutation,
    useDeleteClassArmsMutation,
    useCreateClassMutation,
    useUpdateClassMutation,
    useDeleteClassMutation,
    useGetSubjectQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useAssignSubjectMutation,
    useDeleteSubjectMutation,
    useManageAdmissionMutation,
    useCreateStudentMutation,
    useCreateAdmissionMutation,
    useCreateAdmissionPublicMutation,
    useGetAdmissionsQuery,
    useGetAdmissionByIdQuery,
    useGetClassClassArmsBySessionIdQuery,
    // New attendance hooks
    useGetAttendanceStudentsQuery,
    useMarkAttendanceMutation,
    // Marking scheme hooks
    useGetMarkingSchemesQuery,
    useGetMarkingSchemeByIdQuery,
    useGetMarkingSchemeByClassQuery,
    useCreateMarkingSchemeMutation,
    useUpdateMarkingSchemeMutation,
    useDeleteMarkingSchemeMutation,
    useAssignMarkingSchemeMutation,
    // Grading scheme hooks
    useGetGradingSystemQuery,
    useGetGradingSystemByIdQuery,
    useCreateGradingSystemMutation,
    useUpdateGradingSystemMutation,
    useDeleteGradingSystemMutation,
    useAssignGradingSystemMutation,
    // Assessment scheme hooks
    useGetAssessmentSchemesQuery,
    useGetAssessmentSchemeByIdQuery,
    useCreateAssessmentSchemeMutation,
    useUpdateAssessmentSchemeMutation,
    useDeleteAssessmentSchemeMutation,
    useAssignClassesToAssessmentSchemeMutation,    // Report settings hooks
    useGetReportSettingsQuery,
    useGetAllReportSettingsQuery,
    useSaveReportSettingsMutation,
    useBulkSaveReportSettingsMutation,

    useGetClassCategoriesQuery,
    useCreateClassCategoryMutation,
    useUpdateClassCategoryMutation,
    useDeleteClassCategoryMutation,

    // Payment/Subscription hooks
    useGetSubscriptionPackagesQuery,
    useCreatePaymentMutation,
    useVerifyPaymentMutation,
    useGetCurrentSubscriptionQuery,
    useGetTermsQuery, useGetSessionTermsQuery,
    useGetSessionClassesQuery,
    useGetClassSubjectsQuery,

    // Score management hooks
    useGetSessionClassStudentsQuery,
    useGetClassMarkingSchemeQuery,
    useGetStudentScoresQuery,
    useSubmitStudentScoresMutation,

    useGetResultsQuery,
    useComputeResultMutation,
    useApproveResultMutation,
    useGetResultByIdQuery,
    useGetBroadsheetResultByIdQuery,
    useGetTranscriptQuery,
    useGetStudentsPromotionQuery,
usePromoteStudentsMutation,
} = api;

export type AppApi = typeof api;