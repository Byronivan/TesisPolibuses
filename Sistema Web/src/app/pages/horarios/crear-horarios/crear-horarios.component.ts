import { Horario } from './../../../_model/horarios';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HorariosService } from './../../../_service/horarios.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TrayectoriasService } from './../../../_service/trayectorias.service';
import { Trayectoria } from './../../../_model/trayectorias';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatButtonToggleGroup } from '@angular/material';
import * as moment from 'moment';

import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-crear-horarios',
  templateUrl: './crear-horarios.component.html',
  styleUrls: ['./crear-horarios.component.scss']
})
export class CrearHorariosComponent implements OnInit, OnDestroy {

  public dataSource = new MatTableDataSource<any>()
  displayedColumns: string[] = ['id', 'nombre', 'horarioM', 'horarioN'];

  private ngUnsubscribe: Subject<void> = new Subject();

  id: string;
  trayectoria: string;

  mostrar: boolean = false;


  //Combo box con trayectorias disponibles
  trayectorias: Trayectoria[] = [];

  form: FormGroup;
  cambioC: boolean = false;

  //corregir
  edicion: boolean;
  seleccionado: boolean;
  mensaje: string;

  paradas: any = [];
  //trayectorias asignadas
  horariosp: any[] = [];

  origen: string;
  destino: string;


  public horarioM: any = [];
  public horarioN: any = [];

  array: any[] = [];

  constructor(private trayectoriasService: TrayectoriasService, private afs: AngularFirestore,
    private horariosService: HorariosService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) { }

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
    //modificar
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

