// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
        <a href='/dashboard' className='text-blue-500 hover:underline'>
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
