import Main from "./Main";

export default async function BroadSheetByGrade({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Main id={id} />;
}
