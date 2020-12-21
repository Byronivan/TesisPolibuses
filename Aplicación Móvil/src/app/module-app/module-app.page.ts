import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../_sevices/authentication.service';

@Component({
  selector: 'app-module-app',
  templateUrl: './module-app.page.html',
  styleUrls: ['./module-app.page.scss'],
})
export class ModuleAppPage implements OnInit {

  constructor(public auth: AuthenticationService, private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true);
  }

}
