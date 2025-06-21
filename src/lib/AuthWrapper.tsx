// components/AuthWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import withAuth from "./withAuth";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const ProtectedComponent = withAuth<AuthWrapperProps>(({ children }) => {
  return <>{children}</>;
});

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const pathname = usePathname();

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/admissions/school/"];

  // Apply withAuth only for non-public routes
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return <ProtectedComponent>{children}</ProtectedComponent>;
};

export default AuthWrapper;
