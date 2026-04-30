import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import { SimpleLayoutType } from 'config';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceUnderConstruction2 = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction2')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));
const MaintenanceComingSoon2 = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon2')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const Home = Loadable(lazy(() => import('pages/feature/gest/home')));
const Dashboard = Loadable(lazy(() => import('pages/feature/control-panel/dashboard')));

// render - episodes
const EpisodesList = Loadable(lazy(() => import('pages/feature/control-panel/episodes')));
const CreateEpisode = Loadable(lazy(() => import('pages/feature/control-panel/episodes/create')));
const EditEpisode = Loadable(lazy(() => import('pages/feature/control-panel/episodes/edit')));
const ViewEpisode = Loadable(lazy(() => import('pages/feature/control-panel/episodes/view')));

// render - episode categories
const EpisodeCategories = Loadable(lazy(() => import('pages/feature/control-panel/episode-categories')));

// render - worksheets
const Worksheets = Loadable(lazy(() => import('pages/feature/control-panel/worksheets')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: '/',
          element: <Home />
        }
      ]
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'dashboard/episodes',
          element: <EpisodesList />
        },
        {
          path: 'dashboard/episodes/create',
          element: <CreateEpisode />
        },
        {
          path: 'dashboard/episodes/:id',
          element: <ViewEpisode />
        },
        {
          path: 'dashboard/episodes/:id/edit',
          element: <EditEpisode />
        },
        {
          path: 'dashboard/episode-categories',
          element: <EpisodeCategories />
        },
        {
          path: 'dashboard/worksheets',
          element: <Worksheets />
        }
      ]
    },

    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'under-construction2',
          element: <MaintenanceUnderConstruction2 />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        },
        {
          path: 'coming-soon-2',
          element: <MaintenanceComingSoon2 />
        }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
