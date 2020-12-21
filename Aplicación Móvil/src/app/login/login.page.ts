import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../_sevices/authentication.service';
import { IonicComponentService } from '../_sevices/ionic-component.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public showPassword: boolean = false;
  redirectUrl: string;
  public loginForm: FormGroup;
  public redirectPath: any;


  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public menuCtrl: MenuController,
    private ionicComponentService: IonicComponentService,
    public formBuilder: FormBuilder) {

    //validar mail
    let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    //crear form
    this.loginForm = formBuilder.group({
      username: [
        "",
        Validators.compose([Validators.pattern(EMAIL_REGEXP), Validators.required]),
      ],
      password: ["", Validators.compose([Validators.minLength(6), Validators.required])],
    });

  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.redirectUrl = this.activatedRoute.snapshot.queryParamMap.get(
      "redirectUrl"
    );
    console.log("redirectUrl=" + this.redirectUrl);

  }

  login() {
    if (!this.loginForm.valid) {
      this.ionicComponentService.presentAlert("Formulario no valido");
    } else {
      this.ionicComponentService.presentLoading();
      this.authService.signinUser(
        this.loginForm.value.username,
        this.loginForm.value.password)
        .then(
          (authData) => {
            this.ionicComponentService.dismissLoading();
            if (this.redirectUrl) {
              this.router.navigateByUrl("/" + this.redirectUrl);
            } else {
              this.router.navigateByUrl("/module-app/modules/inicio/rutas");
            }
          },
          (error) => {
            this.ionicComponentService.dismissLoading();
            this.ionicComponentService.presentAlert(ErroAuthEn.convertMessage(error['code']));
          }
        );
    }
  }

  logGoogle() {
    this.authService.Google().then(
      (authData) => {
        this.ionicComponentService.dismissLoading();
        if (this.redirectUrl) {
          this.router.navigateByUrl("/" + this.redirectUrl);
        } else {
          this.router.navigateByUrl("/module-app/modules/inicio/rutas");
        }
      },
      (error) => {
        this.ionicComponentService.dismissLoading();
        this.ionicComponentService.presentAlert(error.message);
      }
    );
  }

  logFacebook() {
    this.authService.loginFacebook().then(
      (authData) => {
        this.ionicComponentService.dismissLoading();
        if (this.redirectUrl) {
          this.router.navigateByUrl("/" + this.redirectUrl);
        } else {
          this.router.navigateByUrl("/module-app/modules/inicio/rutas");
        }
      },
      (error) => {

        this.ionicComponentService.dismissLoading();
        this.ionicComponentService.presentAlert(error.message);
      }
    );
  }


  forgot() {
    this.router.navigateByUrl("/forgot-password");
  }

  register() {
    this.router.navigateByUrl("/registro");
  }

  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

}


export namespace ErroAuthEn {
  export function convertMessage(code: string): string {
    console.log(code);
    switch (code) {
      case 'auth/user-disabled': {
        return 'Lo sentimos su usuario esta deshabilitado.';
      }

      case 'auth/user-not-found': {
        return 'Usuario no encontrado, ingrese nuevamente.';
      }

      case 'auth/wrong-password': {
        return 'La contraseña ingresada no es válida.';
      }

      case 'auth/invalid-email': {
        return 'Formato de correo no válido.';
      }

      case 'auth/invalid-password': {
        return 'El valor que se proporcionó para la propiedad password no es válido.';
      }

      default: {
        return 'Error al ingresar, intentelo más tarde';
      }
    }
  }
}
