import { DialogoRutasComponent } from './dialogo-rutas/dialogo-rutas.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { RutasService } from './../../../_service/rutas.service';
import { Ruta } from './../../../_model/rutas';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-visualizar-rutas',
  templateUrl: './visualizar-rutas.component.html',
  styleUrls: ['./visualizar-rutas.component.scss']
})
export class VisualizarRutasComponent implements OnInit, OnDestroy {



  public dataSource = new MatTableDataSource<Ruta>()
  displayedColumns = ['nombre', 'zona', 'bus', 'trayectoria', 'acciones'];

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private ngUnsubscribe: Subject<void> = new Subject();

  pagina: any;

  constructor(private rutasService: RutasService, private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.rutasService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (data) => {
        this.dataSource.data = data as Ruta[];    
      });
  }

  verRuta(ruta: Ruta) {
    this.dialog.open(DialogoRutasComponent, {
      width: '80%',
      data: ruta
    });
  }

    public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  eliminar(ruta: Ruta) {
    this.rutasService.eliminar(ruta).then(() => {
      this.snackBar.open('SE ELIMINO CON ÉXITO', 'AVISO', {
        duration: 2000
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
