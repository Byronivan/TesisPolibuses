import { Component } from '@angular/core';

import { MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

//import { FCM } from '@ionic-native/fcm/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
import { Router } from '@angular/router';
import { AuthenticationService } from './_sevices/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  loggedIn = false;
  dark = false;
  
  layoutPages = [
    {
      title: 'Rutas',
      url: '/module-app/modules/inicio/rutas',
      icon: 'map'
    },
    {
      title: 'Filtrar Rutas',
      url: '/module-app/modules/inicio/filtrar',
      icon: 'navigate'
    },
    {
      title: 'Horarios',
      url: '/module-app/modules/inicio/horarios',
      icon: 'time'
    },
    {
      title: 'Formularios',
      url: '/module-app/modules/notificaciones/respuestas-form',
      icon: 'clipboard'
    },
    {
      title: 'Noticias',
      url: '/module-app/modules/notificaciones/noticias',
      icon: 'notifications'
    },
    {
      title: 'Enviar Formulario',
      url: '/module-app/modules/formulario',
      icon: 'attach'
    },
    {
      title: 'Perfil',
      url: '/module-app/modules/about',
      icon: 'images'
    }
  ];

  idtoken:string="";

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    // private userData: UserData,
    // private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private auth:AuthenticationService
    
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      FCM.subscribeToTopic('noticias');

      FCM.getToken().then(token => {
        this.idtoken = token
      });

      FCM.hasPermission().then(hasPermission => {
        if (hasPermission) {
          console.log("Has permission!");
        }
      })

      FCM.onNotification().subscribe((data) => {
        console.log(data)
        if (data.wasTapped) {
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      })

      FCM.onTokenRefresh().subscribe((token) => {
        console.log(token)
      })
    });
  }
}
