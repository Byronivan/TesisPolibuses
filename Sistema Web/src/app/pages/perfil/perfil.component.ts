import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerfilService } from 'src/app/_service/perfil.service';
import { Subject } from 'rxjs';
import { LoginService } from 'src/app/_service/login.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy{
  
  usuario: any={
    'nombre':'',
    'apellido':'',
    'email':'',
    'celular':'',
    'cedula':'',
    'rol':''
  }

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private perfilService: PerfilService, private loginService : LoginService,  public route: ActivatedRoute) { }

  ngOnInit() {
    this.perfilService.perfilUsuario().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
     
      this.usuario.nombre = data[0]['nombre']
      this.usuario.apellido = data[0]['apellido']
      this.usuario.email = data[0]['email']
      this.usuario.celular = data[0]['celular']
      this.usuario.cedula = data[0]['cedula']
      this.usuario.rol = data[0]['rol']
  
    })

    
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
