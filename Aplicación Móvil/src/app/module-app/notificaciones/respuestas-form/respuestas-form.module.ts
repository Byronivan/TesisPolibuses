import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RespuestasFormPageRoutingModule } from './respuestas-form-routing.module';

import { RespuestasFormPage } from './respuestas-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RespuestasFormPageRoutingModule
  ],
  declarations: [RespuestasFormPage]
})
export class RespuestasFormPageModule {}
