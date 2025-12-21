export interface SupportContact {
    initials: string;
    name: string;
    role: string;
    phone: string;
    message?: string;
    color: string; // Tailwind class for bg
}

export const SUPPORT_TEAM: SupportContact[] = [
    {
        initials: "CD",
        name: "Craig K Domingo",
        role: "Technical Support",
        phone: "+263 776 808 964",
        message: "+263 781 901 939",
        color: "bg-indigo-600",
    },
    {
        initials: "DM",
        name: "Darrell B Magirazi",
        role: "MSU Sales & Partnerships",
        phone: "+263 786 639 149",
        color: "bg-emerald-500",
    },
    {
        initials: "JM",
        name: "Jackson Mamutse",
        role: "UZ Sales & Partnerships",
        phone: "+263 781 164 313",
        color: "bg-rose-500",
    },
    {
        initials: "CA",
        name: "Carlington",
        role: "UZ Sales & Partnerships",
        phone: "+263 771 355 174",
        color: "bg-rose-500",
    },
];
