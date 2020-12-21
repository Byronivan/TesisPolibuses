import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormulariosService } from 'src/app/_service/formularios.service';
import { Formulario } from 'src/app/_model/formularios';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Respuesta } from 'src/app/_model/respuestaForm';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';

export interface Opciones {
  value: string;
}

@Component({
  selector: 'app-respuesta-formularios',
  templateUrl: './respuesta-formularios.component.html',
  styleUrls: ['./respuesta-formularios.component.scss']
})
export class RespuestaFormulariosComponent implements OnInit, OnDestroy {

  respuesta: Opciones[] = [
    { value: 'Aprobar' },
    { value: 'Rechazar' }

  ];

  token: string;

  form: FormGroup;
  formulario: Formulario;
  id: string;
  cancel: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private formulariosService: FormulariosService,
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar) {

    let id: string = this.route.snapshot.params['id'];
    this.id = id
  }

  ngOnInit() {
    this.formulario = new Formulario();
    this.formulariosService.leer(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      this.formulario.id = data.id;
      this.formulario.nombre = data.nombre;
      this.formulario.apellido = data.apellido;
      this.formulario.email = data.email;
      this.formulario.telefono = data.telefono;
      this.formulario.descripcion = data.descripcion;
      this.formulario.tipo = data.tipo;
      this.token = data.token;
    })

    this.form = new FormGroup({
      'id': new FormControl(''),
      'estado': new FormControl(''),
      'descripcion': new FormControl('')
    });



  }

  get f() { return this.form.controls; }

  operar() {

    let formularioRes = new Respuesta();

    formularioRes.id = this.afs.createId();
    formularioRes.estado = this.form.value['estado'];
    formularioRes.descripcion = this.form.value['descripcion'];
    formularioRes.idForm = this.id;
    

    let mensaje;

    this.formulariosService.registrar(formularioRes, this.token, this.formulario.tipo ).then(us => {
      this.formulariosService.updateForm(formularioRes.idForm, formularioRes.estado)
      mensaje = 'REGISTRO CON ÉXITO';
      this.router.navigate(['/visualizarFormulario']);
      this.snackBar.open(mensaje, 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });
    })


  }

  volver() {
    this.router.navigate(['/visualizarFormulario']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
