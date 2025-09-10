import {Main} from "./Main";

export default async function ClassDetails({
  params,
}: {
  params: Promise<{ sessionId: string; id: string; armId: string }>;
}) {
  const { sessionId, id, armId } = await params;

  return <Main id={id} sessionId={sessionId} armId={armId} />;
}
