import { Component, OnInit } from '@angular/core';
import { TrayectoriasService } from 'src/app/_sevices/trayectorias.service';

@Component({
  selector: 'app-filtro-directions',
  templateUrl: './filtro-directions.page.html',
  styleUrls: ['./filtro-directions.page.scss'],
})
export class FiltroDirectionsPage implements OnInit {

  constructor(private tratect: TrayectoriasService) { }

  ngOnInit() {
    this.tratect.listar().forEach((element)=>{})
  }

  

}
