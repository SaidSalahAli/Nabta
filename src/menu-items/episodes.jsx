// assets
import { Play, Category, Document } from 'iconsax-react';

// icons
const icons = {
  episodes: Play,
  categories: Category,
  worksheets: Document
};

// ==============================|| MENU ITEMS - EPISODES ||============================== //

const episodes = {
  id: 'group-episodes',
  title: 'الحلقات',
  type: 'group',
  children: [
    {
      id: 'dashboard/episodes',
      title: 'الحلقات',
      type: 'item',
      url: '/dashboard/episodes',
      icon: icons.episodes
    },
    {
      id: 'dashboard/episode-categories',
      title: 'تصنيفات الحلقات',
      type: 'item',
      url: '/dashboard/episode-categories',
      icon: icons.categories
    },
    {
      id: 'dashboard/worksheets',
      title: 'أوراق العمل',
      type: 'item',
      url: '/dashboard/worksheets',
      icon: icons.worksheets
    }
  ]
};

export default episodes;
