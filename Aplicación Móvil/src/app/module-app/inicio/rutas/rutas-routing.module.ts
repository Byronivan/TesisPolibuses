import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutasPage } from './rutas.page';

const routes: Routes = [
  {
    path: '',
    component: RutasPage
  },
  {
    path: 'ampliar-mapa',
    loadChildren: () => import('./ampliar-mapa/ampliar-mapa.module').then( m => m.AmpliarMapaPageModule)
  },
  {
    path: 'info-bcon',
    loadChildren: () => import('./info-bcon/info-bcon.module').then( m => m.InfoBconPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutasPageRoutingModule {}
