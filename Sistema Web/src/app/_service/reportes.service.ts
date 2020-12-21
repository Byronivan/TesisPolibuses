import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private afs: AngularFirestore) { }


  buscarPorFecha(fechaInicio: Date, fechaFin: Date) {
    let fInicio = moment(fechaInicio).add(1, 'days').format('YYYY-MM-DD')
    let fFin = moment(fechaFin).add(2, 'days').format('YYYY-MM-DD')

    let buscarInicio = new Date(fInicio)
    let buscarFin = new Date(fFin)

    buscarInicio.setMinutes(0)
    buscarInicio.setSeconds(0)
    buscarInicio.setHours(0)
    buscarInicio.setMilliseconds(0)

    buscarFin.setMinutes(0)
    buscarFin.setSeconds(0)
    buscarFin.setHours(0)
    buscarFin.setMilliseconds(0)

    return this.afs.collection('formularios', ref => ref
      .where('fecha', '>=', buscarInicio)
      .where('fecha', '<', buscarFin)
    ).valueChanges();
  }

  
}
