import { ENUM_GENDER } from "./types/enums";

// Hard-coded data for Schools
export const schoolsData = [
    {
        sn: 1,
        name: "St James School",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "--",
        dueDate: "--",
        subStatus: "Inactive",
    },
    {
        sn: 2,
        name: "Pain College",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "Silver",
        dueDate: "23-04-2024",
        subStatus: "Active",
    },
    {
        sn: 3,
        name: "Kids of God's man",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "Gold",
        dueDate: "23-04-2024",
        subStatus: "Inactive",
    },
    {
        sn: 4,
        name: "Bleed well kids intr.",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "--",
        dueDate: "--",
        subStatus: "Inactive",
    },
    {
        sn: 5,
        name: "Knowledge will's a",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "Gold",
        dueDate: "23-04-2024",
        subStatus: "Inactive",
    },
    {
        sn: 6,
        name: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "--",
        dueDate: "23-04-2024",
        subStatus: "Inactive",
    },
    {
        sn: 7,
        name: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "Gold",
        dueDate: "23-04-2024",
        subStatus: "Inactive",
    },
    {
        sn: 8,
        name: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "Silver",
        dueDate: "23-04-2024",
        subStatus: "Active",
    },
    {
        sn: 9,
        name: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        contact: "08183544702",
        subPlan: "Silver",
        dueDate: "23-04-2024",
        subStatus: "Inactive",
    },
];

// Hard-coded data for Subscribers
export const subscribersData = [
    {
        sn: 1,
        school: "St James School",
        email: "toluadebayo@gmail.com",
        plan: "Silver",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Inactive",
    },
    {
        sn: 2,
        school: "Pain College",
        email: "toluadebayo@gmail.com",
        plan: "Silver",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Active",
    },
    {
        sn: 3,
        school: "Kids of God's man",
        email: "toluadebayo@gmail.com",
        plan: "Browns",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Inactive",
    },
    {
        sn: 4,
        school: "Bleed well kids intr.",
        email: "toluadebayo@gmail.com",
        plan: "Gold",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Inactive",
    },
    {
        sn: 5,
        school: "Knowledge will's a",
        email: "toluadebayo@gmail.com",
        plan: "Silver",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Inactive",
    },
    {
        sn: 6,
        school: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        plan: "Gold",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Inactive",
    },
    {
        sn: 7,
        school: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        plan: "Gold",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Inactive",
    },
    {
        sn: 8,
        school: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        plan: "Silver",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Active",
    },
    {
        sn: 9,
        school: "Tolu Adebayo",
        email: "toluadebayo@gmail.com",
        plan: "Brown",
        startedDate: "23-05-2024",
        dueDate: "23-04-2024",
        status: "Inactive",
    },
];

export const studentDetails = [
    { label: "First Name", value: "Tolu" },
    { label: "Last Name", value: "Adebayo" },
    { label: "Admission Number", value: "JSS/2023/001" },
    { label: "Class", value: "JSS1" },
    { label: "Arm", value: "Gold" },
    { label: "Date of Birth", value: "15 January 2010" },
    { label: "Gender", value: "Male" },
    { label: "Email Address", value: "tolu.adebayo@example.com" },
    { label: "Address", value: "123 Lagos Street, Ikeja" },
    { label: "State", value: "Lagos" },
    { label: "LG Origin", value: "Ikeja" },
    { label: "Parent Name", value: "Mr Adebayo" },
    { label: "Parent Phone", value: "+234 801 234 5678" },
    { label: "Parent Email", value: "mr.adebayo@example.com" },
    { label: "Blood Group", value: "O+" },
    { label: "Religion", value: "Christianity" },
    { label: "Nationality", value: "Nigerian" },
    { label: "Admission Date", value: "1 September 2023" },
    { label: "Previous School", value: "Bright Future Elementary" },
    { label: "Medical Conditions", value: "None" },
  ];
// Attendance mock data for a month (e.g. May 2025)
export const mockAttendanceMay2025 = {
    "2025-05-01": { present: 5, absent: 1, late: 0 },
    "2025-05-02": { present: 6, absent: 0, late: 1 },
    "2025-05-03": { present: 4, absent: 2, late: 1 },
    "2025-05-04": { present: 7, absent: 0, late: 0 },
    "2025-05-05": { present: 7, absent: 0, late: 0 },
    "2025-05-06": { present: 5, absent: 2, late: 0 },
    "2025-05-07": { present: 6, absent: 1, late: 0 },
    "2025-05-08": { present: 6, absent: 1, late: 0 },
    "2025-05-09": { present: 5, absent: 2, late: 1 },
    "2025-05-10": { present: 7, absent: 0, late: 0 },
    "2025-05-11": { present: 6, absent: 1, late: 0 },
    "2025-05-12": { present: 7, absent: 0, late: 0 },
    "2025-05-13": { present: 6, absent: 1, late: 0 },
    "2025-05-14": { present: 7, absent: 0, late: 0 },
    "2025-05-15": { present: 5, absent: 2, late: 0 },
    "2025-05-16": { present: 6, absent: 1, late: 1 },
    "2025-05-17": { present: 7, absent: 0, late: 0 },
    "2025-05-18": { present: 6, absent: 1, late: 0 },
    "2025-05-19": { present: 7, absent: 0, late: 0 },
    "2025-05-20": { present: 6, absent: 1, late: 0 },
    "2025-05-21": { present: 7, absent: 0, late: 0 },
    "2025-05-22": { present: 7, absent: 0, late: 0 },
    "2025-05-23": { present: 6, absent: 1, late: 1 },
    "2025-05-24": { present: 5, absent: 2, late: 0 },
    "2025-05-25": { present: 7, absent: 0, late: 0 },
    "2025-05-26": { present: 6, absent: 1, late: 0 },
    "2025-05-27": { present: 7, absent: 0, late: 0 },
    "2025-05-28": { present: 5, absent: 2, late: 0 },
    "2025-05-29": { present: 6, absent: 1, late: 1 },
    "2025-05-30": { present: 7, absent: 0, late: 0 },
    "2025-05-31": { present: 6, absent: 1, late: 0 },
  };

