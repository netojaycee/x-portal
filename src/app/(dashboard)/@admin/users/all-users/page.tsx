import Link from "next/link";

export default function AllUsersPage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>All Users</h1>
      <p>User list goes here...</p>
      <Link href={"/users/all-users/1"}>12</Link>
      {/* Add your user list component */}
    </div>
  );
}
