import {
  AlertTriangle,
  Building2,
  List,
  LucideIcon,
  MapPin,
  Search,
} from 'lucide-react';
import { ReactNode } from 'react';
import { KeywordResearchForm } from '../keyword-research/KeywordResearchForm';

interface TabsLists {
  tab_name: string;
  tab_value: string;
  icon: LucideIcon;
  name: string;
  component: ReactNode;
}
export const TabsLists: TabsLists[] = [
  {
    tab_name: 'Keyword Research',
    tab_value: 'keyword_research',
    icon: Search,
    name: 'keyword_research',
    component: <KeywordResearchForm />,
  },
  {
    tab_name: 'All Request',
    tab_value: 'all_request',
    icon: List,
    name: 'all_request',
    component: <h1>All Request</h1>,
  },
  // {
  //   tab_name: 'Brands List',
  //   tab_value: 'company_list',
  //   icon: Building2,
  //   name: 'company_list',
  //   component: <h1>Company List</h1>,
  // },

  // {
  //   tab_name: 'Negative Search Intent',
  //   tab_value: 'negative_keywords_search_intent',
  //   icon: AlertTriangle,
  //   name: 'negative_keywords_search_intent',
  //   component: <h1>Negative keywords Search Intent</h1>,
  // },
];
