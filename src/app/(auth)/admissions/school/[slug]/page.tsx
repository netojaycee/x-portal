import React from "react";
import Main from "./Main";

export default async function AdmissionPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <Main slug={slug} />;
}
