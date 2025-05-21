// "use client"
// import LoaderComponent from "@/components/local/LoaderComponent";
// import React, { Fragment, Suspense, useState, useEffect } from "react";
// import { AlertError } from "../../components/alert/Error";
// import { usePathname, useRouter } from "next/navigation";

// // Define ENUM_USER_PAGE to match slot names
// enum ENUM_USER_PAGE {
//   allUsers = "allUsers",
//   rolesPermissions = "rolesPermissions",
//   activityLog = "activityLog",
// }

// // Define type for status
// type STATUS = "loading" | "completed" | "error";

// // Define type for view nodes (matches slot props)
// type UsersViewNode = {
//   allUsers: React.ReactNode;
//   rolesPermissions: React.ReactNode;
//   activityLog: React.ReactNode;
// };

// export default function UsersLayout({
//   allUsers,
//   rolesPermissions,
//   activityLog,
// }: {
//   allUsers: React.ReactNode;
//   rolesPermissions: React.ReactNode;
//   activityLog: React.ReactNode;
// }) {
//   const [status, setStatus] = useState<STATUS>("completed");
//   const [page, setPage] = useState<ENUM_USER_PAGE>(ENUM_USER_PAGE.allUsers);
//   const pathname = usePathname();
//   const router = useRouter();

//   console.log(pathname)

//   // Handle tab click
//   const handleTabClick = (selectedPage: ENUM_USER_PAGE) => {
//     setStatus("loading");
//     setPage(selectedPage);
//     console.log(selectedPage)
//     setTimeout(() => setStatus("completed"), 300); // Replace with data fetching if needed
//   };

//   // Map page to corresponding slot
//   const type: UsersViewNode = {
//     allUsers,
//     rolesPermissions,
//     activityLog,
//   };

//   const view = page ? type[page] : null;

//   return (
//     <Fragment>
//       {/* Fixed Tab Navigation */}
//       <div className=' w-full bg-white shadow-md z-10'>
//         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
//           <div className='flex space-x-8'>
//             <button
//               onClick={() => handleTabClick(ENUM_USER_PAGE.allUsers)}
//               className={`py-4 px-1 text-sm font-medium transition-colors duration-200 ${
//                 page === ENUM_USER_PAGE.allUsers
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               All Users
//             </button>
//             <button
//               onClick={() => handleTabClick(ENUM_USER_PAGE.rolesPermissions)}
//               className={`py-4 px-1 text-sm font-medium transition-colors duration-200 ${
//                 page === ENUM_USER_PAGE.rolesPermissions
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Roles & Permissions
//             </button>
//             <button
//               onClick={() => handleTabClick(ENUM_USER_PAGE.activityLog)}
//               className={`py-4 px-1 text-sm font-medium transition-colors duration-200 ${
//                 page === ENUM_USER_PAGE.activityLog
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Activity Log
//             </button>
//           </div>
//         </div>
//         <div className='w-full h-0.5 bg-primary' />
//       </div>

//       {/* Main Content */}
//       <Suspense fallback={<LoaderComponent />}>
//         <div className='pt-16 min-h-screen'>
//           {status === "loading" && <LoaderComponent />}
//           {status === "completed" && view && <main>{view}</main>}
//           {status === "error" && (
//             <NotLoggedIn message='Invalid route called!' />
//           )}
//         </div>
//       </Suspense>
//     </Fragment>
//   );
// }

// function NotLoggedIn({ message }: { message: string }) {
//   return (
//     <article className='flex w-full items-center justify-center h-screen'>
//       <div className='w-[400px]'>
//         <AlertError message={message} />
//       </div>
//     </article>
//   );
// }

"use client";
import LoaderComponent from "@/components/local/LoaderComponent";
import React, { Fragment, Suspense, useState, useEffect } from "react";
import { AlertError } from "../../components/alert/Error";
import { usePathname, useRouter } from "next/navigation";

// Define ENUM_USER_PAGE to match page routes
enum ENUM_USER_PAGE {
  allUsers = "all-users",
  rolesPermissions = "roles-permissions",
  activityLog = "activity-log",
}

// Define type for status
type STATUS = "loading" | "completed" | "error";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<STATUS>("completed");
  const [page, setPage] = useState<ENUM_USER_PAGE>(ENUM_USER_PAGE.allUsers);
  const pathname = usePathname();
  const router = useRouter();

  // Sync page state with URL
  useEffect(() => {
    const segments = pathname.split("/");
    const tab = segments[segments.length - 1] as ENUM_USER_PAGE;
    const parentTab = segments[segments.length - 2] as ENUM_USER_PAGE; // For /miscellaneous/allUsers/users/[userId]
    // console.log(parentTab, segments, tab, segments.length);
    if (Object.values(ENUM_USER_PAGE).includes(tab)) {
      setPage(tab);
      setStatus("completed");
    } else if (
      segments.includes("all-users") &&
      Object.values(ENUM_USER_PAGE).includes(parentTab)
    ) {
      setPage(ENUM_USER_PAGE.allUsers); // Keep allUsers active for /miscellaneous/allUsers/users/[userId]
      setStatus("completed");
    } else if (
      segments.includes("roles-permissions") &&
      Object.values(ENUM_USER_PAGE).includes(parentTab)
    ) {
      setPage(ENUM_USER_PAGE.rolesPermissions); // Keep allUsers active for /miscellaneous/allUsers/users/[userId]
      setStatus("completed");
    } else if (
      segments.includes("activity-log") &&
      Object.values(ENUM_USER_PAGE).includes(parentTab)
    ) {
      setPage(ENUM_USER_PAGE.activityLog); // Keep allUsers active for /miscellaneous/allUsers/users/[userId]
      setStatus("completed");
    } else {
      setStatus("error");
    }
  }, [pathname]);

  // Handle tab click
  const handleTabClick = (selectedPage: ENUM_USER_PAGE) => {
    setStatus("loading");
    setPage(selectedPage);
    router.push(`/users/${selectedPage}`);
    setTimeout(() => setStatus("completed"), 700); // Replace with data fetching if needed
  };

  return (
    <Fragment>
      {/* Fixed Tab Navigation */}
      <div className=' w-full z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex space-x-8'>
            <button
              onClick={() => handleTabClick(ENUM_USER_PAGE.allUsers)}
              className={`py-2 px-1 text-sm font-medium transition-colors duration-200 ${
                page === ENUM_USER_PAGE.allUsers
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => handleTabClick(ENUM_USER_PAGE.rolesPermissions)}
              className={`py-2 px-1 text-sm font-medium transition-colors duration-200 ${
                page === ENUM_USER_PAGE.rolesPermissions
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Roles & Permissions
            </button>
            <button
              onClick={() => handleTabClick(ENUM_USER_PAGE.activityLog)}
              className={`py-2 px-1 text-sm font-medium transition-colors duration-200 ${
                page === ENUM_USER_PAGE.activityLog
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Activity Log
            </button>
          </div>
        </div>
        <div className='w-full h-0.5 bg-gray-300 ' />
      </div>

      {/* Main Content */}
      <Suspense fallback={<LoaderComponent />}>
        <div className='mt-4'>
          {status === "loading" && <LoaderComponent />}
          {status === "completed" && children && <main>{children}</main>}
          {status === "error" && (
            <NotLoggedIn message='Invalid route called!' />
          )}
        </div>
      </Suspense>
    </Fragment>
  );
}

function NotLoggedIn({ message }: { message: string }) {
  return (
    <article className='flex w-full items-center justify-center h-screen'>
      <div className='w-[400px]'>
        <AlertError message={message} />
      </div>
    </article>
  );
}
