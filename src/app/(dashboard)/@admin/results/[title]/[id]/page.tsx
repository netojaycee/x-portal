import {Main} from "./Main";

export default async function RoleDetails({
  params,
}: {
  params: Promise<{ title: string; id: string }>;
}) {
  const { title, id } = await params;

  return <Main id={id} title={title} />;
}
