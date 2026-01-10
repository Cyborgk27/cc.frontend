import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSecurity } from './pages/list-security/list-security';
import { NewSecurity } from './pages/new-security/new-security';
import { EditSecurity } from './pages/edit-security/edit-security';
import { FeatureForm } from './components/feature-form/feature-form';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-security',
    pathMatch: 'full'
  },
  {
    path: 'list-security',
    component: ListSecurity,
    data: { 
      breadcrumb: 'Gestión de Seguridad' 
    }
  },
  {
    path: 'new-security',
    component: NewSecurity,
    data: { 
      breadcrumb: 'Nuevo Rol' 
    }
  },
  {
    path: 'edit-security/:id',
    component: EditSecurity,
    data: { 
      breadcrumb: 'Editar Rol' 
    }
  },
  {
    path: 'new-feature',
    component: FeatureForm,
    data: { 
      breadcrumb: 'Nuevo Módulo' 
    }
  },
  {
    path: 'edit-feature/:id',
    component: FeatureForm,
    data: { 
      breadcrumb: 'Editar Módulo' 
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }