import { Component, OnInit } from '@angular/core';
import { BusquedasService } from 'src/app/_sevices/busquedas.service';
import { AlertController, MenuController, PopoverController } from '@ionic/angular';
import { PopinforComponent } from './popinfor/popinfor.component';
import { Storage } from '@ionic/storage';
import { IonicComponentService } from 'src/app/_sevices/ionic-component.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-respuestas-form',
  templateUrl: './respuestas-form.page.html',
  styleUrls: ['./respuestas-form.page.scss'],
})
export class RespuestasFormPage implements OnInit {
  tabla: any[] = []
  usuario: string;
  userDetail: string = ''
  userPhoto: string = ''

  viewMode: string = "set1";

  constructor(private busquedas: BusquedasService, public popover: PopoverController,
    private storage: Storage, public alertController: AlertController,
    private fireAuth: AngularFireAuth,
    private ioniccomponets: IonicComponentService,
    private menuCtrl:MenuController,
    private router: Router) {

  }

  async ngOnInit() {
    this.menuCtrl.enable(true);
    this.ioniccomponets.presentTimeoutLoading(1000,true);
    
    this.fireAuth.authState.subscribe((user) => {
      if (user) {

        this.userDetail = user.email;
        this.userPhoto = user.photoURL;

        if(this.userPhoto == null){
          this.userPhoto = 'assets/inicioBackgrounds/user.png'
        }

        this.busquedas.listarFormularios(this.userDetail).subscribe(async (forms: any) => {
          this.tabla = []

          await forms.forEach(element => {
            this.tabla.push(element)
          });
        })
      } else {
        // Empty the value when user signs out
        this.userDetail = "";
        console.log("userId=" + this.userDetail);
      }
    })


  }

  async CreatePopover(ev: any, data) {
    const pop = await this.popover.create({
      component: PopinforComponent,
      cssClass: 'pop-over-style',
      event: ev,
      translucent: false,
      componentProps: {
        form: data
      }
    });
    return await pop.present();
  }

  async presentAlert(ev: any, data) {
    let resp: any;

    this.busquedas.buscarRespuestaForm(data.id).subscribe(async (respuesta: any) => {
      resp = await respuesta[0]
      let estado = null
      let mensaje = null
      let descrip = null

      if (resp) {
        if (resp.estado.value == 'Rechazar') { estado = 'Rechazado' }
        if (resp.estado.value == 'Aprobar') { estado = 'Aprobado' }
        mensaje = `Su requerimiento a sido ${estado}`
        descrip = resp.descripcion
      } else {
        mensaje = `Su requerimiento no a sido atentido`
        descrip = 'Recibirá una respuesta en los proximos dias'
      }

      let header = `Hola ${data.nombre} ${data.apellido}`
      this.ioniccomponets.presentAlert2(descrip,header,mensaje)
    })
  }

  newForm() {
    //console.log('entro')
    this.router.navigateByUrl('/module-app/modules/formulario');
    //  this.router.navigate(['/module-app/modules/formulario']);
  }

}
