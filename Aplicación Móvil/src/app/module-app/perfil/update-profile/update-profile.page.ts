import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/_sevices/authentication.service';
import { IonicComponentService } from 'src/app/_sevices/ionic-component.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  public updateForm: FormGroup;
  userDetail: Observable<any>;
  constructor(
    public userService: AuthenticationService,
    public menuCtrl: MenuController,
    private navController: NavController,
    public router: Router,
    private ionicComponentService: IonicComponentService,
    //private modalController: ModalController
    public formBuilder: FormBuilder
  ) {

    let PHONE_REGEXP = /[0-9]/;
    this.updateForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      lastname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      phone: ['', Validators.compose([Validators.minLength(9), Validators.maxLength(10), Validators.required,Validators.pattern(PHONE_REGEXP)])],
      username: ['', Validators.compose([Validators.required])],
    });
  }

  async ngOnInit() {
    this.userDetail = await this.userService.getUserProfile();
  }

  async updateProfile() {
    if (!this.updateForm.valid) {
      this.ionicComponentService.presentAlert("Formulario no valido");
    } else {
      // console.log("itemId="+this.itemId);
      // add to firebase
      this.ionicComponentService.presentLoading();

      console.log(this.updateForm.value.firstname,this.updateForm.value.lastname,this.updateForm.value.phone,this.updateForm.value.username);
      await this.userService.updateUserProfile(
        this.updateForm.value.firstname,
        this.updateForm.value.lastname,
        this.updateForm.value.phone,
        this.updateForm.value.username
      )
        .then(() => {
          this.ionicComponentService.presentToast("Profile updated", 2000);
          this.ionicComponentService.dismissLoading();
          this.router.navigateByUrl('/module-app/modules/about');
          //this.nav.setRoot('AfterLoginPage');
        }, (error) => {
          var errorMessage: string = error.message;
          this.ionicComponentService.dismissLoading();
          this.ionicComponentService.presentAlert(errorMessage);

        });
      //this.firestore.doc('item/'+this.itemId).update(postData);
      //this.router.navigateByUrl('crud-item');    
    }
  }

}
