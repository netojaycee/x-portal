import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import { clearUserInfo, setUserInfo } from "./slices/userSlice";
import { AuthResponse, User } from "@/lib/types";
import { LoginCredentials, loginSchema, RegisterCredentials, registerSchema } from "@/lib/schema";
import { setUser } from "./slices/userSlice";
import { ENUM_ROLE } from "@/lib/types/enums";
import { CreateSchoolInput, GetSchoolsQuery, GetSchoolsResponse, School, UpdateSchoolInput } from "@/lib/types/school";
// import { setCookie } from "@/lib/cookieUtils";


const BASE_URL =
    process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL || "https://x-portal-frontend.vercel.app"
        : `http://localhost:${process.env.PORT || 3000}`;

// Base query with TypeScript annotations
const baseQuery: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
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
    tagTypes: ["User", "Subscriptions", "Schools", "Students"],
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
            query: ({ search, page = 1, limit = 5 }) => {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                params.append('page', page.toString());
                params.append('limit', limit.toString());
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
                url: `/school/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Schools', id }, { type: 'Schools', id: 'LIST' }],
        }),
        toggleSchoolActive: builder.mutation<School, string>({
            query: (id) => ({
                url: `/school/${id}/toggle-active`,
                method: 'PATCH',
            }),
            invalidatesTags: (result) => (result ? [{ type: 'Schools', id: result.id }, { type: 'Schools', id: 'LIST' }] : []),
        }),


        addSubscription: builder.mutation({
            query: (subscription) => ({
                url: "/subscriptions",
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
            query: ({ page = 1, limit = 100 }) => ({
                url: "/subscriptions",
                params: { page, limit },
            }),
            providesTags: ["Subscriptions"],
        }),


        addStudent: builder.mutation({
            query: (subscription) => ({
                url: "/subscriptions",
                method: "POST",
                body: subscription,
            }),
            invalidatesTags: ["Students"],
        }),
        updateStudent: builder.mutation({
            query: ({ sn, ...updates }) => ({
                url: `/subscriptions/${sn}`,
                method: "PUT",
                body: updates,
            }),
            invalidatesTags: ["Students"],
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


    useAddSubscriptionMutation,
    useUpdateSubscriptionMutation,

    useAddStudentMutation,
    useUpdateStudentMutation,

} = api;

export type AppApi = typeof api;