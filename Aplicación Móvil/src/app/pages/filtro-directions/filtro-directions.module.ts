import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltroDirectionsPageRoutingModule } from './filtro-directions-routing.module';

import { FiltroDirectionsPage } from './filtro-directions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltroDirectionsPageRoutingModule
  ],
  declarations: [FiltroDirectionsPage]
})
export class FiltroDirectionsPageModule {}
