import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MenuController } from '@ionic/angular';
import { BusquedasService } from 'src/app/_sevices/busquedas.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  tabla: any[] = []
  viewMode: string = "set1";

  constructor(
    private busquedas: BusquedasService, 
    private afStorage: AngularFireStorage,
    public menuCtrl: MenuController) { }

  async ngOnInit() {
    this.menuCtrl.enable(true);
    this.busquedas.listarNoticias().subscribe(async (noticias: any) => {
      this.tabla = []
      
      await noticias.forEach(element => {
        this.afStorage.ref(`notificaciones/${element.id}`).getDownloadURL().forEach(url => {
          console.log(url)
          this.tabla.push({
            datos: element,
            url: url
          })
        }).catch(err => {
          if (err.code == 'storage/object-not-found') {
            this.tabla.push({
              datos: element,
              url: null
            })
          }
        })
      })
      console.log(this.tabla)
    })
  }

  toggleSideMenu() {
    console.log("call toggleSideMenu ")
    this.menuCtrl.toggle(); //Add this method to your button click function
  }

  getFeed(){
    console.log("start getCategory");
     
  
  }

}
