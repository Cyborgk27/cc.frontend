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
  },
  {
    path: 'new-security',
    component: NewSecurity,
  },
  {
    path: 'edit-security/:id',
    component: EditSecurity,
  },
  {
    path: 'new-feature',
    component: FeatureForm, // Asegúrate de importar este componente
  },
  {
    path: 'edit-feature/:id',
    component: FeatureForm,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