// Hard-coded data for Subscriptions
export const subscriptionsData = [
    {
        sn: 1,
        package: "Gold",
        duration: "1 week",
        studentLimit: "50",
        subStatus: "Inactive",
    },
    {
        sn: 2,
        package: "Bronze",
        duration: "2 months",
        studentLimit: "100",
        subStatus: "Active",
    },
    {
        sn: 3,
        package: "Silver",
        duration: "1 month",
        studentLimit: "200",
        subStatus: "Inactive",
    },
    {
        sn: 4,
        package: "Diamond",
        duration: "1 year",
        studentLimit: "Unlimited",
        subStatus: "Inactive",
    },
];

// Hard-coded data for Classes
export const classesData = [
    {
        order: 1,
        category: "Junior Secondary School",
        className: "JSS1",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 2,
        category: "Junior Secondary School",
        className: "JSS2",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 3,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 4,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 5,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 6,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 7,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 8,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 9,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
    {
        order: 10,
        category: "Junior Secondary School",
        className: "JSS3",
        noOfArms: "4 Arms",
        status: "Inactive",
    },
];

// Hard-coded data for Class Arms
export const classArmsData = [
    {
        armName: "Gold",
        createDate: "07-07-2024",
        status: "Inactive",
    },
    {
        armName: "Diamond",
        createDate: "07-07-2024",
        status: "Inactive",
    },
    {
        armName: "Silver",
        createDate: "07-07-2024",
        status: "Inactive",
    },
    {
        armName: "Diamond",
        createDate: "07-07-2024",
        status: "Inactive",
    },
];

export const activities = [
    {
        icon: "/calendar.svg",
        title: "Event Title",
        description: "Event description",
        url: "/event/1",
    },
    {
        icon: "/calendar.svg",
        title: "Event Title",
        description: "Event description",
        url: "/event/2",
    },
];

export const stats = [
    { label: "Present", count: 250, percentage: 75, color: "green" },
    { label: "Absent", count: 0, percentage: 0, color: "red" },
    { label: "Late", count: 0, percentage: 0, color: "yellow" },
    { label: "Not Taken", count: 0, percentage: 0, color: "gray" },
];

export const revenueData = [
    { title: "Expected Revenue", icon: "/expected.png", amount: "400" },
    { title: "Generated Revenue", icon: "/generated.png", amount: "400" },
    { title: "Oustanding Amounts", icon: "/outstanding.png", amount: "400" }
]



export const studentsData = [
    { sn: 1, name: "Tolu Adebayo", gender: ENUM_GENDER.MALE, class: "JSS1", arms: "Gold", parentGuardian: "Mr Adebayo", createdDate: "23-04-2024", status: "Inactive" },
    { sn: 2, name: "Aisha Mohammed", gender: ENUM_GENDER.FEMALE, class: "JSS2", arms: "Silver", parentGuardian: "Mrs Mohammed", createdDate: "15-05-2024", status: "Active" },
    { sn: 3, name: "Chidi Okeke", gender: ENUM_GENDER.MALE, class: "JSS1", arms: "Blue", parentGuardian: "Mr Okeke", createdDate: "10-03-2024", status: "Active" },
    { sn: 4, name: "Funmi Olatunde", gender: ENUM_GENDER.FEMALE, class: "JSS3", arms: "Red", parentGuardian: "Mrs Olatunde", createdDate: "01-06-2024", status: "Inactive" },
    { sn: 5, name: "Emeka Nwosu", gender: ENUM_GENDER.MALE, class: "JSS2", arms: "Gold", parentGuardian: "Mr Nwosu", createdDate: "20-04-2024", status: "Active" },
];



export const parentsData = [
    { sn: 1, name: "Tolu Adebayo", emailAddress: "adebayoadeolu@gmail.com", contact: "09077056063", occupation: "Trading", createdDate: "23-04-2024", status: "Un-Linked" },
    { sn: 2, name: "Aisha Mohammed", emailAddress: "aishamohd@yahoo.com", contact: "08123456789", occupation: "Teacher", createdDate: "15-05-2024", status: "Linked" },
    { sn: 3, name: "Chidi Okeke", emailAddress: "chidiokeke@hotmail.com", contact: "07098765432", occupation: "Engineer", createdDate: "10-03-2024", status: "Un-Linked" },
    { sn: 4, name: "Funmi Olatunde", emailAddress: "funmiolatunde@gmail.com", contact: "09112233445", occupation: "Nurse", createdDate: "01-06-2024", status: "Linked" },
    { sn: 5, name: "Emeka Nwosu", emailAddress: "emekanwosu@outlook.com", contact: "08055667788", occupation: "Accountant", createdDate: "20-04-2024", status: "Un-Linked" },
    { sn: 6, name: "Zainab Ibrahim", emailAddress: "zainabibrahim@gmail.com", contact: "09033445566", occupation: "Lawyer", createdDate: "25-03-2024", status: "Linked" },
]