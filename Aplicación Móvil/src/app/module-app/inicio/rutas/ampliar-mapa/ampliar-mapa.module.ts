import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AmpliarMapaPageRoutingModule } from './ampliar-mapa-routing.module';

import { AmpliarMapaPage } from './ampliar-mapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmpliarMapaPageRoutingModule
  ],
  declarations: [AmpliarMapaPage]
})
export class AmpliarMapaPageModule {}
