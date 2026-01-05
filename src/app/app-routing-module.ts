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
        data: {
          breadcrumb: 'Dashboard'
        },
        component: Dashboard
      },
      {
        path: 'catalogs',
        loadChildren: () => import('./features/catalogs/catalogs-module').then(m => m.CatalogsModule),
        data: { 
          permission: 'CATALOGS_READ',
          breadcrumb: 'Catálogos' 
        },
        canActivate:[authGuard],
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects-module').then(m => m.ProjectsModule),
        data: { 
          permission: 'PROJECT_READ',
          breadcrumb: 'Proyectos'
        },
        canActivate:[authGuard],
      },
      {
        path: 'security',
        loadChildren: () => import('./features/security/security-module').then(m => m.SecurityModule),
        data: { 
          permission: 'SECURITY_READ',
          breadcrumb: 'Seguridad' 
        },
        canActivate:[authGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users-module').then(m => m.UsersModule),
        data: { 
          permission: 'USERS_READ',
          breadcrumb: 'Usuarios' 
        },
        canActivate:[authGuard],
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
