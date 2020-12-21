import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Formulario } from '../model/formularios';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  constructor(private afs: AngularFirestore) { }

  registrar(formulario:Formulario, tokenid:string){
    var today = new Date();

    return this.afs.collection('formularios').doc(formulario.id).set ({
      id: formulario.id,
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      email: formulario.email.trim(),
      descripcion: formulario.descripcion,
      telefono: formulario.telefono,
      tipo: formulario.tipo,
      estado: "Pendiente",
      fecha: today,
      token: tokenid
    });
  }

}
