import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Conductor } from 'src/app/_model/conductores';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { ConductoresService } from 'src/app/_service/conductores.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialogo-conductor',
  templateUrl: './dialogo-conductor.component.html',
  styleUrls: ['./dialogo-conductor.component.scss']
})
export class DialogoConductorComponent implements OnInit, OnDestroy{

  conductor: Conductor;

  file: any;
  labelFile: string;
  urlImagen: string;

  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(public dialogRef: MatDialogRef<DialogoConductorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Conductor, private afStorage: AngularFireStorage,
    private conductoresService: ConductoresService) { 
      
    }

  ngOnInit() {
    this.conductor = new Conductor();
    this.conductor.id = this.data.id;
    this.conductor.nombre = this.data.nombre;
    this.conductor.apellido = this.data.apellido;
    this.conductor.email = this.data.email;
    this.conductor.celular = this.data.celular;
    this.conductor.cedula = this.data.cedula;

    if(this.conductor.id!=null){
      console.log(this.conductor.id)
      this.conductoresService.leer(this.conductor.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Conductor) => {
      if(data.id != null){
         this.afStorage.ref(`conductores/${data.id}`).getDownloadURL().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data =>{
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
