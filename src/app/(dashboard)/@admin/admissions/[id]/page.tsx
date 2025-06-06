import React from "react";
import AdmissionDetail from "../(components)/AdmissionDetail";

export default async function AdmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdmissionDetail id={id} />;
}
