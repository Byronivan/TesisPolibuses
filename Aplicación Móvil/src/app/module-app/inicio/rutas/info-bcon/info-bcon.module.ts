import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoBconPageRoutingModule } from './info-bcon-routing.module';

import { InfoBconPage } from './info-bcon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoBconPageRoutingModule
  ],
  declarations: [InfoBconPage]
})
export class InfoBconPageModule {}
