import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Notificacion } from 'src/app/_model/notificaciones';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificacionesService } from 'src/app/_service/notificaciones.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-enviar-notificacion',
  templateUrl: './enviar-notificacion.component.html',
  styleUrls: ['./enviar-notificacion.component.scss']
})
export class EnviarNotificacionComponent implements OnInit {

  form: FormGroup;

  seleccionado: boolean;
  file: any;
  labelFile: string;
  urlImagen: string;

  public imagePath;
  imgURL: any;
  public message: string;

  constructor(private afs: AngularFirestore, private notificacionesService: NotificacionesService,
    private snackBar: MatSnackBar,private router: Router,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage) { }

  ngOnInit() {

    this.form = new FormGroup({
      'id': new FormControl(''),
      'asunto': new FormControl('',Validators.required),
      'fecha': new FormControl('',Validators.required),
      'descripcion': new FormControl('',Validators.required)
    });
  }

  get f() { return this.form.controls; }

  operar() {
    if(!this.form.invalid){
      let notificacion = new Notificacion(); 
    
      notificacion.asunto = this.form.value['asunto'];
      notificacion.fecha= this.form.value['fecha'];
      notificacion.descripcion= this.form.value['descripcion'];
      
      notificacion.id = this.afs.createId();

      if (this.file != null) {
        let ref = this.afStorage.ref(`notificaciones/${notificacion.id}`);
        ref.put(this.file);
      }


      this.notificacionesService.registrar(notificacion).then(()=>{
        this.snackBar.open('SE ENVIÓ NOTIFICACIÓN', 'AVISO', {
          duration: 2000
        }); 
        this.router.navigate(['/visualizarNotificacion']);
      });  
    }
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
  


}
