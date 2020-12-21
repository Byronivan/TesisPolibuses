import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiltrarPageRoutingModule } from './filtrar-routing.module';

import { FiltrarPage } from './filtrar.page';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiltrarPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBnYbekpZq_nVWTEoBDQJaaipmGqOPUdfc', 
      libraries: ['places']
    })
  ],
  declarations: [FiltrarPage]
})
export class FiltrarPageModule {}
