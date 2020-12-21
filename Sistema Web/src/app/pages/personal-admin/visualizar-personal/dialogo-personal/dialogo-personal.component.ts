import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Usuario } from 'src/app/_model/usuarios';
import { RegistroPerAdmService } from 'src/app/_service/registro-per-adm.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialogo-personal',
  templateUrl: './dialogo-personal.component.html',
  styleUrls: ['./dialogo-personal.component.scss']
})
export class DialogoPersonalComponent implements OnInit, OnDestroy {

  usuario: Usuario;

  file: any;
  labelFile: string;
  urlImagen: string;

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(public dialogRef: MatDialogRef<DialogoPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario, private afStorage: AngularFireStorage,
    private usuariosService:RegistroPerAdmService) { }

  ngOnInit() {
    this.usuario = new Usuario();
    this.usuario.uid = this.data.uid;
    this.usuario.nombre = this.data.nombre;
    this.usuario.apellido = this.data.apellido;
    this.usuario.email = this.data.email;
    this.usuario.celular = this.data.celular;
    this.usuario.cedula = this.data.cedula;
    this.usuario.rol = this.data.rol;

    if(this.usuario.uid!=null){
      this.usuariosService.leer(this.usuario.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Usuario) => {
      if(data.uid != null){
         this.afStorage.ref(`usuarios/${data.uid}`).getDownloadURL().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data =>{
           this.urlImagen=data;
         });
       }
     });
    }
  }

  cancelar(){
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    
  }
  
}
