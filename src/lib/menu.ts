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
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
        isActive: true
    },
    {
        title: "Admission",
        icon: UserPlus,
        url: "/admission",
        isActive: false
    },
    {
        title: "Attendance",
        icon: Clock,
        url: "/attendance",
        isActive: false
    },
    {
        title: "Fees",
        icon: DollarSign,
        url: "/fees",
        isActive: false
    },
    {
        title: "Students",
        icon: Users,
        url: "/students",
        isActive: true
    },
    {
        title: "Staff",
        icon: Briefcase,
        url: "/staff",
        isActive: true
    },
    {
        title: "Scores",
        icon: BarChart,
        url: "/scores",
        isActive: false
    },
    {
        title: "Results",
        icon: FileText,
        url: "/results",
        isActive: false
    },
    {
        title: "CBT",
        icon: MonitorPlay,
        url: "/cbt",
        isActive: false
    },
    {
        title: "Communication",
        icon: MessageSquare,
        url: "/communication",
        isActive: false
    },
    {
        title: "Users",
        icon: UserCog,
        url: "/users",
        isActive: true
    },
    {
        title: "Lesson Plan",
        icon: BookOpen,
        url: "/lesson-plan",
        isActive: false
    },
    {
        title: "Help",
        icon: HelpCircle,
        url: "/help",
        isActive: false
    },
    {
        title: "Configuration",
        icon: Settings,
        url: "/configuration",
        isActive: true
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