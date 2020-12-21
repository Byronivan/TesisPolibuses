
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormulariosService } from 'src/app/_service/formularios.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Formulario } from 'src/app/_model/formularios';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { VerFormularioCompletoComponent } from '../../formularios/ver-formulario-completo/ver-formulario-completo.component';
import { ReportesService } from 'src/app/_service/reportes.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit, AfterViewInit, OnDestroy {

  public dataSource = new MatTableDataSource<Formulario>()
  displayedColumns = ['fecha','nombre', 'apellido', 'tipo', 'estado', 'detalle', 'acciones'];

  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  //@ViewChild(MatSort, { static: false }) sort: MatSort;


  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private formulariosService: FormulariosService, public route: ActivatedRoute,
    private dialog: MatDialog, private router: Router, private reportesService: ReportesService ) {

  }

  ngOnInit() {
    let fechas = this.route.snapshot.params;
    
    this.reportesService.buscarPorFecha(new Date(fechas['fechaInicio']),new Date(fechas['fechaFin'])).subscribe((res)=>{
      this.dataSource.data = res as Formulario[];
    })
  }

  ngAfterViewInit(): void {

  }


  verFormulario(form: any) {
    this.dialog.open(VerFormularioCompletoComponent, {
      width: '40%',
      data: form
    });
  }

  public redirectToUpdate = (ident: string) => {
    let url: string = `visualizarFormulario/edicionFormulario/${ident}`;
    this.router.navigate([url]);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  
}
