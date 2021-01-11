
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConductoresService } from 'src/app/_service/conductores.service';
import { Conductor } from 'src/app/_model/conductores';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil, concatAll, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';



@Component({
  selector: 'app-registrar-conductor',
  templateUrl: './registrar-conductor.component.html',
  styleUrls: ['./registrar-conductor.component.scss']
})
export class RegistrarConductorComponent implements OnInit, OnDestroy {
  ci: string;
  cambio: boolean = false;

  id: string;
  form: FormGroup;
  edicion: boolean;
  seleccionado: boolean;
  dato: number;
  n: any;

  file: any;
  labelFile: string;
  urlImagen: string;

  public imagePath;
  imgURL: any;
  public message: string;
  mensaje: string = '';



  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private conductoresService: ConductoresService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      'id': new FormControl(''),
      'nombre': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
      'apellido': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'celular': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
      'cedula': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)])
    });

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    });

  }

  onChange(newValue) {
    if (typeof newValue === "undefined") {
    } else {
      console.log(newValue);
      this.ci = newValue;
      this.cambio = true;
    }

  }

  get f() { return this.form.controls; }

  initForm() {
    if (this.edicion) {
      this.conductoresService.leer(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Conductor) => {
        this.form = new FormGroup({
          'id': new FormControl(data.id),
          'nombre': new FormControl(data.nombre),
          'apellido': new FormControl(data.apellido),
          'email': new FormControl(data.email),
          'celular': new FormControl(data.celular,[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
          'cedula': new FormControl(data.cedula,[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)])
        });

        if (data.id != null) {
          this.seleccionado = false;
          this.afStorage.ref(`conductores/${data.id}`).getDownloadURL().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
            this.urlImagen = data;
          });
        }

      });
    }

  }

  operar() {

    if (!this.form.invalid) {
      let conductor = new Conductor();
      if (this.edicion) {
        conductor.id = this.form.value['id'];
      } else {
        conductor.id = this.afs.createId();
      }
      conductor.nombre = this.form.value['nombre'];
      conductor.apellido = this.form.value['apellido'];
      conductor.email = this.form.value['email'];
      conductor.celular = this.form.value['celular'];
      conductor.cedula = this.form.value['cedula'];

      if (this.file != null) {
        let ref = this.afStorage.ref(`conductores/${conductor.id}`);
        ref.put(this.file);
      }

      this.conductoresService.buscarConductor(conductor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {

        if (this.edicion) {
          if (this.cambio == true) {
            if (val.size == 0) {
              this.conductoresService.modificar(conductor);
              this.mensaje = 'SE MODIFICO CON EXITO'
              this.router.navigate(['/moduloRutas/visualizarConductores'])
            } else {
              this.mensaje = 'EL CONDUCTOR YA EXISTE'
            }
            this.snackBar.open(this.mensaje, 'AVISO', {
              duration: 4000,
              verticalPosition: 'top'
            });

          } else {
            this.conductoresService.modificar(conductor);
            this.mensaje = 'SE MODIFICO CON EXITO'
            this.snackBar.open(this.mensaje, 'AVISO', {
              duration: 4000,
              verticalPosition: 'top'
            });
            this.router.navigate(['/moduloRutas/visualizarConductores'])
          }

        } else {
          if (this.imgURL == null) {
            this.mensaje = 'DEBE SELECCIONAR UNA IMAGEN'
            this.snackBar.open(this.mensaje, 'AVISO', {
              duration: 4000,
              verticalPosition: 'top'
            });
          } else {
            if (val.size == 0) {
              this.conductoresService.registrar(conductor);
              this.mensaje = 'SE REGISTRO CON EXITO'
              this.router.navigate(['/moduloRutas/visualizarConductores'])
            } else {
              this.mensaje = 'EL CONDUCTOR YA EXISTE'

            }
            this.snackBar.open(this.mensaje, 'AVISO', {
              duration: 4000,
              verticalPosition: 'top'
            });
          }
        }
      })
    }
  }

  limpiarForm() {
    this.form = new FormGroup({
      'id': new FormControl(''),
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'celular': new FormControl('', Validators.required),
      'cedula': new FormControl('', Validators.required)
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



