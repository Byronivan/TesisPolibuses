import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltroDirectionsPage } from './filtro-directions.page';

const routes: Routes = [
  {
    path: '',
    component: FiltroDirectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltroDirectionsPageRoutingModule {}
