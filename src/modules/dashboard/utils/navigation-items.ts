import {
  ClipboardList,
  CloudCheck,
  Earth,
  KeyIcon,
  LayoutDashboard,
  LayoutList,
  Logs,
  LucideIcon,
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
      // {
      //   title: 'CRM',
      //   url: '/admin/crm',
      //   icon: ChartBar,
      // }
      /*
      {
        title: "Finance",
        url: "/admin/finance",
        icon: Banknote,
      }, */
      // {
      //   title: 'Users',
      //   url: '/admin/users',
      //   icon: User,
      //   comingSoon: false,
      // },
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
    id: 2,
    label: 'Settings',
    items: [
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
      {
        title: 'Documents',
        url: '/admin/documents',
        icon: CloudCheck,
        comingSoon: true,
      },
      {
        title: 'Audit Logs',
        url: '/admin/logs',
        icon: Logs,
      },
      {
        title: 'Cities Locator',
        url: '/admin/cities',
        icon: Earth,
        comingSoon: true,
      },
    ],
  },
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
