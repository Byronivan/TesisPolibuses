import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Formulario } from 'src/app/_model/formularios';
import { Subject } from 'rxjs';
import { FormulariosService } from 'src/app/_service/formularios.service';


@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.scss']
})
export class FormulariosComponent implements OnInit {




  constructor() { }

   ngOnInit() {
   

   }
}
