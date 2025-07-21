import {Main} from "./Main";

export default async function ClassDetails({
  params,
}: {
  params: Promise<{ sessionId: string; id: string }>;
}) {
  const { sessionId, id } = await params;

  return <Main id={id} sessionId={sessionId} />;
}
