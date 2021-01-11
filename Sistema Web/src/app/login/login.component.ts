import { MatSnackBar } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginService } from '../_service/login.service';
import { MenusService } from '../_service/menus.service';

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  usuario: string;
  clave: string;
  estadoLogin: boolean = true;
  estadoRecuperar: boolean;
  estadoCrear: boolean;
  hide = true;
  
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private loginService: LoginService,
    private afa: AngularFireAuth,
    private sncakBar: MatSnackBar,
    private menusService: MenusService
    ) { }

  ngOnInit() {
    this.afa.auth.signOut();
  }

  login() {
    if (this.usuario == null || this.clave == null) {
      this.sncakBar.open('Ingrese sus datos', 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
    } else {
      this.loginService.login(this.usuario, this.clave).then(user =>{
        this.listarMenus();
      }).catch(error => console.log(error));
    }

  }

  restablecerClave() {
    if (this.usuario == null) {
      this.sncakBar.open('Ingrese un correo válido', 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
    } else {
      this.loginService.restablecerClave(this.usuario);
    }
  }

  irLogin() {
    this.estadoLogin = true;
    this.estadoRecuperar = false;
    this.estadoCrear = false;
  }

  irRecuperar() {
    this.estadoRecuperar = true;
    this.estadoLogin = false;
    this.estadoCrear = false;
  }

  listarMenus(){
    this.menusService.listar().subscribe(data =>{
      this.menusService.menuCambio.next(data); //app component  suscritoa a la variable ractiva
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  estaLogeado() {
    return this.afa.auth.currentUser != null;
  }

}
