import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../_model/usuarios';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class RegistroPerAdmService {

  constructor(private afs: AngularFirestore,
    private afa : AngularFireAuth) { }

  
  registrar(personalAdmin:Usuario){
    return this.afs.collection('usuarios').doc(personalAdmin.uid).set ({
      uid: personalAdmin.uid,
      nombre: personalAdmin.nombre,
      apellido: personalAdmin.apellido,
      email : personalAdmin.email,
      celular: personalAdmin.celular,
      cedula: personalAdmin.cedula,
      rol:personalAdmin.rol,
      clave:personalAdmin.clave,
      contador:1
    });
  }


  
  listar() {
    return this.afs.collection<Usuario>('usuarios', ref => ref.where('contador', '>', 0)).valueChanges();
  }

  modificar(usuario: Usuario){
    return this.afs.collection('usuarios').doc(usuario.uid).set(Object.assign({}, usuario)).then(()=>{
      return this.afs.collection("usuarios").doc(usuario.uid).update({
        contador: 1
    });
    });
  }

  leer(documentId: string){
    return this.afs.collection<Usuario>('usuarios').doc(documentId).valueChanges();
  }

  eliminar(usuario: Usuario) {
    return this.afs.collection('usuarios').doc(usuario.uid).delete();
  }

  registrarUsuario(usuario: string, clave: string) {
    return this.afa.auth.createUserWithEmailAndPassword(usuario, clave);
  }

  
  





}
