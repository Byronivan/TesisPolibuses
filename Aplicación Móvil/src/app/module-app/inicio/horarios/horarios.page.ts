import { Component, OnInit } from '@angular/core';
import { RutasService } from 'src/app/_sevices/rutas.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { TrayectoriasService } from 'src/app/_sevices/trayectorias.service';
import { BusquedasService } from 'src/app/_sevices/busquedas.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})

export class HorariosPage implements OnInit {
  //Comprobar si hubo cambios en los combo box
  cambioC: boolean = false;
  cambio: boolean = false;

  //Variables dinamicas para mostrar en el front
  zona: string = "Sur";
  trayectoria: string;

  descripcion: string = "";
  rutanombre: string = "";

  //listado de rutas por zona
  rutas: any;

  //trayectoria actual
  horario: any;
  trayecActual: any;
  tabla: any[] = [];
  schemaTabla = {
    nombre: "",
    horaM: "",
    horaN: "",
    icon: "",
    color: ""
  }

  constructor(private rutasService: RutasService, private trayecService: TrayectoriasService,
    public platform: Platform, private router: Router,
    private buscarServices: BusquedasService) { }

  async ngOnInit() {
    this.platform.ready().then(() => {
      this.rutasService.getRutasZona(this.zona).subscribe(data => {
        this.rutas = data;
      })
    });

  }

  onChangeC(newValue) {
    if (typeof newValue === "undefined") {
    } else {
      this.tabla = [];
      this.cambioC = true;
      this.zona = newValue;
      this.trayectoria = "";
      this.trayecActual = null;
      this.rutanombre = "";
      this.descripcion = "";
      this.rutasService.getRutasZona(this.zona).subscribe(data => {
        this.rutas = data;
      })
    }
  }

  async onChange(trayectoriaActual) {

    if (typeof trayectoriaActual === "undefined") {
    } else {
      this.cambio = true;
      this.trayectoria = trayectoriaActual;
      this.tabla = []
      for (let i = 0; i < this.rutas.length; i++) {
        if (this.trayectoria == this.rutas[i].trayectoria) {
          this.rutanombre = this.rutas[i].nombre
          this.descripcion = this.rutas[i].descripcion

          this.buscarServices.buscarHorarios(this.trayectoria).subscribe(async (hor) => {
            this.horario = await hor[0]
            let contador = 1;

            //origen
            this.tabla.push({
              "id": contador,
              "nombre": await this.horario.horarioO.nombre,
              "horaM": await this.horario.horarioO.horaOM,
              "horaN": await this.horario.horarioO.horaON,
              "icono": "flag",
              "color": "#3c763d"
            })

            contador = contador + 1;

            //paradas

            for (let i = 0; i < this.horario.horarioP.length; i++) {
              this.tabla.push({
                "id": contador,
                "nombre": await this.horario.horarioP[i].nombre,
                "horaM": await this.horario.horarioP[i].horarioM,
                "horaN": await this.horario.horarioP[i].horarioN,
                "icono": "navigate",
                "color": "#31708f"
              })
              contador = contador + 1;
            }


            //destino
            this.tabla.push({
              "id": contador,
              "nombre": await this.horario.horarioD.nombre,
              "horaM": await this.horario.horarioD.horaDM,
              "horaN": await this.horario.horarioD.horaDN,
              "icono": "flag",
              "color": "#a94442"
            })
            console.log(this.tabla)
          })

        }
      }
    }
  }


}