    this.listarTrayectorias();
  }

  initForm() {
    if (this.edicion) {
      this.horariosService.leer(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Horario) => {
        this.seleccionado = true;
        let origen = data.horarioO;
        let destino = data.horarioD;
        this.form = new FormGroup({
          'id': new FormControl(data.id),
          'trayectoria': new FormControl(data.idTrayectoria),
          'origen': new FormControl(origen['nombre']),
          'horaOM': new FormControl(origen['horaOM']),
          'horaON': new FormControl(origen['horaON']),
          'destino': new FormControl(destino['nombre']),
          'horaDM': new FormControl(destino['horaDM']),
          'horaDN': new FormControl(destino['horaDN']),
          'numParadas': new FormControl(''),
          'nomParadas': new FormControl(''),
          'horarioM': new FormControl(''),
          'horarioN': new FormControl('')
        });

        for (let i = 0; i < data.horarioP.length; i++) {
          this.paradas.push({
            'parada': data.horarioP[i]['id'],
            'nombre': data.horarioP[i]['nombre']
          });
        }
      })
    }
  }

  onChangeC(newValue) {
    if (typeof newValue.id === undefined) {
    } else {

      console.log('entro')
      this.trayectoriasService.buscarTrayectoriaId(newValue.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result) => {
        if (result.length == 0) console.log("no encontro resultados");
        else {
          result.forEach((data: any) => {
            this.origen = data.payload.doc.data().origen.nombre;
            this.destino = data.payload.doc.data().destino.nombre;

            this.dataSource.data = data.payload.doc.data().paradas as any

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
    let trayecTotal: any[] = [];
    let trayectAsig: any[] = [];

    this.trayectoriasService.listarTrayec().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data1 => {
      data1.forEach(element => {
        trayecTotal.push({
          'id': element.id,
          'nombre': element.nombre
        })
      });

      this.horariosService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data2 => {
        data2.forEach(element2 => {
          trayectAsig.push({
            'id': element2.idTrayectoria,
            'nombre': element2.idTrayectoria
          })
        });

        // añadimos todas las cadenas del primer array que no estén en el segundo
        var resul = trayecTotal.filter(function (el) {
          var found = false, x = 0;
          while (x < trayectAsig.length && !found) {
            if (el.id == trayectAsig[x].id) found = true;
            x++;
          }
          if (!found) return el;
        });

        //añadimos todas las cadenas del primer array que no estén en el primero
        resul = resul.concat(trayectAsig.filter(function (el) {
          var found = false, x = 0;
          while (x < trayecTotal.length && !found) {
            if (el.id == trayecTotal[x].id) found = true;
            x++;
          }
          if (!found) return el;
        }));

        this.trayectorias = resul;
      })
    })
  }

  comprobar() {

    let horaMO = moment(this.form.value['horaOM'], 'hh:mm');
    let horaMD = moment(this.form.value['horaDM'], 'hh:mm');
    let horaNO = moment(this.form.value['horaON'], 'hh:mm');
    let horaND = moment(this.form.value['horaDN'], 'hh:mm');

    console.log(horaMD)

    if(horaMO.isValid() == false||horaMD.isValid() == false||horaNO.isValid() == false||horaND.isValid() == false){
      this.mensaje = 'Por favor ingrese los campos correctamente!'
        this.snackBar.open(this.mensaje, 'AVISO', {
          duration: 4000,
          verticalPosition: 'top'
        });
    }else{
      if (horaMO.isAfter(horaMD) == true || horaMO.isSame(horaMD) == true) {
        this.mensaje = 'La hora de origen de la MAÑANA debe ser menor y diferente que la hora destino'
        this.snackBar.open(this.mensaje, 'AVISO', {
          duration: 4000,
          verticalPosition: 'top'
        });
      } else if (horaND.isAfter(horaNO) == true || horaNO.isSame(horaND) == true) {
        this.mensaje = 'La hora de origen de la NOCHE debe ser menor y diferente que la hora destino'
        this.snackBar.open(this.mensaje, 'AVISO', {
          duration: 4000,
          verticalPosition: 'top'
        });
      } else if (horaMO.isAfter(horaMD) == false && horaMO.isSame(horaMD) == false && horaND.isAfter(horaNO) == false && horaNO.isSame(horaND) == false) {
        this.mensaje = 'Por favor, ingrese los horarios de las paradas'
        this.snackBar.open(this.mensaje, 'AVISO', {
          duration: 4000,
          verticalPosition: 'top'
        });
        this.mostrar =true;
      } 
    }

    

  }



  operar() {

    for (let i = 0; i < this.array.length; i++) {
      this.array[i]['horarioM'] = this.horarioM[i];
      this.array[i]['horarioN'] = this.horarioN[i];
    }

    if (!this.form.invalid) {

      let horaMO = moment(this.form.value['horaOM'], 'hh:mm');
      let horaMD = moment(this.form.value['horaDM'], 'hh:mm');
      let horaNO = moment(this.form.value['horaON'], 'hh:mm');
      let horaND = moment(this.form.value['horaDN'], 'hh:mm');


      if (horaMO.isAfter(horaMD) == true || horaMO.isSame(horaMD) == true) {
        this.mensaje = 'La hora de origen de la MAÑANA debe ser menor y diferente que la hora destino'
        this.snackBar.open(this.mensaje, 'AVISO', {
          duration: 4000,
          verticalPosition: 'top'
        });
      } else if (horaND.isAfter(horaNO) == true || horaNO.isSame(horaND) == true) {
        this.mensaje = 'La hora de origen de la NOCHE debe ser menor y diferente que la hora destino'
        this.snackBar.open(this.mensaje, 'AVISO', {
          duration: 4000,
          verticalPosition: 'top'
        });
      } else {
        console.log('si registra')
        let horario = new Horario();

        if (this.edicion) {
          horario.id = this.form.value['id'];
        } else {
          horario.id = this.afs.createId();
        }

        let origen: any[] = [];
        let destino: any[] = [];


        console.log(typeof (this.form.value['horaOM']))
        console.log('Entro horarios')

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

        let trayect = this.form.value['trayectoria']

        horario.idTrayectoria = trayect.id;
        horario.nombreTrayectoria = trayect.nombre;
        horario.horarioO = origen[0];
        horario.horarioD = destino[0];
        horario.horarioP = this.array;

        this.horariosService.registrar(horario).then(() => {
          this.mensaje = 'HORARIO REGISTRADO'
          this.snackBar.open(this.mensaje, 'AVISO', {
            duration: 4000,
            verticalPosition: 'top'
          });
          this.router.navigate(['/moduloRutas/visualizarHorarios'])
        }).catch(err => console.log(err)
        )
      }


    }else{
      this.mensaje = 'POR FAVOR, VERIFIQUE QUE TODOS LOS CAMPOS ESTEN LLENOS'
      this.snackBar.open(this.mensaje, 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
    }
  }

  editando() {
    return this.seleccionado != true;
  }

  isSticky(id: string) {
    return ("header-1" || []).indexOf(id) !== -1;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
