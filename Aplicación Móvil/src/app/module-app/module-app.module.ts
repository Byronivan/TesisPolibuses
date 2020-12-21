import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModuleAppPageRoutingModule } from './module-app-routing.module';

import { ModuleAppPage } from './module-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModuleAppPageRoutingModule
  ],
  declarations: [ModuleAppPage]
})
export class ModuleAppPageModule {}
