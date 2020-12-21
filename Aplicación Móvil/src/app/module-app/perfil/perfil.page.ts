import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/_sevices/authentication.service';
import { IonicComponentService } from 'src/app/_sevices/ionic-component.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  userPhoto: string;
  provider: string;

  user:any;

  nombre: string;
  apellido: string;
  mail: string;
  telefono:string;

  tel:string;

  userAuth: boolean = false; // Is user logged in ?

  constructor(private storage: Storage,
    public menuCtrl: MenuController,
    private navController: NavController,
    public router: Router,
    private fireAuth:AngularFireAuth,
    private ionicComponentService: IonicComponentService,
    private userService: AuthenticationService
    //private modalController: ModalController
  ) { 

  }

  async ngOnInit() {

    this.menuCtrl.enable(true);
    this.ionicComponentService.presentTimeoutLoading(1000,true);

    this.fireAuth.authState.subscribe(async (user) => {
      if(user) {
        this.provider =  user.providerData[0].providerId
        this.user = user  

        if(this.provider == 'password'){
          this.userService.getUserProfile().subscribe(async (user)=>{
            this.nombre = await user.firstname
            this.apellido = await user.lastname
            this.mail = await user.email
            this.telefono = await user.phone
          })          
        }else{
          this.nombre = this.user.displayName
          this.mail = this.user.email
        }

        if(isNullOrUndefined(await user.photoURL)){
          this.userPhoto = 'assets/inicioBackgrounds/user.png'
        }else{
          this.userPhoto = await user.photoURL
        }
        this.mostrar()
      }
    });
  }

  async logout(){
    //  this.userService.signoutUser();
    //  this.router.navigateByUrl('/side-menu/travel/tabs/tab1');
    await this.userService.signoutUser()
    .then(() => {
      console.log("LOGOUT");
      this.ionicComponentService.presentTimeoutLoading(1000,true);
      this.ionicComponentService.presentToastWithOptions("Notification","notifications-outline","","Sesión Cerrada","top",9000);
      //this.ionicComponentService.presentToast("Logout",1000);
      this.router.navigateByUrl('login');
        //loadingPopup.dismiss();
        //this.nav.setRoot('AfterLoginPage');
    }, (error) => { 
       var errorMessage: string = error.message;
       this.ionicComponentService.presentToast(errorMessage,3000);
       console.log("ERROR:"+errorMessage);
        //loadingPopup.dismiss();
        //this.presentAlert(errorMessage);      
    });
   }

  mostrar(){
    if(isNullOrUndefined(this.telefono) || isNullOrUndefined(this.apellido)){
      return false
    }else{
      return true
    }
  }

}
