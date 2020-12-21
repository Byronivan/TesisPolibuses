import { Horario } from './../_model/horarios';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorariosService implements OnDestroy{

  private ngUnsubscribe: Subject<void> = new Subject();
  
  constructor(private afs: AngularFirestore,   private snackBar: MatSnackBar) { }

  registrar(horarios:Horario){
    return this.afs.collection('horarios').doc(horarios.id).set ({
      id: horarios.id,
      idTrayectoria: horarios.idTrayectoria,
      nombreTrayectoria: horarios.nombreTrayectoria,
      horarioO: horarios.horarioO,
      horarioD: horarios.horarioD,
      horarioP : horarios.horarioP,
    });
  }

 
  

  listar() {
    return this.afs.collection<Horario>('horarios').valueChanges();
    
  }

  listarTrayect() {
    return this.afs.collection<any>('trayectorias').valueChanges();
    
  }

  leer(documentId: string){
    return this.afs.collection<Horario>('horarios').doc(documentId).valueChanges();
  }

  buscarHorarioId(horario: string) {
    return this.afs.collection('horarios', ref => ref.where('id', '==', horario)).snapshotChanges();
  }

  buscarHorarioTrayec(trayectoria:string){
    return this.afs.collection('horarios', ref => ref.where('idTrayectoria', '==', trayectoria)).get();
  }

  modificar(horarios:Horario){
    return this.afs.collection('horarios').doc(horarios.id).set(Object.assign({}, horarios));
  }

  eliminar(horarios:string) {
    // return this.afs.collection('horarios').doc(horarios).delete();
    return this.afs.collection('rutas', ref => ref.where('trayectoria', '==', horarios)).get().pipe(takeUntil(this.ngUnsubscribe)).subscribe((busqueda)=>{
      if(busqueda.size == 0){
        return this.afs.collection('horarios').doc(horarios).delete().then(()=>{
          this.snackBar.open('HORARIO ELIMINADO', 'AVISO', {
            duration: 2000,
            verticalPosition: 'top'

          });
        })
      }else{
        this.snackBar.open('ERROR: UNA RUTA TIENE ESTE HORARIO ASIGNADO', 'AVISO', {
          duration: 2000,
          verticalPosition: 'top'

        });
      }
     
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }



}
