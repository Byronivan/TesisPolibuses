import { Injectable } from '@angular/core';
import { Trayectoria } from '../model/trayectorias';
import { AngularFirestore } from '@angular/fire/firestore/';

@Injectable({
  providedIn: 'root'
})
export class TrayectoriasService {

  constructor(private afs: AngularFirestore) {

  }

  listar() {
    return this.afs.collection<Trayectoria>('trayectorias').valueChanges();
  }

  leer(documentId: string){
    return this.afs.collection<Trayectoria>('trayectorias').doc(documentId).valueChanges();
  }

  buscarTrayectoriaId(trayectoria: string) {
    return this.afs.collection('trayectorias', ref => ref.where('id', '==', trayectoria)).snapshotChanges();
  }

  }
