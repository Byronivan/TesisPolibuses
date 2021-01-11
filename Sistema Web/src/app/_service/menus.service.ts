import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Menu } from '../_model/menu';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  menuCambio = new Subject<Menu[]>();

  constructor(private afs: AngularFirestore) { }

  listar() {
    return this.afs.collection<Menu>('menus').valueChanges();
  }

  
}
