import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleAppPage } from './module-app.page';

const routes: Routes = [
  {
    path:'modules',
    component: ModuleAppPage,
    children:[
      {
        path: 'inicio',
        loadChildren: ()=>import('../module-app/inicio/inicio.module').then(m=>m.InicioPageModule)
      },
      {
        path: 'notificaciones',
        loadChildren: ()=>import('../module-app/notificaciones/notificaciones.module').then(m=>m.NotificacionesPageModule)
      },
      {
        path: 'formulario',
        loadChildren: ()=>import('../module-app/formulario/formulario.module').then(m=>m.FormularioPageModule)
      },
      {
        path: 'about',
        loadChildren: ()=>import('../module-app/perfil/perfil.module').then(m=>m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: '/modules/inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/modules/inicio',
    pathMatch: 'full'
  }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleAppPageRoutingModule {}
