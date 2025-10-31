import {
  KeyIcon,
  LayoutDashboard,
  LayoutList,
  LucideIcon,
  SearchIcon,
  ShieldCheck,
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
