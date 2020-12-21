import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Bus } from '../_model/buses';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  constructor(private afs: AngularFirestore) { }

  registrar(bus: Bus) {
    return this.afs.collection('buses').doc(bus.id).set({
      id: bus.id,
      numero: bus.numero,
      capacidad: bus.capacidad,
      placa: bus.placa,
      conductor: bus.conductor
    }).then(() => {
      bus = null;
    })
  }

  listar() {
    return this.afs.collection<Bus>('buses').valueChanges();
  }

  buscarBus(bus: Bus) {
    return this.afs.collection('buses', ref => ref.where('placa', '==', bus.placa)).get();
  }

  buscarBusId(bus: string) {
    return this.afs.collection('buses', ref => ref.where('id', '==', bus)).snapshotChanges();
  }

  buscarBusCon(conductor: string) {
    return this.afs.collection('buses', ref => ref.where('conductor', '==', conductor)).get();
  }


  modificar(bus: Bus) {
    return this.afs.collection('buses').doc(bus.id).set(Object.assign({}, bus));
  }

  leer(documentId: string) {
    return this.afs.collection<Bus>('buses').doc(documentId).valueChanges();
  }

  eliminar(bus: Bus) {
    console.log(bus.id)
    return this.afs.collection('buses').doc(bus.id).delete().then(() => {
      return this.afs.collection('rutas', ref => ref.where('bus', '==', bus.id)).snapshotChanges().subscribe(val => {
        val.forEach((data: any) => {
          let idBus = data.payload.doc.data().id;
          return this.afs.collection('rutas').doc(idBus).update({
            "bus": "Sin Bus asignado"
          })
        })
      })
    })
  }

}
