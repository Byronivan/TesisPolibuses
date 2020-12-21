import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RespuestasFormPage } from './respuestas-form.page';

const routes: Routes = [
  {
    path: '',
    component: RespuestasFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RespuestasFormPageRoutingModule {}
