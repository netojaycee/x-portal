import { ENUM_ROLE } from "@/lib/types/enums";
import Wrapper from "../components/view/Wrapper";

export default function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Wrapper role={ENUM_ROLE.SUPERADMIN}>
      <main className='py-4 space-y-4'>{children}</main>{" "}
    </Wrapper>
  );
}
