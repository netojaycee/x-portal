"use client";
import { useLogoutMutation } from "@/redux/api";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Logout() {
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      await new Promise((resolve) => setTimeout(resolve, 300));

      // 4) Then navigate
      router.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
      let msg = "Unable to log out. Please try again.";
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as any).data === "object" &&
        (err as any).data !== null &&
        "message" in (err as any).data
      ) {
        msg = (err as any).data.message;
      }
      toast.error(msg, { position: "top-right" });
    }
  };

  return (
    <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
}
