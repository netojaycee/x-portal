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
    reducerPath: "api",
    baseQuery,
    tagTypes: ["User", "Subscriptions", "Schools", "Users", "Subroles", 'PermissionsSchool', 'RolePermissions', "Logs"],
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

        setViewAs: builder.mutation<{ view_as: string; schoolId: string },
            { view_as: ENUM_ROLE; schoolId: string }>({
                query: ({ view_as, schoolId }) => ({
                    url: '/auth/set-view-as',
                    method: 'PATCH',
                    body: { view_as, schoolId },
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

        getSchoolById: builder.query<School, string>({
            query: (id) => { return { url: `/school/${id}` } },
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

        getUserById: builder.query<User, string>({
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
                method: "PUT",
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



} = api;

export type AppApi = typeof api;