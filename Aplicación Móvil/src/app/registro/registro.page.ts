import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_sevices/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { IonicComponentService } from '../_sevices/ionic-component.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  public showPassword: boolean = false;
  redirectUrl: string;
  public registerForm: FormGroup;


  constructor(public authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public menuCtrl: MenuController,
    private ionicComponentService: IonicComponentService,
    public formBuilder: FormBuilder) {

    let PHONE_REGEXP = /[0-9]/;
    let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
    this.registerForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      lastname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      phone: ['', Validators.compose([Validators.minLength(9),Validators.maxLength(10), Validators.required,Validators.required,Validators.pattern(PHONE_REGEXP)])],
      username: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
    // const secondParam: string = this.route.snapshot.queryParamMap.get('secondParamKey');
    console.log("redirectUrl=" + this.redirectUrl)
  }

  async registerUser() {
    console.log("call signopUser");
    if (!this.registerForm.valid) {
      console.log(this.registerForm.value);
      console.log("invalid form")
      this.ionicComponentService.presentAlert("invalid form");
    } else {
      this.ionicComponentService.presentLoading();
      console.log(this.registerForm.value);
      console.log("yes, ")

      await this.authService.signupUser(
        this.registerForm.value.firstname,
        this.registerForm.value.lastname,
        this.registerForm.value.phone,
        this.registerForm.value.username,
        this.registerForm.value.password
      ).then(() => {
        this.ionicComponentService.dismissLoading();
        if (this.redirectUrl) {
          this.router.navigateByUrl('/' + this.redirectUrl);
        } else {
          this.router.navigateByUrl('/login');
        }
        this.ionicComponentService.presentAlert("Usuario Registrado");
        //this.router.navigateByUrl('/side-menu/travel/tabs/tab1');
        //loadingPopup.dismiss();
        //this.nav.setRoot('AfterLoginPage');
      }, (error) => {
        var errorMessage: string = error.message;
        this.ionicComponentService.dismissLoading();
        this.ionicComponentService.presentAlert(errorMessage);
      });

    }
  }

  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

}
