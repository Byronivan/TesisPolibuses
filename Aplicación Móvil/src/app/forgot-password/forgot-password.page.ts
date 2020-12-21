import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_sevices/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { IonicComponentService } from '../_sevices/ionic-component.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public resetPasswordForm: FormGroup;

  constructor(
    public authService: AuthenticationService,
    private navController: NavController,
    public menuCtrl: MenuController,
    public router: Router,
    private ionicComponentService: IonicComponentService,
    public formBuilder: FormBuilder) {

    let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],

    });
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      console.log("form is invalid = " + this.resetPasswordForm.value);
    } else {
      this.ionicComponentService.presentLoading();

      this.authService.resetPassword(this.resetPasswordForm.value.email)
        .then((user) => {
          this.ionicComponentService.dismissLoading();
          this.ionicComponentService.presentAlert("Te hemos enviado un link a tu correo para recuperar la contraseña");
          // this.nav.setRoot('LoginPage');
          this.router.navigateByUrl('/login');
        }, (error) => {
          var errorMessage: string = error.message;
          this.ionicComponentService.dismissLoading();
          this.ionicComponentService.presentAlert(errorMessage);
        });
    }
  }

}
