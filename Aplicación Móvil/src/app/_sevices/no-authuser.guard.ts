import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class NoAuthuserGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,

  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.afAuth.user.subscribe(user => {
        
        if (isNullOrUndefined(user)) {
          console.log("##### User Guard: no auth = true");
          console.log(user)
          resolve(true);
        } else {
          console.log("##### User Guard: no auth = false");
          console.log('User is not logged in');
          this.router.navigate(['/module-app/modules/inicio/rutas']);
          
          // route with redirect http://gnomeontherun.com/2017/03/02/guards-and-login-redirects-in-angular/
          //this.router.navigate(['/product-list'], { queryParams: { redirect: 3 }});
          resolve(false);
        }
      });
    });
  }
}
