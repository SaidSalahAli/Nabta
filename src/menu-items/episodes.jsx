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
      id: 'episodes',
      title: 'الحلقات',
      type: 'item',
      url: '/episodes',
      icon: icons.episodes
    },
    {
      id: 'episode-categories',
      title: 'تصنيفات الحلقات',
      type: 'item',
      url: '/episode-categories',
      icon: icons.categories
    },
    {
      id: 'worksheets',
      title: 'أوراق العمل',
      type: 'item',
      url: '/worksheets',
      icon: icons.worksheets
    }
  ]
};

export default episodes;
