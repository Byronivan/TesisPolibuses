import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  status: any;

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
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['/inicio']);
          
          // route with redirect http://gnomeontherun.com/2017/03/02/guards-and-login-redirects-in-angular/
          //this.router.navigate(['/product-list'], { queryParams: { redirect: 3 }});
          resolve(false);
        }
      });
    });
  }
  
}
