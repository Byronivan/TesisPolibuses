import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiltrarPage } from './filtrar.page';

const routes: Routes = [
  {
    path: '',
    component: FiltrarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltrarPageRoutingModule {}
