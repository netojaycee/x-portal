import { mockAttendanceMay2025 } from "@/lib/data";
import { AttendanceCalendar } from "../(components)/AttendanceCalendar";

export default function Page() {
  // Example: Show May 2025 (so month=4, since 0-indexed)
  return (
    <main className='p-8'>
      <AttendanceCalendar
        year={2025}
        month={4}
        attendance={mockAttendanceMay2025}
      />
    </main>
  );
}
