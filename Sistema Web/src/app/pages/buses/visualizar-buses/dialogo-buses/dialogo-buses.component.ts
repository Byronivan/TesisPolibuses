import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Bus } from 'src/app/_model/buses';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { BusesService } from 'src/app/_service/buses.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ConductoresService } from 'src/app/_service/conductores.service';

@Component({
  selector: 'app-dialogo-buses',
  templateUrl: './dialogo-buses.component.html',
  styleUrls: ['./dialogo-buses.component.scss']
})
export class DialogoBusesComponent implements OnInit, OnDestroy {

  bus: Bus;
  nombre: string;
  apellido: String;

  file: any;
  labelFile: string;
  urlImagen: string;

  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(public dialogRef: MatDialogRef<DialogoBusesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Bus,
    private afStorage: AngularFireStorage,
    private busesService: BusesService,
    private conductoresService: ConductoresService) {

  }

  ngOnInit() {

    this.bus = new Bus();
    this.bus.id = this.data.id;
    this.bus.numero = this.data.numero;
    this.bus.capacidad = this.data.capacidad;
    this.bus.placa = this.data.placa;

    this.conductoresService.buscarConductorId(this.data.conductor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(conduc => {
      if (conduc.length == 0) this.bus.conductor = this.data.conductor;
      else {
        conduc.forEach((data: any) => {
          this.nombre = data.payload.doc.data().nombre
          this.apellido = data.payload.doc.data().apellido
          this.bus.conductor = this.nombre + " " + this.apellido;
        })
      }
    })


    if (this.bus.id != null) {
      this.afStorage.ref(`buses/${this.bus.id}`).getDownloadURL().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
        this.urlImagen = data;
      });
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
