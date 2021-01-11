import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConductoresService } from 'src/app/_service/conductores.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { BusesService } from 'src/app/_service/buses.service';
import { Bus } from 'src/app/_model/buses';
import { Conductor } from 'src/app/_model/conductores';
import { element } from 'protractor';

@Component({
  selector: 'app-registrar-buses',
  templateUrl: './registrar-buses.component.html',
  styleUrls: ['./registrar-buses.component.scss']
})
export class RegistrarBusesComponent implements OnInit, OnDestroy {


  id: string;
  form: FormGroup;
  edicion: boolean;
  seleccionado: boolean;
  mensaje: string;

  placa: string;
  cambio: boolean = false;


  conductor: string;
  cambioC: boolean = false;

  file: any;
  labelFile: string;
  urlImagen: string;

  public imagePath;
  imgURL: any;
  public message: string;

  conductores: any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private conductoresService: ConductoresService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private busesService: BusesService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id': new FormControl(''),
      'numero': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*')]),
      'capacidad': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*')]),
      'placa': new FormControl('', Validators.required),
      'conductor': new FormControl('', Validators.required),
    });

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

    this.listarConductores();
  }

  get f() { return this.form.controls; }

  initForm() {
    if (this.edicion) {
      this.busesService.leer(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Bus) => {
        this.conductoresService.buscarConductorId(data.conductor).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data1: any) => {

          if (data.conductor != 'Sin Conductor asignado') {
            this.conductores.push(
              {
                'id': data.conductor,
                'nombre': data1[0].payload.doc.data().nombre,
                'apellido': data1[0].payload.doc.data().apellido
              }
            )
          }


          this.conductor = data.conductor
          this.form = new FormGroup({
            'id': new FormControl(data.id),
            'numero': new FormControl(data.numero,[Validators.required, Validators.pattern('^[0-9]*')]),
            'placa': new FormControl(data.placa),
            'capacidad': new FormControl(data.capacidad,[Validators.required, Validators.pattern('^[0-9]*')]),
            'conductor': new FormControl(this.conductores)
          });

        })


        if (data.id != null) {
          this.seleccionado = false;
          this.afStorage.ref(`buses/${data.id}`).getDownloadURL().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
            this.urlImagen = data;
          });
        }

      });
    }
  }

  onChange(newValue) {
    if (typeof newValue === "undefined") {
    } else {
      this.placa = newValue;
      this.cambio = true;
    }
  }

  /*listarConductores() {
    this.conductoresService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.conductores = data;
    });
  }*/


  operar() {
    if (!this.form.invalid) {
      let bus = new Bus();

      if (this.edicion) {
        bus.id = this.form.value['id'];
      } else {
        bus.id = this.afs.createId();
      }

      bus.numero = this.form.value['numero'];
      bus.capacidad = this.form.value['capacidad'];
      bus.placa = this.form.value['placa'];
      bus.conductor = this.form.value['conductor']

      //crear carpeta o referenciar si existe 
      if (this.file != null) {
        let ref = this.afStorage.ref(`buses/${bus.id}`);
        ref.put(this.file);
      }

      this.busesService.buscarBus(bus).pipe(takeUntil(this.ngUnsubscribe)).subscribe((resul) => {
        if (this.edicion) {
          if (this.cambio == true) {
            if (resul.size == 0) {
              this.busesService.modificar(bus);
              this.mensaje = 'SE MODIFICO CON EXITO'
              this.snackBar.open(this.mensaje, 'AVISO', {
                duration: 4000,
                verticalPosition: 'top'
              });
              this.router.navigate(['/moduloRutas/visualizarBuses'])
            } else {
              this.mensaje = 'NÚMERO DE PLACA DUPLICADO O YA ESTÁ ASIGNADA EN ESTE BUS!'
            }

            this.snackBar.open(this.mensaje, 'AVISO', {
              duration: 4000,
              verticalPosition: 'top'
            });

          } else {
            this.busesService.modificar(bus);
            this.mensaje = 'SE MODIFICO CON EXITO'
            this.snackBar.open(this.mensaje, 'AVISO', {
              duration: 4000,
              verticalPosition: 'top'
            });
            this.router.navigate(['/moduloRutas/visualizarBuses'])
          }
        } else {
          //NUEVO BUS
          if (this.imgURL == null) {
            this.mensaje = 'DEBE SELECCIONAR UNA IMAGEN'
            this.snackBar.open(this.mensaje, 'AVISO', {
              duration: 4000,
              verticalPosition: 'top'
            });
          } else {
            if (resul.size == 0) {
              this.busesService.registrar(bus);
              this.mensaje = 'SE REGISTRO CON EXITO'
              this.router.navigate(['/moduloRutas/visualizarBuses'])
            } else {
              this.mensaje = 'NÚMERO DE PLACA DUPLICADO'
              this.snackBar.open(this.mensaje, 'AVISO', {
                duration: 4000,
                verticalPosition: 'top'
              });
            }
          }
        }
      })
    }
  }

  listarConductores() {
    let conducTotal: any[] = [];
    let conductAsig: any[] = [];
    this.conductoresService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data1 => {
      data1.forEach(element => {
        conducTotal.push({
          'id': element.id,
          'nombre': element.nombre,
          'apellido': element.apellido
        })
      });

      this.busesService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data2 => {
        data2.forEach(element2 => {
          if (element2.conductor != 'Sin Conductor asignado') {
            conductAsig.push({
              'id': element2.conductor,
              'nombre': element2.conductor,
              'apellido': element2.conductor
            })
          }
        });

        // añadimos todas las cadenas del primer array que no estén en el segundo
        var resul = conducTotal.filter(function (el) {
          var found = false, x = 0;
          while (x < conductAsig.length && !found) {
            if (el.id == conductAsig[x].id) found = true;
            x++;
          }
          if (!found) return el;
        });

        //añadimos todas las cadenas del primer array que no estén en el primero
        resul = resul.concat(conductAsig.filter(function (el) {
          var found = false, x = 0;
          while (x < conducTotal.length && !found) {
            if (el.id == conducTotal[x].id) found = true;
            x++;
          }
          if (!found) return el;
        }));

        resul.forEach(element => {
          this.conductores.push(element)
        })
      })
    })
  }

  limpiarForm() {
    this.form = new FormGroup({
      'id': new FormControl(''),
      'numero': new FormControl('', Validators.required),
      'capacidad': new FormControl('', Validators.required),
      'placa': new FormControl('', Validators.required),
      'conductor': new FormControl('', Validators.required),
    });
  }

  seleccionar(files, e: any) {
    this.seleccionado = true;
    this.file = e.target.files[0];
    this.labelFile = e.target.files[0].name;

    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  editando() {
    return this.seleccionado != true;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }

}
