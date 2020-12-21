import { Component, OnInit } from '@angular/core';
import { BusquedasService } from 'src/app/_sevices/busquedas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-info-bcon',
  templateUrl: './info-bcon.page.html',
  styleUrls: ['./info-bcon.page.scss'],
})
export class InfoBconPage implements OnInit {
  id: string;
  ruta: string;

  //imagenes
  urlImagenConductor: string;
  urlImagenBus: string;
  
  //bus y conductor
  bus: any;
  conductor: any;

  constructor(private busquedasService: BusquedasService, private route: ActivatedRoute,
    private router: Router, private afStorage: AngularFireStorage,
    private menuCtrl: MenuController) {
    this.id = this.route.snapshot.paramMap.get('idbus');
    this.ruta = this.route.snapshot.paramMap.get('ruta')
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
    this.obtenerInfoBus()
  }

  obtenerInfoBus() {
    this.busquedasService.buscarBusId(this.id).subscribe((data) => {
      this.bus = data;
      this.busquedasService.buscarConductorId(this.bus[0].conductor).subscribe((con) => {
        this.conductor = con
        if (this.conductor[0].id != null) {
          this.afStorage.ref(`conductores/${this.conductor[0].id}`).getDownloadURL().subscribe(data => {
            this.urlImagenConductor = data;
          });
        }

        if (this.bus[0].id != null) {
          console.log(this.bus[0].id)
          this.afStorage.ref(`buses/${this.bus[0].id}`).getDownloadURL().subscribe(data1 => {
            this.urlImagenBus = data1;
          });
        }
      })
    })
  }
}
