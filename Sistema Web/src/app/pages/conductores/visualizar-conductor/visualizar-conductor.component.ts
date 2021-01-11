import { DialogoConductorComponent } from './dialogo-conductor/dialogo-conductor.component';
import { Subject } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Conductor } from 'src/app/_model/conductores';
import { ConductoresService } from 'src/app/_service/conductores.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-visualizar-conductor',
  templateUrl: './visualizar-conductor.component.html',
  styleUrls: ['./visualizar-conductor.component.scss']
})
export class VisualizarConductorComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource<Conductor>()
  displayedColumns = ['nombre', 'apellido', 'email', 'acciones'];

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

  constructor(private conductoresService: ConductoresService, private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.conductoresService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (data) => {
        this.dataSource.data = data as Conductor[];
      });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  eliminar(conductor: Conductor) {
    this.conductoresService.eliminar(conductor).then(() => {
      this.snackBar.open('SE ELIMINO CON ÉXITO', 'AVISO', {
        duration: 2000
      });
    });
  }


  visualizarDialogo(conductor: Conductor) {
    this.dialog.open(DialogoConductorComponent, {
      width: "45%",
      data: conductor
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
