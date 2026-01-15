import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../features/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'routines',
    loadComponent: () => import('../features/routines/routines.page').then((m) => m.RoutinesPage),
  },
  {
    path: 'library',
    loadComponent: () => import('../features/library/library.page').then((m) => m.LibraryPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('../features/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
