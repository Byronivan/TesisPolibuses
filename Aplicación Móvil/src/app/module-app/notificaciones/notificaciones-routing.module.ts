import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacionesPage } from './notificaciones.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacionesPage
  },
  {
    path: 'noticias',
    loadChildren: () => import('./noticias/noticias.module').then( m => m.NoticiasPageModule)
  },
  {
    path: 'respuestas-form',
    loadChildren: () => import('./respuestas-form/respuestas-form.module').then( m => m.RespuestasFormPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacionesPageRoutingModule {}
