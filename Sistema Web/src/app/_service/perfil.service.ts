import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private afs: AngularFirestore) { }


  perfilUsuario() {
    return this.afs.collection('usuarios', ref => ref.where('email', '==', localStorage.getItem("usuario"))).valueChanges();
  }

  nameDocument() {
    return this.afs.collection('usuarios', ref => ref.where('email', '==', localStorage.getItem("usuario"))).get();
  }

  updateUser(datos:any){
    console.log(datos)
    return this.afs.collection("usuarios").doc(datos.uid).update({
      nombre : datos.nombre,
      apellido: datos.apellido,
      cedula: datos.cedula,
      celular: datos.celular,
      contador: 1
  });

  }

}
