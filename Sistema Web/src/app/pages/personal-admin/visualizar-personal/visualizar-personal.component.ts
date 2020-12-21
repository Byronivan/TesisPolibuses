import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Usuario } from 'src/app/_model/usuarios';
import { Subject } from 'rxjs';
import { RegistroPerAdmService } from 'src/app/_service/registro-per-adm.service';
import { ActivatedRoute } from '@angular/router';
import { DialogoPersonalComponent } from './dialogo-personal/dialogo-personal.component';

@Component({
  selector: 'app-visualizar-personal',
  templateUrl: './visualizar-personal.component.html',
  styleUrls: ['./visualizar-personal.component.scss']
})
export class VisualizarPersonalComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource<Usuario>()
  displayedColumns = ['nombre', 'apellido', 'email', 'acciones'];

  /*
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  */

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private registroperService: RegistroPerAdmService, private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    private dialog: MatDialog) { }


  ngOnInit() {
    this.registroperService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (data) => {
        this.dataSource.data = data as Usuario[];
      });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  eliminar(usuario: Usuario) {
    this.registroperService.eliminar(usuario).then(() => {
      this.snackBar.open('SE ELIMINO CON ÉXITO', 'AVISO', {
        duration: 2000
      });
    });
  }


  visualizarDialogo(usuario: Usuario) {
    this.dialog.open(DialogoPersonalComponent, {
      width: "40%",
      data: usuario
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
