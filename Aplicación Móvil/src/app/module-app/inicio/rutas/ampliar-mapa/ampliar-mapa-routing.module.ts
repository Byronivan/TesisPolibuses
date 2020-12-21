import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmpliarMapaPage } from './ampliar-mapa.page';

const routes: Routes = [
  {
    path: '',
    component: AmpliarMapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AmpliarMapaPageRoutingModule {}
