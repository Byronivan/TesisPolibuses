import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { valorReloj, RelojService } from 'src/app/_service/reloj.service';
import { Observable, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { LoginService } from './_service/login.service';
import { Usuario } from './_model/usuarios';
import { Menu } from './_model/menu';
import { MenusService } from './_service/menus.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  menus: Menu[] = [];
  datos$: Observable<valorReloj>;
  hora: number;
  minutos: string;
  dia: string;
  fecha: string;
  ampm: string;
  segundos: string;
  title = 'PolibusesWeb';

  private ngUnsubscribe: Subject<void> = new Subject();

  user: Observable<Usuario>;

  nombreUsuario: String;
  @ViewChild('sidenav',{ static: true }) sidenav: MatSidenav;

  constructor(
    private relojService: RelojService,
    private _location: Location,
    public loginService: LoginService,
    private menusService: MenusService,
    private router: Router
  ) {

  }

  ngOnInit() {
    
    this.menusService.menuCambio.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.menus = data;
      this.sidenav.open();
      
    });
    this.datos$ = this.relojService.getInfoReloj();
    this.datos$.subscribe(x => {
      this.hora = x.hora;
      this.minutos = x.minutos;
      this.dia = x.diadesemana;
      this.fecha = x.diaymes;
      this.ampm = x.ampm;
      this.segundos = x.segundo
    });
  }

  backClicked() {
    this._location.back();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
