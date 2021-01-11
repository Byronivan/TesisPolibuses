import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { RegistroPerAdmService } from 'src/app/_service/registro-per-adm.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/_model/usuarios';
import { RolesService } from 'src/app/_service/roles.service';
import { AngularFireStorage } from '@angular/fire/storage';


interface Rol {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-registro-per-adm',
  templateUrl: './registro-per-adm.component.html',
  styleUrls: ['./registro-per-adm.component.scss']
})
export class RegistroPerAdmComponent implements OnInit, OnDestroy {

  form: FormGroup;
  uid: string;
  edicion: boolean;
  seleccionado: boolean;

  usuario: string;
  clave: string;

  roles: Rol[] = [
    { value: 'USER', viewValue: 'USER' },
  ];


  file: any;
  labelFile: string;
  urlImagen: string;

  public imagePath;
  imgURL: any;
  public message: string;
  mensaje: string = '';

  editarCorreo: boolean = false;


  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private registroAdminService: RegistroPerAdmService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage) { }

  ngOnInit() {
    this.editarCorreo = false;
    this.form = new FormGroup({
      'uid': new FormControl(''),
      'nombre': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
      'apellido': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'celular': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
      'cedula': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
      'clave': new FormControl('', Validators.required),
      'rol': new FormControl('', Validators.required)
    });

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params: Params) => {
      this.uid = params['uid'];
      this.edicion = this.uid != null;
      this.initForm();
    });
  }

  get f() { return this.form.controls; }

  initForm() {

    if (this.edicion) {
      this.editarCorreo = true;
      this.registroAdminService.leer(this.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: Usuario) => {
        this.form = new FormGroup({
          'uid': new FormControl(data.uid),
          'nombre': new FormControl(data.nombre),
          'apellido': new FormControl(data.apellido),
          'email': new FormControl(data.email),
          'celular': new FormControl(data.celular,[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
          'cedula': new FormControl(data.cedula,[Validators.required, Validators.pattern('^[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]),
          'clave': new FormControl(data.clave, Validators.required),
          'rol': new FormControl(data.rol[0])

        });
        if (data.uid != null) {
          this.seleccionado = false;
          this.afStorage.ref(`usuarios/${data.uid}`).getDownloadURL().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
            this.urlImagen = data;
          }, (error)=>{
            console.log("El usuario no tiene foto")
          });
        }

      });
    }

  }

  operar() {
    let roles: any[] = [];

    if (!this.form.invalid) {
      let usuario = new Usuario();

      if (this.edicion) {
        usuario.uid = this.form.value['uid'];
      }

      roles.push(this.form.value['rol'])
      usuario.nombre = this.form.value['nombre'];
      usuario.apellido = this.form.value['apellido'];
      usuario.email = this.form.value['email'];
      usuario.celular = this.form.value['celular'];
      usuario.cedula = this.form.value['cedula'];
      usuario.rol = roles
      
      this.form.value['rol'];
      usuario.clave = this.form.value['clave'];

      let mensaje;

      if (this.edicion) {
        //cargar foto al editar
        if (this.file != null) {
          let ref = this.afStorage.ref(`usuarios/${usuario.uid}`);
          ref.put(this.file);
        }

        this.registroAdminService.modificar(usuario);
        mensaje = 'SE MODIFICO CON ÉXITO'
        this.router.navigate(['/visualizarPersonal']);
        this.snackBar.open(mensaje, 'AVISO', {
          duration: 4000,
          verticalPosition: 'top'
        });
      } else {

        this.registroAdminService.registrarUsuario(this.usuario, this.clave).then(us => {
          //cargar foto nueva
          if (this.file != null) {
            let ref = this.afStorage.ref(`usuarios/${us.user.uid}`);
            ref.put(this.file);
          }
          

          usuario.uid = us.user.uid;
          this.registroAdminService.registrar(usuario);
          mensaje = 'REGISTRO CON ÉXITO';
          this.router.navigate(['/visualizarPersonal']);
          this.snackBar.open(mensaje, 'AVISO', {
            duration: 4000,
            verticalPosition: 'top'
          });

        }).catch(error => {
          this.snackBar.open(ErroAuthEn.convertMessage(error['code']), 'AVISO', {
            duration: 4000,
            verticalPosition: 'top'
          });
        })

      }

    }
  }

  editando() {
    return this.seleccionado != true;
  }

  editandoF() {
    return this.edicion != true;
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}

export namespace ErroAuthEn {
  export function convertMessage(code: string): string {
    console.log('called');
    switch (code) {
      case 'auth/email-already-in-use': {
        return 'El email ingresado ya esta siendo utilizado por otro usuario.';
      }

      case "storage/object-not-found": {
        return 'El usuario no tiene foto'
      }

      case 'auth/weak-password': {
        return 'La contraseña debe contener al menos 6 caracteres.';

      }
      default: {
        return 'Error al registrar al usuario'
      }
    }
  }
}