import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notificacion } from '../_model/notificaciones';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(private afs: AngularFirestore
    ) { }

    registrar(notificacion:Notificacion){
      var today = new Date();
      return this.afs.collection('notificaciones').doc(notificacion.id).set ({
        id: notificacion.id,
        asunto: notificacion.asunto,
        fecha: notificacion.fecha,
        descripcion : notificacion.descripcion,
        fechaCreacion: today
        
      });
    }

    listar() {
      return this.afs.collection<Notificacion>('notificaciones').valueChanges();
      
    }

    leer(documentId: string){
      return this.afs.collection<Notificacion>('notificaciones').doc(documentId).valueChanges();
    }
  
    eliminar(notificacion: Notificacion) {
      return this.afs.collection('notificaciones').doc(notificacion.id).delete();
    }
}
