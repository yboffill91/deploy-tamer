import {
  LayoutDashboard,
  ChartBar,
  SearchIcon,
  KeyIcon,
  type LucideIcon,
  User,
} from "lucide-react";

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

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Default",
        url: "/admin/default",
        icon: LayoutDashboard,
      },
      {
        title: "CRM",
        url: "/admin/crm",
        icon: ChartBar,
      } /* 
      {
        title: "Finance",
        url: "/admin/finance",
        icon: Banknote,
      }, */,
      {
        title: "Customers",
        url: "/admin/users",
        icon: User,
        comingSoon: false,
      },
      {
        title: "SEO",
        url: "/admin/seo",
        icon: SearchIcon,
        subItems: [{ title: "Keyword Research", url: "/admin/seo/key_research", icon: KeyIcon }],
        comingSoon: false,
      },
    ],
  },
];
