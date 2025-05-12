"use client";
import { useLogoutMutation } from "@/redux/api";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loader2, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Logout() {
  const [logout, { isLoading, isSuccess, isError, error }] =
    useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(null));
      dispatch(setAuthenticated(false));
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else if (isError && error) {
      const errorMessage =
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "error" in error.data
          ? (error.data as { message?: string }).message
          : "An error occurred. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
    }
  }, [isSuccess, isError, error, router, dispatch]);

  return (
    <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
      {isLoading ? <Loader2 className='animate-spin' /> : <LogOut />}
      Log out
    </DropdownMenuItem>
  );
}
