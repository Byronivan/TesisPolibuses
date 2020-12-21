import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Bus } from 'src/app/_model/buses';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BusesService } from 'src/app/_service/buses.service';
import { DialogoBusesComponent } from './dialogo-buses/dialogo-buses.component';

@Component({
  selector: 'app-visualizar-buses',
  templateUrl: './visualizar-buses.component.html',
  styleUrls: ['./visualizar-buses.component.scss']
})
export class VisualizarBusesComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource<Bus>()
  displayedColumns = ['numero', 'placa', 'capacidad', 'conductor','acciones'];
  
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

/*
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;*/

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    private busesService: BusesService, private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.busesService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (data) => {
      this.dataSource.data = data as Bus[];
    });

  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  eliminar(bus: Bus) {
    this.busesService.eliminar(bus).then(() => {
      this.snackBar.open('SE ELIMINO CON ÉXITO', 'AVISO', {
        duration: 2000
      });
    });
  }


  visualizarDialogo(bus: Bus) {
    this.dialog.open(DialogoBusesComponent, {
      width: '40%',
      data: bus
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
