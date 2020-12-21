import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { InformacionRutasComponent } from './informacion-rutas/informacion-rutas.component';


@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss']
})
export class RutasComponent implements OnInit {

 

  constructor(public route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit() {
   
  }

  abrirDialogo(){
    this.dialog.open(InformacionRutasComponent, {
      width: '90%',
    });
  }

}
