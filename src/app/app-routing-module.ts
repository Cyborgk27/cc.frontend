import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { Dashboard } from './shared/components/pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: Layout,
    canActivate:[authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'catalogs',
        loadChildren: () => import('./features/catalogs/catalogs-module').then(m => m.CatalogsModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects-module').then(m => m.ProjectsModule)
      },
      {
        path: 'security',
        loadChildren: () => import('./features/security/security-module').then(m => m.SecurityModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users-module').then(m => m.UsersModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
