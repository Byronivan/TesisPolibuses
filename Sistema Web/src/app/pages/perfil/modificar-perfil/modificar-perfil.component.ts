import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { PerfilService } from 'src/app/_service/perfil.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Usuario } from 'src/app/_model/usuarios';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.scss']
})
export class ModificarPerfilComponent implements OnInit,OnDestroy {

  form: FormGroup;
  uid: string;
  edicion: boolean;
  seleccionado: boolean;


  mensaje: string = '';

  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private perfilService: PerfilService, private afStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute, private loginService:LoginService) { }

  ngOnInit() {
    this.form = new FormGroup({
      'uid': new FormControl(''),
      'nombre': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
      'apellido': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
      'celular': new FormControl('',[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
      'cedula': new FormControl('',[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)])
    });

    this.edicion = true;
    this.initForm();


  }

  get f() { return this.form.controls; }

  initForm() {
    if (this.edicion) {
      this.perfilService.nameDocument().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
        let nombre, apellido, celular, cedula

        data.docs.forEach((element: any) => {
          this.uid = element.id
          nombre = element.data().nombre
          apellido = element.data().apellido
          celular = element.data().celular
          cedula = element.data().cedula
        });

        this.form = new FormGroup({
          'uid': new FormControl(this.uid),
          'nombre': new FormControl(nombre),
          'apellido': new FormControl(apellido),
          'celular': new FormControl(celular,[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
          'cedula': new FormControl(cedula,[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)])
        });
      });
    }
  }

  operar() {
    
    let usuario: any = {
      'nombre': '',
      'apellido': '',
      'celular': '',
      'cedula': ''
    }

    if (!this.form.invalid) {
      usuario.uid = this.uid,
        usuario.nombre = this.form.value['nombre'];
      usuario.apellido = this.form.value['apellido'];
      usuario.celular = this.form.value['celular'];
      usuario.cedula = this.form.value['cedula'];
      this.perfilService.updateUser(usuario).then(() => {
        this.router.navigate(['/perfil'])
      })

    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
