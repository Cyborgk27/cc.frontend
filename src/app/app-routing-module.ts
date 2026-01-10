import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { Dashboard } from './shared/components/pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { ErrorPage } from './shared/components/pages/error-page/error-page';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
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
        canActivate: [authGuard],
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects-module').then(m => m.ProjectsModule),
        data: {
          permission: 'PROJECT_READ',
          breadcrumb: 'Proyectos'
        },
        canActivate: [authGuard],
      },
      {
        path: 'security',
        loadChildren: () => import('./features/security/security-module').then(m => m.SecurityModule),
        data: {
          permission: 'SECURITY_READ',
          breadcrumb: 'Seguridad'
        },
        canActivate: [authGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users-module').then(m => m.UsersModule),
        data: {
          permission: 'USERS_READ',
          breadcrumb: 'Usuarios'
        },
        canActivate: [authGuard],
      },
      {
        path: '403',
        component: ErrorPage,
        data: {
          code: '403',
          title: 'Acceso Restringido',
          message: 'No tienes los permisos necesarios para ver este contenido. Contacta al administrador.',
          icon: 'lock_person'
        }
      },
      {
        path: '404',
        component: ErrorPage,
        data: {
          code: '404',
          title: 'Página no encontrada',
          message: 'Parece que te has perdido en el sistema. La ruta solicitada no existe.',
          icon: 'running_with_errors'
        }
      },
      // Comodín para cualquier ruta no definida
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  },

  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
