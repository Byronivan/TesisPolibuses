import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthuserGuard } from './_sevices/no-authuser.guard';
import { UserGuard } from './_sevices/user.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate:[NoAuthuserGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule),
    canActivate:[NoAuthuserGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate:[NoAuthuserGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule),
    canActivate:[NoAuthuserGuard]
  },
  {
    path: 'module-app',
    loadChildren: () => import('./module-app/module-app.module').then( m => m.ModuleAppPageModule),
    //******** Prevent access to page with canActivate ******/
    canActivate: [UserGuard]

    },
  
  {
    path: 'filtro-directions',
    loadChildren: () => import('./pages/filtro-directions/filtro-directions.module').then( m => m.FiltroDirectionsPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate:[NoAuthuserGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
