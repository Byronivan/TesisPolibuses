import { Component, OnInit, ViewChild } from '@angular/core';
import { RutasService } from 'src/app/_sevices/rutas.service';
import { TrayectoriasService } from 'src/app/_sevices/trayectorias.service';
import { Subject } from 'rxjs';
import { MenuController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { google } from "google-maps";
import { BusquedasService } from 'src/app/_sevices/busquedas.service';
import { IonicComponentService } from 'src/app/_sevices/ionic-component.service';

declare var google: google;

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {
  //Enviar id de bus
  varOut: any;

  //Comprobar si hubo cambios en los combo box
  cambioC: boolean = false;
  cambio: boolean = false;

  //Variables dinamicas para mostrar en el front
  zona: string = "Sur";
  trayectoria: string;
  descripcion: string = "";
  rutanombre: string = "";
  buscon: string = "";

  //listado de rutas por zona
  rutas: any;

  //variables mapa
  @ViewChild('map', { static: true }) map_div: any;
  map: any;
  paradas = [];

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: false
  });

  //trayectoria actual
  trayecActual: any;

  //unsuscribe
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private rutasService: RutasService, private trayecService: TrayectoriasService,
    public platform: Platform, private router: Router, private busquedas: BusquedasService,
    private route: ActivatedRoute, private ionicComponents: IonicComponentService,
    private menuCtrl: MenuController) {
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
    this.platform.ready().then(() => {
      this.rutasService.getRutasZona(this.zona).subscribe(data => {
        this.rutas = data;
      })
      this.loadMap();
    });

  }

  onChangeC(newValue) {
    if (typeof newValue === "undefined") {
    } else {

      this.cambioC = true;
      this.zona = newValue;
      this.trayectoria = "";
      this.trayecActual = null;
      this.rutasService.getRutasZona(this.zona).subscribe(data => {
        this.rutas = data;
      })

      //funcion limpiar marcadores
      if (this.paradas != []) {
        for (var i = 0; i < this.paradas.length; i++) {
          this.paradas[i].setMap(null);
        }
        //limpiar array de paradas 
        this.paradas = [];
      }
      this.directionsRenderer.setMap(null);

    }
  }

  onChange(trayectoriaActual) {
    const infowindow = new google.maps.InfoWindow();
    const infowindowO = new google.maps.InfoWindow();
    const infowindowD = new google.maps.InfoWindow();

    if (typeof trayectoriaActual === "undefined") {
    } else {

      this.directionsRenderer.setMap(this.map)
      this.cambio = true;
      this.trayectoria = trayectoriaActual;
      console.log(this.trayectoria)
      //funcion limpiar marcadores ***
      if (this.paradas != []) {
        for (var i = 0; i < this.paradas.length; i++) {
          this.paradas[i].setMap(null);
        }
        //limpiar array de paradas 
        this.paradas = [];
      }

      for (let i = 0; i < this.rutas.length; i++) {
        if (this.trayectoria == this.rutas[i].trayectoria) {
          this.varOut = { idbus: this.rutas[i].bus, ruta: this.rutas[i].nombre }

          this.rutanombre = this.rutas[i].nombre
          this.descripcion = this.rutas[i].descripcion
          this.buscon = this.rutas[i].bus


          //buscar trayectoria a marcar en el mapa
          const iconO = {
            url: 'assets/mapsIcons/go.png',
            scaledSize: new google.maps.Size(50,50)
          }

          const iconD = {
            url: 'assets/mapsIcons/stop.png' ,
            scaledSize: new google.maps.Size(50,50)
          }

          const iconP = {
            url: 'assets/mapsIcons/bus.png',
            scaledSize: new google.maps.Size(50,50)
          }

          this.busquedas.buscarHorarios(this.trayectoria).subscribe((resul: any) => {
            this.trayecService.buscarTrayectoriaId(resul[0].idTrayectoria).subscribe(data => {
              this.trayecActual = data[0].payload.doc.data();
              let horarios: any = resul;
              let origen = new google.maps.Marker({
                position: new google.maps.LatLng(this.trayecActual.origen["lat"], this.trayecActual.origen["lng"]),
                map: this.map,
                draggable: false,
                icon: iconO,
                title: this.trayecActual.origen["nombre"],
                animation: google.maps.Animation.DROP
              });

              let destino = new google.maps.Marker({
                position: new google.maps.LatLng(this.trayecActual.destino["lat"], this.trayecActual.destino["lng"]),
                map: this.map,
                icon: iconD,
                draggable: false,
                title: this.trayecActual.destino["nombre"],
                animation: google.maps.Animation.DROP
              });

              var oContent =
                '<h3>' + horarios[0].horarioO.nombre + '</h3>' +
                '<p>Hora Mañana:' + horarios[0].horarioO.horaOM +
                '</br>Hora Noche:' + horarios[0].horarioO.horaON +
                '</p>';

              var dContent =
                '<h3>' + horarios[0].horarioD.nombre + '</h3>' +
                '<p>Hora Mañana:' + horarios[0].horarioD.horaDM +
                '</br>Hora Noche:' + horarios[0].horarioD.horaDN +
                '</p>';

              google.maps.event.addListener(origen, "click", function () {
                infowindowO.setContent(oContent);
                infowindowO.open(this.map, this);
              });

              google.maps.event.addListener(destino, "click", function () {
                infowindowD.setContent(dContent);
                infowindowD.open(this.map, this);
              });

              this.paradas.push(origen)
              this.paradas.push(destino)

              for (let i = 0; i < this.trayecActual.paradas.length; i++) {
                if (this.trayecActual.paradas[i].parada == horarios[0].horarioP[i].id) {
                  var sContent =
                    '<h3>' + horarios[0].horarioP[i].nombre + '</h3>' +
                    '<p>Hora Mañana:' + horarios[0].horarioP[i].horarioM +
                    '</br>Hora Noche:' + horarios[0].horarioP[i].horarioN +
                    '</p>';
                }


                let parada = new google.maps.Marker({
                  position: new google.maps.LatLng(this.trayecActual.paradas[i]["lat"], this.trayecActual.paradas[i]["lng"]),
                  map: this.map,
                  draggable: false,
                  visible: true,
                  title: this.trayecActual.paradas[i]["nombre"],
                  animation: google.maps.Animation.DROP
                });

                parada['customInfo'] = sContent;

                google.maps.event.addListener(parada, "click", function () {
                  infowindow.setContent(this.customInfo);
                  infowindow.open(this.map, this);
                });

                this.paradas.push(parada)
              }
              this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, origen.getPosition(), destino.getPosition())
            })
          })
        }
      }
    }
  }

  //cargar mapa
  loadMap() {
    const mapProperties = {
      center: new google.maps.LatLng(-0.2087546, -78.4880402),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.map_div.nativeElement, mapProperties);
    this.directionsRenderer.setMap(this.map);
  }

  //calcular ruta
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    let waypoints: any[] = [];
    for (let i = 0; i < this.trayecActual.paradas.length; i++) {
      let lat = this.trayecActual.paradas[i]["lat"];
      let lng = this.trayecActual.paradas[i]["lng"];
      waypoints.push({
        location: { lat, lng },
        stopover: true
      });
    }
    directionsService.route({
      origin: pointA,
      destination: pointB,
      waypoints: waypoints,
      avoidTolls: true,
      avoidHighways: true,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);

      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    this.directionsRenderer.setOptions({ suppressMarkers: true })

  }

  obtenerBusConductor() {
    if (this.trayecActual == null) {
      this.ionicComponents.presentToast('Seleccione una Ruta!', 900)
    } else {
      this.router.navigate(['/module-app/modules/inicio/rutas/info-bcon', this.varOut]);

    }
  }

}
