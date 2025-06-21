// Student attendance type definitions

export enum AttendanceStatus {
    PRESENT = 'present',
    LATE = 'late',
    ABSENT = 'absent'
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    registrationNumber: string;
    gender: string;
    imageUrl?: string;
}

export interface AttendanceRecord {
    studentId: string;
    status: AttendanceStatus;
    comment?: string;
}

export interface AttendanceSubmission {
    sessionId: string;
    term: string;
    classId: string;
    classArmId: string;
    date: string;
    attendanceRecords: AttendanceRecord[];
}

export interface AttendanceStudentResponse {
    success: boolean;
    data: {
        students: Student[];
        existingAttendance?: {
            id: string;
            date: string;
            studentId: string;
            status: AttendanceStatus;
            comment?: string;
        }[];
    };
    message: string;
}
