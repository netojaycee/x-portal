import { Parent, Student } from "./types";
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



export const studentsData: Student[] = [
    { sn: 1, name: "Tolu Adebayo", gender: ENUM_GENDER.MALE, class: "JSS1", arms: "Gold", parentGuardian: "Mr Adebayo", createdDate: "23-04-2024", status: "Inactive" },
    { sn: 2, name: "Aisha Mohammed", gender: ENUM_GENDER.FEMALE, class: "JSS2", arms: "Silver", parentGuardian: "Mrs Mohammed", createdDate: "15-05-2024", status: "Active" },
    { sn: 3, name: "Chidi Okeke", gender: ENUM_GENDER.MALE, class: "JSS1", arms: "Blue", parentGuardian: "Mr Okeke", createdDate: "10-03-2024", status: "Active" },
    { sn: 4, name: "Funmi Olatunde", gender: ENUM_GENDER.FEMALE, class: "JSS3", arms: "Red", parentGuardian: "Mrs Olatunde", createdDate: "01-06-2024", status: "Inactive" },
    { sn: 5, name: "Emeka Nwosu", gender: ENUM_GENDER.MALE, class: "JSS2", arms: "Gold", parentGuardian: "Mr Nwosu", createdDate: "20-04-2024", status: "Active" },
];



export const parentsData: Parent[] = [
    { sn: 1, name: "Tolu Adebayo", emailAddress: "adebayoadeolu@gmail.com", contact: "09077056063", occupation: "Trading", createdDate: "23-04-2024", status: "Un-Linked" },
    { sn: 2, name: "Aisha Mohammed", emailAddress: "aishamohd@yahoo.com", contact: "08123456789", occupation: "Teacher", createdDate: "15-05-2024", status: "Linked" },
    { sn: 3, name: "Chidi Okeke", emailAddress: "chidiokeke@hotmail.com", contact: "07098765432", occupation: "Engineer", createdDate: "10-03-2024", status: "Un-Linked" },
    { sn: 4, name: "Funmi Olatunde", emailAddress: "funmiolatunde@gmail.com", contact: "09112233445", occupation: "Nurse", createdDate: "01-06-2024", status: "Linked" },
    { sn: 5, name: "Emeka Nwosu", emailAddress: "emekanwosu@outlook.com", contact: "08055667788", occupation: "Accountant", createdDate: "20-04-2024", status: "Un-Linked" },
    { sn: 6, name: "Zainab Ibrahim", emailAddress: "zainabibrahim@gmail.com", contact: "09033445566", occupation: "Lawyer", createdDate: "25-03-2024", status: "Linked" },
]