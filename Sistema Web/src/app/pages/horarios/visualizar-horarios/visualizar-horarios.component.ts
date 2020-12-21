import { DialogoHorariosComponent } from './dialogo-horarios/dialogo-horarios.component';
import { TrayectoriasService } from './../../../_service/trayectorias.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HorariosService } from './../../../_service/horarios.service';
import { Horario } from './../../../_model/horarios';
import { Subject } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { DialogoHorariosNComponent } from './dialogo-horarios-n/dialogo-horarios-n.component';

@Component({
  selector: 'app-visualizar-horarios',
  templateUrl: './visualizar-horarios.component.html',
  styleUrls: ['./visualizar-horarios.component.scss']
})
export class VisualizarHorariosComponent implements OnInit, OnDestroy {

  
  public dataSource = new MatTableDataSource<Horario>()
  dataHorarios: any[] = [];
  displayedColumns = ['nombre', 'origen', 'destino', 'detalleM', 'detalleN', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private horariosService: HorariosService, private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private dialog: MatDialog) { }



  ngOnInit() {
    this.horariosService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.dataSource.data = data as Horario[];
    });
  }

  verHorario(horario: Horario) {
    this.dialog.open(DialogoHorariosComponent, {
      width: '50%',
      data: horario
    });
  }

  verHorarioN(horario: Horario) {
    this.dialog.open(DialogoHorariosNComponent, {
      width: '50%',
      data: horario
    });
  }

  eliminar(horarios: any) {
    this.horariosService.eliminar(horarios.id);
  
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
