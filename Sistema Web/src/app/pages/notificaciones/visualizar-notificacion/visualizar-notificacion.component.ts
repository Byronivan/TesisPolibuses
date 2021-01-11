import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Notificacion } from 'src/app/_model/notificaciones';
import { NotificacionesService } from 'src/app/_service/notificaciones.service';
import { Subject } from 'rxjs';
import { DialogoNotificacionComponent } from './dialogo-notificacion/dialogo-notificacion.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualizar-notificacion',
  templateUrl: './visualizar-notificacion.component.html',
  styleUrls: ['./visualizar-notificacion.component.scss']
})
export class VisualizarNotificacionComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource<Notificacion>()
  displayedColumns = ['fechaCreacion','asunto', 'fecha', 'acciones'];

  /*
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;*/

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    private notificacionesService: NotificacionesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.notificacionesService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (data) => {
      this.dataSource.data = data as Notificacion[];
    });

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  eliminar(notificacion: Notificacion) {
    this.notificacionesService.eliminar(notificacion).then(() => {
      this.snackBar.open('SE ELIMINO CON ÉXITO', 'AVISO', {
        duration: 2000
      });
    });
  }

  visualizarDialogo(notificacion: Notificacion) {
    this.dialog.open(DialogoNotificacionComponent, {
      width: '35%',
      data: notificacion
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
