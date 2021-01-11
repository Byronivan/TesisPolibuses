import { MatSnackBar } from '@angular/material';
import { RutasService } from './../../../_service/rutas.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Ruta } from './../../../_model/rutas';
import { Bus } from './../../../_model/buses';
import { BusesService } from './../../../_service/buses.service';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HorariosService } from 'src/app/_service/horarios.service';
import { Horario } from 'src/app/_model/horarios';

interface Zona {
  value: string;
}

@Component({
  selector: 'app-registrarrutas',
  templateUrl: './registrarrutas.component.html',
  styleUrls: ['./registrarrutas.component.scss']
})
export class RegistrarrutasComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject();

  form: FormGroup;
  horarios: any[] = [];
  bus: any[] = [];
  id: string;
  edicion: boolean;

  zonas: Zona[] = [
    { value: 'Norte' },
    { value: 'Sur' },
    { value: 'Valle' }
  ];

  constructor(private horarioService: HorariosService, private busesService: BusesService,
    private rutasService: RutasService,
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,) { }

  ngOnInit() {

    this.form = new FormGroup({
      'id': new FormControl(''),
      'nombre': new FormControl('', Validators.required),
      'descripcion': new FormControl('', Validators.required),
      'horarios': new FormControl('', Validators.required),
      'bus': new FormControl('', Validators.required),
      'zona': new FormControl('', Validators.required)
    });
    this.listarBuses();
    this.listarTrayectorias();


    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

  }

  initForm() {
    if (this.edicion) {
      this.rutasService.leer(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Ruta) => {

        ///c1
        this.horarioService.buscarHorarioId(data.trayectoria).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data1: any) => {
          this.busesService.buscarBusId(data.bus).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data2: any) => {
            //c2
            if (data.bus != 'Sin Bus asignado') {
              this.bus.push(
                {
                  'id': data.bus,
                  'placa': data2[0].payload.doc.data().placa
                }
              )
            }
            this.horarios.push({
              'id': data.trayectoria,
              'nombre': data1[0].payload.doc.data().nombreTrayectoria
            })

            this.form = new FormGroup({
              'id': new FormControl(data.id),
              'nombre': new FormControl(data.nombre),
              'descripcion': new FormControl(data.descripcion),
              'horarios': new FormControl(data.trayectoria),
              'bus': new FormControl(data.bus),
              'zona': new FormControl(data.zona)
            });
          })
        })


      });
    }
  }

  listarTrayectorias() {

    let horarioTotal: any[] = [];
    let horarioAsig: any[] = [];

    this.horarioService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data1 => {
      this.horarios = [];
      data1.forEach(element => {
        horarioTotal.push({
          'id': element.id,
          'nombre': element.nombreTrayectoria
        })
      });

      this.rutasService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data2 => {
        data2.forEach(element2 => {
          horarioAsig.push({
            'id': element2.trayectoria,
            'nombre': element2.trayectoria
          })
        });

        // añadimos todas las cadenas del primer array que no estén en el segundo
        var resul = horarioTotal.filter(function (el) {
          var found = false, x = 0;
          while (x < horarioAsig.length && !found) {
            if (el.id == horarioAsig[x].id) found = true;
            x++;
          }
          if (!found) return el;
        });

        /*
        //añadimos todas las cadenas del segundo array que no estén en el primero
        resul = resul.concat(horarioAsig.filter(function (el) {
          var found = false, x = 0;
          while (x < horarioTotal.length && !found) {
            if (el.id == horarioTotal[x].id) found = true;
            x++;
          }
          if (!found) return el;
        }));
*/
        resul.forEach(element => {
          this.horarios.push(element)
        })

      })
    })


  }

  listarBuses() {
    /*this.busesService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.bus = data;
      console.log(data)
    });*/
    let busTotal: any[] = [];
    let busAsig: any[] = [];
    

    this.busesService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data1 => {
      this.bus = []
      data1.forEach(element => {
        busTotal.push({
          'id': element.id,
          'placa': element.placa
        })
      });

      this.rutasService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data2 => {
        data2.forEach(element2 => {
          if (element2.bus != 'Sin Bus asignado') {
            busAsig.push({
              'id': element2.bus,
              'placa': element2.bus,
            })
          }

        });

        // añadimos todas las cadenas del primer array que no estén en el segundo
        var resul = busTotal.filter(function (el) {
          var found = false, x = 0;
          while (x < busAsig.length && !found) {
            if (el.id == busAsig[x].id) found = true;
            x++;
          }
          if (!found) return el;
        });

        /*
        //añadimos todas las cadenas del primer array que no estén en el primero
        resul = resul.concat(busAsig.filter(function (el) {
          var found = false, x = 0;
          while (x < busTotal.length && !found) {
            if (el.id == busTotal[x].id) found = true;
            x++;
          }
          if (!found) return el;
        }));*/

        resul.forEach(element => {
          this.bus.push(element)
        })
      })
    })
  }


  operar() {
    if (!this.form.invalid) {
      let ruta = new Ruta();
      if (this.edicion) {
        ruta.id = this.form.value['id'];
      } else {
        ruta.id = this.afs.createId();
      }

      ruta.nombre = this.form.value['nombre'];
      ruta.descripcion = this.form.value['descripcion'];
      ruta.trayectoria = this.form.value['horarios'];
      ruta.bus = this.form.value['bus'];
      ruta.zona = this.form.value['zona'];

      if (this.edicion) {
        this.rutasService.modificar(ruta).then(() => {
          this.router.navigate(['/moduloRutas/visualizarRutas'])
          let mensaje = 'SE MODIFICÓ CON ÉXITO!'
          this.snackBar.open(mensaje, 'AVISO', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      } else {
        console.log(ruta)
        this.rutasService.registrar(ruta).then(() => {
          
          this.router.navigate(['/moduloRutas/visualizarRutas'])
          let mensaje = 'SE REGISTRÓ CON ÉXITO!'
          this.snackBar.open(mensaje, 'AVISO', {
            duration: 4000,
            verticalPosition: 'top'
          });
        });
      }

    } else {
      let mensaje = 'FORMULARIO INCORRECTO, REVISE LOS DATOS!'
      this.snackBar.open(mensaje, 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
