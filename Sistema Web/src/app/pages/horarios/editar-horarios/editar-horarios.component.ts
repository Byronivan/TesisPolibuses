import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HorariosService } from 'src/app/_service/horarios.service';
import { Horario } from 'src/app/_model/horarios';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-editar-horarios',
  templateUrl: './editar-horarios.component.html',
  styleUrls: ['./editar-horarios.component.scss']
})
export class EditarHorariosComponent implements OnInit, OnDestroy, AfterContentChecked {

  form: FormGroup;
  trayectoriaName: string;

  id: string;
  edicion: boolean = true;
  seleccionado: boolean;

  //Tabla
  public dataSource = new MatTableDataSource<any>()
  displayedColumns: string[] = ['id', 'nombre', 'horaM', 'horaN'];

  mensaje: string;

  horarioM: any[]= [];
  horarioN: any[] = [];
  array: any[] = [];
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute, private horarioService: HorariosService, private cdref: ChangeDetectorRef,
    private router : Router,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {

    this.form = new FormGroup({
      'id': new FormControl(''),
      'idTrayectoria': new FormControl(''),
      'origen': new FormControl(''),
      'horaOM': new FormControl('', Validators.required),
      'horaON': new FormControl('', Validators.required),
      'destino': new FormControl(''),
      'horaDM': new FormControl('', Validators.required),
      'horaDN': new FormControl('', Validators.required),
      'numParadas': new FormControl(''),
      'nomParadas': new FormControl(''),
      'horarioM': new FormControl(''),
      'horarioN': new FormControl('')
    });

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      this.id = params['id']
      this.init();
    });

  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  init() {
    if (this.edicion) {
      this.horarioService.leer(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Horario) => {
        this.trayectoriaName = data.nombreTrayectoria;
        this.form = new FormGroup({
          'id': new FormControl(data.id),
          'idTrayectoria': new FormControl(data.idTrayectoria),
          'origen': new FormControl(data.horarioO['nombre']),
          'horaOM': new FormControl(data.horarioO['horaOM']),
          'horaON': new FormControl(data.horarioO['horaON']),
          'destino': new FormControl(data.horarioD['nombre']),
          'horaDM': new FormControl(data.horarioD['horaDM']),
          'horaDN': new FormControl(data.horarioD['horaDN']),
          'numParadas': new FormControl(''),
          'nomParadas': new FormControl(''),
          'horarioM': new FormControl(''),
          'horarioN': new FormControl('')
        });

        let paradas: any = data.horarioP

        for(let i=0; i<paradas.length; i++){
          this.horarioM.push(paradas[i].horarioM)
          this.horarioN.push(paradas[i].horarioN)
        }


        for (let i = 0; i < paradas.length; i++) {
        
          this.array.push({
            id: paradas[i].id,
            nombre: paradas[i].nombre,
            horarioM: paradas[i].horarioM,
            horarioN: paradas[i].horarioN
          });
        }

        this.dataSource.data = this.array as any[];


      }


      )
    }
  }
  
  operar(){ 
    
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
      let horario= new Horario();

    for (let i = 0; i < this.array.length; i++) {
      this.array[i]['horarioM'] = this.horarioM[i];
      this.array[i]['horarioN'] = this.horarioN[i];
    }

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

      
      horario.id = this.form.value['id']
      horario.idTrayectoria = this.form.value['idTrayectoria']
      horario.nombreTrayectoria = this.trayectoriaName
      horario.horarioO = origen[0]
      horario.horarioD = destino[0]
      horario.horarioP = this.array

      this.horarioService.modificar(horario);
      this.mensaje = 'HORARIO MODIFICADO'
      this.snackBar.open(this.mensaje, 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
      this.router.navigate(['/moduloRutas/visualizarHorarios'])
    }
  }
    
      
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }

}
