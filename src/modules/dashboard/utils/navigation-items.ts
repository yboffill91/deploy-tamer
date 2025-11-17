import {
  Briefcase,
  ClipboardList,
  Cloud,
  CloudCheck,
  Earth,
  KeyIcon,
  LayoutDashboard,
  LayoutList,
  Logs,
  LucideIcon,
  MonitorCloud,
  SearchIcon,
  ShieldCheck,
  Sliders,
  Users,
} from 'lucide-react';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

// --> Admin Items antes era sidebarItems igual que la otra variable

export const AdminSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: 'Dashboards',
    items: [
      {
        title: 'Home',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
      },

    ],
  },
  {
    id: 2,
    label: "Tools",
    items: [
      {
        title: 'SEO',
        url: '/admin/seo',
        icon: SearchIcon,
        subItems: [
          {
            title: 'Keyword Research',
            url: '/admin/seo/key_research',
            icon: KeyIcon,
          },
        ],
        comingSoon: false,
      },
    ],
  },
  {
    id: 3,
    label: 'HR',
    items: [
      {
        title: "User Management",
        url: '/admin',
        icon: Users,
        subItems: [
          {
            title: 'Teams',
            url: '/admin/teams',
            icon: ClipboardList,
          },
          {
            title: 'Users',
            url: '/admin/users',
            icon: Users,
          },
          {
            title: 'Position',
            url: '/admin/positions-management',
            icon: LayoutList,
          },
          {
            title: 'Roles',
            url: '/admin/roles-management',
            icon: ShieldCheck,
            comingSoon: false,
          },
          {
            title: 'Functionalities',
            url: '/admin/features-management',
            icon: Sliders,
          },

        ]
      },
      {
        title: "Client Management",
        url: '/admin/client-management',
        icon: Briefcase,
        subItems: [
          {
            title: 'Clients',
            url: '/admin/clients',
            icon: Users,
            comingSoon: true
          },
        ]
      }

    ],
  },
  {
    id: 4,
    label: "Administration",
    items: [



      {
        title: 'Audit Logs',
        url: '/admin/logs',
        icon: Logs,
      },
      {
        title: 'Cities Locator',
        url: '/admin/cities',
        icon: Earth,
      },
    ]
  },
  {
    id: 5, label: "Documents", items: [
      {
        title: "Users",
        url: "/documents/users",
        icon: MonitorCloud,
        subItems: [
          {
            title: 'Documents',
            url: '/admin/documents/users',
            icon: CloudCheck,
          },
        ]
      },
      {
        title: "Clients",
        url: "/documents/clients",
        icon: Cloud,
        subItems: [
          {
            title: 'Documents',
            url: '/admin/documents/clients',
            icon: CloudCheck,
          },
        ]
      }
    ]
  }
];

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: 'Dashboards',
    items: [
      {
        title: 'Default',
        url: '/dashboard/default',
        icon: LayoutDashboard,
      },
    ],
  },
];
