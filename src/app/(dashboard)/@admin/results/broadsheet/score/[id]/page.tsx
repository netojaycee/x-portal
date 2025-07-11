import Main from "./Main";

export default async function BroadSheetByScore({
  params,
}: {
  params: Promise<{  id: string }>;
}) {
  const {  id } = await params;

  return <Main id={id} />;
}
