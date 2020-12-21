import { Ruta } from './../_model/rutas';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor(private afs: AngularFirestore) { }

  registrar(rutas: Ruta) {
    return this.afs.collection('rutas').doc(rutas.id).set({
      id: rutas.id,
      nombre: rutas.nombre,
      descripcion: rutas.descripcion,
      trayectoria: rutas.trayectoria,
      bus: rutas.bus,
      zona: rutas.zona
    });
  }


  listar() {
    return this.afs.collection<Ruta>('rutas').valueChanges();

  }

  leer(documentId: string) {
    return this.afs.collection<Ruta>('rutas').doc(documentId).valueChanges();
  }

  modificar(rutas: Ruta) {
    return this.afs.collection('rutas').doc(rutas.id).set(Object.assign({}, rutas));
  }

  eliminar(rutas: Ruta) {
    return this.afs.collection('rutas').doc(rutas.id).delete();
  }

}
