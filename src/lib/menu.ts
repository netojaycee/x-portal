import {
    LayoutDashboard,
    UserPlus,
    Clock,
    DollarSign,
    Users,
    Briefcase,
    BarChart,
    FileText,
    MonitorPlay,
    MessageSquare,
    UserCog,
    BookOpen,
    HelpCircle,
    Settings,
    School,
    CreditCard,
    LifeBuoy,
} from "lucide-react";

export const adminMenu = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        url: '/dashboard',
        isActive: true,
        requiredPermission: 'dashboard:view',
    },
    {
        title: 'Admission',
        icon: UserPlus,
        url: '/admissions',
        isActive: true,
        requiredPermission: 'admission:read',
    },
    {
        title: 'Attendance',
        icon: Clock,
        url: '/attendance',
        isActive: true,
        requiredPermission: 'attendance:read',
    },
    {
        title: 'Fees',
        icon: DollarSign,
        url: '/fees',
        isActive: true,
        requiredPermission: 'fee:read',
    },
    {
        title: 'Students',
        icon: Users,
        url: '/students',
        isActive: true,
        requiredPermission: 'student:read',
    },
    {
        title: 'Staff',
        icon: Briefcase,
        url: '/staff',
        isActive: true,
        requiredPermission: 'staff:read',
    },
    {
        title: 'Scores',
        icon: BarChart,
        url: '/scores',
        isActive: true,
        requiredPermission: 'score:read',
    },
    {
        title: 'Results',
        icon: FileText,
        url: '/results',
        isActive: true,
        requiredPermission: 'result:read',
    },
    {
        title: 'CBT',
        icon: MonitorPlay,
        url: '/cbt',
        isActive: true,
        requiredPermission: 'cbt:read',
    },
    {
        title: 'Communication',
        icon: MessageSquare,
        url: '/communication',
        isActive: true,
        requiredPermission: 'communication:read',
    },
    {
        title: 'Users',
        icon: UserCog,
        url: '/users/all-users',
        isActive: true,
        requiredPermission: 'user:read',
    },
    {
        title: 'Lesson Plan',
        icon: BookOpen,
        url: '/lesson-plan',
        isActive: true,
        requiredPermission: 'lesson-plan:read',
    },
    {
        title: 'Help',
        icon: HelpCircle,
        url: '/help',
        isActive: false,
        requiredPermission: 'help:access',
    },
    {
        title: 'Configuration',
        icon: Settings,
        url: '/configuration',
        isActive: true,
        requiredPermission: 'configuration:read',
    },
];


export const superAdminMenu = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
        isActive: true
    },
    {
        title: "Schools",
        icon: School,
        url: "/schools",
        isActive: true
    },
    {
        title: "Subscription",
        icon: CreditCard,
        url: "/subscription",
        isActive: true
    },
    {
        title: "Support",
        icon: LifeBuoy,
        url: "/support",
        isActive: false
    },

];