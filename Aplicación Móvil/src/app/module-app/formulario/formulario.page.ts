import { Component, OnInit } from '@angular/core';
import { FormulariosService } from 'src/app/_sevices/formularios.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Formulario } from 'src/app/model/formularios';
import { Storage } from '@ionic/storage';

import { FormGroup, Validators, FormControl } from "@angular/forms";


//import { FCM } from '@ionic-native/fcm/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/_sevices/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonicComponentService } from 'src/app/_sevices/ionic-component.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
  formulario: string;
  data: string = "";
  form: FormGroup;

  userDetail:string=''

  constructor(private formulariosService: FormulariosService,
    private afs: AngularFirestore, private storage: Storage,
    private auth: AuthenticationService, 
    private fireAuth:AngularFireAuth,
    private ioniccomponets: IonicComponentService,
    private menuCtrl: MenuController
  ) {

    this.fireAuth.authState.subscribe( user => {
      if(user) {
        console.log("USERSERVICE.....  auth = true");
        this.userDetail =  user.email;
        console.log("userId="+this.userDetail);
      } else {
        console.log("USERSERVICE.....  auth = false");
        // Empty the value when user signs out
        this.userDetail =  "";
       
        console.log("userId="+this.userDetail);
      }
    });


    this.form = new FormGroup({
      'id': new FormControl(''),
      'formulario': new FormControl('',Validators.required),
      'nombre': new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(3),
        Validators.pattern('[a-zA-Z ]*'),
        Validators.required])),
      'apellido': new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(3),
        Validators.pattern('[a-zA-Z ]*'),
        Validators.required])),
      'telefono': new FormControl('', Validators.compose([
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^[0-9]*'),
        Validators.required])),
      'descripcion': new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
    FCM.getToken().then(token => {
      this.data = token
    })

  }

  get f(){ return this.form.controls;}


  registrar() {
    if (!this.form.invalid) {
      let form = new Formulario();
      try {
        this.storage.get('email').then((res) => {
          form.id = this.afs.createId();
          form.tipo = this.form.value['formulario'];
          form.nombre = this.form.value['nombre'];
          form.apellido = this.form.value['apellido'];
          form.email = this.userDetail;
          form.telefono = this.form.value['telefono'];
          form.descripcion = this.form.value['descripcion'];
          this.formulariosService.registrar(form, this.data).then(us => {
            this.ioniccomponets.presentToast('Formulario enviado',1000)
            this.form.reset()
          })

        })
      } catch (error) {
        window.alert(error)
      }
    } else {

    }

  }


}
