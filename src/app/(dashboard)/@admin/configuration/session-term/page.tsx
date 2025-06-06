"use client";
import { useGetSessionsQuery } from "@/redux/api";
import SessionTables from "./(components)/SessionsTable";

// Example usage with RTK Query
const Sessions: React.FC = () => {
  const { data, isLoading } = useGetSessionsQuery({});
  console.log("Sessions data", data && data);
  const sessions = data?.data || [];
  return <SessionTables sessions={sessions} isLoading={isLoading} />;

  //   return <div>hello</div>;
};

export default Sessions;
