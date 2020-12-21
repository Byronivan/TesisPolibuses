import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//  firebase imports, remove what you don't require
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
//import { GoogleMaps } from '@ionic-native/google-maps';
import { Facebook } from '@ionic-native/facebook/ngx';

import { FCM } from '@ionic-native/fcm/ngx';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';


//Import storage
import { IonicStorageModule } from '@ionic/storage';
import { PopinforComponent } from './module-app/notificaciones/respuestas-form/popinfor/popinfor.component';


@NgModule({
  declarations: [AppComponent,PopinforComponent],
  entryComponents: [PopinforComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FCM,
    StatusBar,
    Facebook,
    SplashScreen,
    GooglePlus,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFirestoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
