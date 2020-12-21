import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/';

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private afs: AngularFirestore) { }

  buscarBusId(idbus: string) {
    return this.afs.collection('buses', ref => ref.where('id', '==', idbus)).valueChanges();
  }

  buscarConductorId(idcon: string) {
    return this.afs.collection('conductores', ref => ref.where('id', '==', idcon)).valueChanges();
  }

  buscarTrayectoriaId(idTrayec: string) {
    return this.afs.collection('trayectorias', ref => ref.where('id', '==', idTrayec)).valueChanges();
  }

  buscarHorarios(idTrayec:string){
    return this.afs.collection('horarios', ref => ref.where('id', '==', idTrayec)).valueChanges();
  }

  listarRutas() {
    return this.afs.collection<any>('rutas').valueChanges();
  }

  listarNoticias() {
    return this.afs.collection<any>('notificaciones').valueChanges();
  }

  listarFormularios(usuario:string) {
    return this.afs.collection<any>('formularios', ref => ref.where('email', '==', usuario)).valueChanges();
  }

  buscarRespuestaForm(idForm: string) {
    return this.afs.collection('respuestas', ref => ref.where('idForm', '==', idForm)).valueChanges();
  }


}
