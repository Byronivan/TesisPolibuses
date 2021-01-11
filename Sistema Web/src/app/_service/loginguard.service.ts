import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MenusService } from './menus.service';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Menu } from '../_model/menu';

@Injectable({
  providedIn: 'root'
})
export class LoginguardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router,
    private menuService: MenusService, private afa: AngularFireAuth) { }

 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.afa.authState
      .pipe(map(authState => !!authState))
      .pipe(switchMap((auntenticado: boolean) => {
        if (!auntenticado) {
          this.router.navigate(['/home']);
          return of(false);
        } else {
          console.log('autenticado')
          //verificar roles
          let url = state.url;
          return this.menuService.listar().pipe(switchMap((menus) => {
            //para pintar los menus que le corresponden al usuario
            return this.loginService.user.pipe(map(data => {
              if (data) {
                let user_roles: string[] = data.rol;
                let final_menus: Menu[] = [];

                for (let menu of menus) {
                  n2: for (let rol of menu.roles) {
                    for (let urol of user_roles) {
                      if (rol === urol) {
                        let m = new Menu();
                        m.nombre = menu.nombre;
                        m.icono = menu.icono;
                        m.url = menu.url;
                        final_menus.push(m);
                        break n2;
                      }
                    }
                  }
                }

                //console.log(final_menus);
                this.menuService.menuCambio.next(final_menus);

                //los menus de una persona vs la URL que quiere acceder
                let cont = 0;
                for (let m of final_menus) {
                  if (url.startsWith(m.url)) {
                    cont++;
                    break;
                  }
                }

                if (cont > 0) {
                  return true;
                }else{
                  this.router.navigate(['not-found']);
                  return false;
                }

              }
            }));
          }));
        }
      }));
  }

}
