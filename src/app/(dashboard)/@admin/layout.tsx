import { ENUM_ROLE } from "@/lib/types/enums";
import Wrapper from "../components/view/Wrapper";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Wrapper role={ENUM_ROLE.ADMIN}>
      <main className='py-4'>{children}</main>
    </Wrapper>
  );
}
