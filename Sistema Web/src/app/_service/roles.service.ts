import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Rol } from '../_model/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private afs : AngularFirestore) { }

}
