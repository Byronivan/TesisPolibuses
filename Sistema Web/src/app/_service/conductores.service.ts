import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Conductor } from '../_model/conductores';
import { MatSnackBar } from '@angular/material';



@Injectable({
  providedIn: 'root'
})
export class ConductoresService {

  constructor(private afs: AngularFirestore) { }

  registrar(conductor: Conductor) {
    if (conductor != null) {
      let datos: Conductor = {
        id: conductor.id,
        nombre: conductor.nombre,
        apellido: conductor.apellido,
        email: conductor.email,
        celular: conductor.celular,
        cedula: conductor.cedula
      }
      return this.afs.collection('conductores').doc(conductor.id).set(datos).then(() => {
        conductor = null;
        datos = null;
      })
    } else {
      console.log('no hay datos');
    }

  }

  buscarConductor(conductor: Conductor) {
    return this.afs.collection('conductores', ref => ref.where('cedula', '==', conductor.cedula)).get();
  }

  buscarConductorId(conductor: string) {
    return this.afs.collection('conductores', ref => ref.where('id', '==', conductor)).snapshotChanges();
  }

  listar() {
    return this.afs.collection<Conductor>('conductores').valueChanges();

  }

  modificar(conductor: Conductor) {
    return this.afs.collection('conductores').doc(conductor.id).set(Object.assign({}, conductor));
  }


  leer(documentId: string) {
    return this.afs.collection<Conductor>('conductores').doc(documentId).valueChanges();
  }

  eliminar(conductor: Conductor) {
    return this.afs.collection('conductores').doc(conductor.id).delete().then(() => {
      return this.afs.collection('buses', ref => ref.where('conductor', '==', conductor.id)).snapshotChanges().subscribe(val => {
        val.forEach((data: any) => {
          let idBus = data.payload.doc.data().id;
          return this.afs.collection('buses').doc(idBus).update({
            "conductor": "Sin Conductor asignado"
          })
        })
      })
    }).catch(error => error)
  }




}

