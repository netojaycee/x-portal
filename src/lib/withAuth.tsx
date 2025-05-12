// hocs/withAuth.tsx
import { useEffect, useState, ComponentType } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetProfileQuery } from "@/redux/api";
import {
  setUser,
  setLoading,
  setError,
  setAuthenticated,
} from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";

interface CookieResponse {
  token: string | null;
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props: P) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const [cookieChecked, setCookieChecked] = useState(false);

    // Fetch profile with RTK Query
    const { data, error, isLoading } = useGetProfileQuery(undefined, {
      refetchOnMountOrArgChange: true,
      skip: !!user && cookieChecked,
    });

    // Check cookies via /api/cookies
    useEffect(() => {
      const fetchCookies = async () => {
        try {
          const response = await fetch("/api/cookies", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            const { token }: CookieResponse = await response.json();
            dispatch(setAuthenticated(!!token));
          } else {
            dispatch(setAuthenticated(false));
          }
        } catch {
          dispatch(setAuthenticated(false));
        } finally {
          setCookieChecked(true);
        }
      };

      fetchCookies();
    }, [dispatch]);

    // Handle profile query results
    useEffect(() => {
      if (isLoading) {
        dispatch(setLoading());
      } else if (data) {
        dispatch(setUser(data));
      } else if (error) {
        dispatch(setError("Failed to fetch profile"));
        if ("status" in error && error.status === 401) {
          dispatch(setAuthenticated(false));
          window.location.href = "/";
        }
      }
    }, [data, error, isLoading, dispatch]);

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuth;
};

export default withAuth;
