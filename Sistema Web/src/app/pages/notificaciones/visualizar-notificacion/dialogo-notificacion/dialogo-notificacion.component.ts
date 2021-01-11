import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Notificacion } from 'src/app/_model/notificaciones';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialogo-notificacion',
  templateUrl: './dialogo-notificacion.component.html',
  styleUrls: ['./dialogo-notificacion.component.scss']
})
export class DialogoNotificacionComponent implements OnInit, OnDestroy {

  notificacion: Notificacion;
  fechaCreacion: any;

  file: any;
  labelFile: string;
  urlImagen: string;

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(public dialogRef: MatDialogRef<DialogoNotificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Notificacion,
    private afStorage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.notificacion = new Notificacion();
    this.notificacion.id = this.data.id;
    this.notificacion.asunto = this.data.asunto;
    this.notificacion.fecha = this.data.fecha;
    this.notificacion.descripcion = this.data.descripcion;
    this.fechaCreacion = this.data['fechaCreacion'];

    if (this.notificacion.id != null) {
      if (this.notificacion.id != null) {
        this.afStorage.ref(`notificaciones/${this.notificacion.id}`).getDownloadURL().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
          this.urlImagen = data;
        });
      }

    }

  }

  cancelar() {
    this.dialogRef.close();
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
