import { HorariosService } from './../../_service/horarios.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Horario } from './../../_model/horarios';
import { Trayectoria } from './../../_model/trayectorias';
import { TrayectoriasService } from './../../_service/trayectorias.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-prueba-horarios',
  templateUrl: './prueba-horarios.component.html',
  styleUrls: ['./prueba-horarios.component.scss']
})
export class PruebaHorariosComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject();

  dataSource: MatTableDataSource<Trayectoria>;
  displayedColumns: string[] = ['id', 'nombre', 'horarioM', 'horarioN'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  trayectoria: string;
  trayectorias: Trayectoria[] = [];
  form: FormGroup;
  cambioC: boolean = false;
  edicion: boolean;
  mensaje: string;

  origen: string;
  destino: string;


  public horarioM: any = [];
  public horarioN: any = [];

  array: any[] = [];


  constructor(private trayectoriasService: TrayectoriasService, private snackBar: MatSnackBar,
    private horariosService: HorariosService,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore, ) { }



  ngOnInit() {

    this.form = new FormGroup({
      'id': new FormControl(''),
      'trayectoria': new FormControl('', Validators.required),
      'origen': new FormControl(''),
      'horaOM': new FormControl('', Validators.required),
      'horaON': new FormControl('', Validators.required),
      'destino': new FormControl(''),
      'horaDM': new FormControl('', Validators.required),
      'horaDN': new FormControl('', Validators.required),
      'numParadas': new FormControl(''),
      'nomParadas': new FormControl(''),
      'horarioM': new FormControl('', Validators.required),
      'horarioN': new FormControl('', Validators.required)
    });

    this.listarTrayectorias();

  }

  onChangeC(newValue) {
    if (typeof newValue === "undefined") {
      console.log('ok');
    } else {
      this.trayectoriasService.buscarTrayectoriaId(newValue).subscribe((result) => {
        if (result.length == 0) console.log("no encontro resultados");
        else {
          result.forEach((data: any) => {
            this.origen = data.payload.doc.data().origen.nombre;
            this.destino = data.payload.doc.data().destino.nombre;
            this.dataSource = new MatTableDataSource(data.payload.doc.data().paradas);

            for (let i = 0; i < data.payload.doc.data().paradas.length; i++) {
              this.array.push({
                nombre: data.payload.doc.data().paradas[i]["nombre"],
                id: data.payload.doc.data().paradas[i]["parada"],
                horarioM: null,
                horarioN: null
              });
            }
          });
        }
      });
      this.cambioC = true;
    }

  }

  listarTrayectorias() {
    this.trayectoriasService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.trayectorias = data;
    });
  }

  operar() {

    for (let i = 0; i < this.array.length; i++) {
      this.array[i]['horarioM'] = this.horarioM[i];
      this.array[i]['horarioN'] = this.horarioN[i];
    }

    if (!this.form.invalid) {
      let horario = new Horario();

      let origen: any[] = [];
      let destino: any[] = [];

      origen.push({
        'nombre': this.form.value['origen'],
        'horaOM': this.form.value['horaOM'],
        'horaON': this.form.value['horaON']
      });

      destino.push({
        'nombre': this.form.value['destino'],
        'horaDM': this.form.value['horaDM'],
        'horaDN': this.form.value['horaDN']
      });

      horario.id = this.afs.createId();
      horario.idTrayectoria = this.form.value['trayectoria'];
      horario.horarioO = origen[0];
      horario.horarioD = destino[0];
      horario.horarioP = this.array;
      console.log(this.array)
      this.horariosService.registrar(horario).then(() => {
        console.log("registrado")
        this.router.navigate(['/visualizarTrayectoria'])
      }).catch(err => console.log(err))
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
