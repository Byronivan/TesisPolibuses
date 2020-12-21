import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  rutas: any;

  constructor(private afs: AngularFirestore) { }
  
  getRutasZona(zona: string ) {
    console.log(zona)
    return this.afs.collection('rutas', ref => ref.where('zona','==', zona )).valueChanges();
  }



}
