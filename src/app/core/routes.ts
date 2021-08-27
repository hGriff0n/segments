import { Routes } from '@angular/router';
import { HOME_ROUTES } from '../home/routes';
import { LayoutComponent } from '../shared/layout/layout.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      ...HOME_ROUTES,
    ],
  },
  { path: '**', redirectTo: '' },
];
