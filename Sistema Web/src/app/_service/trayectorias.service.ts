import { Trayectoria } from './../_model/trayectorias';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrayectoriasService implements OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private afs: AngularFirestore,  private snackBar: MatSnackBar) { }

  registrar(trayectorias:Trayectoria){
    return this.afs.collection('trayectorias').doc(trayectorias.id).set ({
      id: trayectorias.id,
      nombre: trayectorias.nombre,
      origen: trayectorias.origen,
      destino : trayectorias.destino,
      paradas: trayectorias.paradas,
    });
  }

  
  listar() {
    return this.afs.collection<Trayectoria>('trayectorias').valueChanges();
    
  }

  listarTrayec() {
    return this.afs.collection<Trayectoria>('trayectorias').valueChanges();
  }


  leer(documentId: string){
    return this.afs.collection<Trayectoria>('trayectorias').doc(documentId).valueChanges();
  }

  buscarTrayectoriaId(trayectoria: string) {
    return this.afs.collection('trayectorias', ref => ref.where('id', '==', trayectoria)).snapshotChanges();
  }


  modificar(trayectorias:Trayectoria){
    return this.afs.collection('trayectorias').doc(trayectorias.id).set(Object.assign({}, trayectorias));
  }

  eliminar(trayectorias:Trayectoria) {
    return this.afs.collection('horarios', ref => ref.where('idTrayectoria', '==', trayectorias.id)).get().pipe(takeUntil(this.ngUnsubscribe)).subscribe((busqueda)=>{
      if(busqueda.size == 0){
        return this.afs.collection('trayectorias').doc(trayectorias.id).delete().then(()=>{
          this.snackBar.open('TRAYECTORIA ELIMINADA', 'AVISO', {
            duration: 2000,
            verticalPosition: 'top'

          });
        })
      }else{
        this.snackBar.open('ERROR: UN HORARIO TIENE ESTA TRAYECTORIA ASIGNADA', 'AVISO', {
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
