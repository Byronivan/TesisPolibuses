import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoBconPage } from './info-bcon.page';

const routes: Routes = [
  {
    path: '',
    component: InfoBconPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoBconPageRoutingModule {}
