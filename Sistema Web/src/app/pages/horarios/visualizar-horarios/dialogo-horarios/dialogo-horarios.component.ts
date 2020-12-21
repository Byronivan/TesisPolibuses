import { TrayectoriasService } from './../../../../_service/trayectorias.service';
import { HorariosService } from './../../../../_service/horarios.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Horario } from 'src/app/_model/horarios';

@Component({
  selector: 'app-dialogo-horarios',
  templateUrl: './dialogo-horarios.component.html',
  styleUrls: ['./dialogo-horarios.component.scss']
})
export class DialogoHorariosComponent implements OnInit {

  public dataSource = new MatTableDataSource<Horario>()
  displayedColumns: string[] = ['idp', 'nombre', 'horarioD'];
  horario = new Horario();

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(public dialogRef: MatDialogRef<DialogoHorariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.horario.id = this.data.id;
    this.horario.idTrayectoria = this.data.idTrayectoria;
    this.horario.nombreTrayectoria = this.data.nombreTrayectoria;
    this.horario.horarioO = this.data.horarioO
    this.horario.horarioD = this.data.horarioD
    this.horario.horarioP = this.data.horarioP

    this.dataSource.data = this.horario.horarioP as any[];
  }

  cancelar() {
    this.dialogRef.close();
  }

}
