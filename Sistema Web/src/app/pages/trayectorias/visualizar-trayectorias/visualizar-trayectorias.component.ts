import { VerTrayectoriasComponent } from './ver-trayectorias/ver-trayectorias.component';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Trayectoria } from './../../../_model/trayectorias';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { TrayectoriasService } from 'src/app/_service/trayectorias.service';

@Component({
  selector: 'app-visualizar-trayectorias',
  templateUrl: './visualizar-trayectorias.component.html',
  styleUrls: ['./visualizar-trayectorias.component.scss']
})
export class VisualizarTrayectoriasComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource<Trayectoria>()
  datostabla: any[] = []
  displayedColumns = ['nombre', 'numParadas', 'acciones'];

  /*
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  */

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private trayectoriasService: TrayectoriasService, private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.trayectoriasService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.dataSource.data = data as Trayectoria[];
    })
  }

  eliminar(trayectoria: Trayectoria) {
    this.trayectoriasService.eliminar(trayectoria);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  verTrayectoria(trayectoria: Trayectoria) {
    this.dialog.open(VerTrayectoriasComponent, {
      width: '80%',
      data: trayectoria
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }



}
