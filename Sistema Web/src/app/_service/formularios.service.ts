import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Formulario } from '../_model/formularios';
import { Respuesta } from '../_model/respuestaForm';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  constructor(private afs: AngularFirestore) { }

  registrar(respuestaFormulario:Respuesta, token: string, tipo: string){
    return this.afs.collection('respuestas').doc(respuestaFormulario.id).set ({
      id: respuestaFormulario.id,
      estado: respuestaFormulario.estado,
      descripcion: respuestaFormulario.descripcion,
      idForm: respuestaFormulario.idForm,
      token: token,
      tipo: tipo
    });
  }

  updateForm(idForm:string, estadoS:string){
    return this.afs.collection("formularios").doc(idForm).update({
      estado: estadoS['value']
  });
  }

 
  buscarRespuesta(idForm: string){
    return this.afs.collection('respuestas', ref => ref.where('idForm', '==', idForm)).valueChanges();
  }



  listar() {
    return this.afs.collection<Formulario>('formularios').valueChanges();

  }

  leer(documentId: string) {
    return this.afs.collection<Formulario>('formularios').doc(documentId).valueChanges();
  }

  

}
