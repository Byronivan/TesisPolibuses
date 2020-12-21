import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TrayectoriasService } from 'src/app/_service/trayectorias.service';
import { HorariosService } from 'src/app/_service/horarios.service';
import { Horario } from 'src/app/_model/horarios';

@Component({
  selector: 'app-dialogo-horarios-n',
  templateUrl: './dialogo-horarios-n.component.html',
  styleUrls: ['./dialogo-horarios-n.component.scss']
})
export class DialogoHorariosNComponent implements OnInit {

  public dataSource = new MatTableDataSource<Horario>()
  displayedColumns: string[] = ['idp', 'nombre', 'horarioN'];
  horario = new Horario();

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  constructor(public dialogRef: MatDialogRef<DialogoHorariosNComponent>,
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
