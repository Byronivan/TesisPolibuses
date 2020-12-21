import { BusesService } from 'src/app/_service/buses.service';
import { TrayectoriasService } from 'src/app/_service/trayectorias.service';
import { RutasService } from './../../../../_service/rutas.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Ruta } from 'src/app/_model/rutas';
import { Subject } from 'rxjs';
import { HorariosService } from 'src/app/_service/horarios.service';
import { Trayectoria } from 'src/app/_model/trayectorias';
import { Paradas } from 'src/app/pages/trayectorias/crear-trayectoria/crear-trayectoria.component';
import { element } from 'protractor';

@Component({
  selector: 'app-dialogo-rutas',
  templateUrl: './dialogo-rutas.component.html',
  styleUrls: ['./dialogo-rutas.component.scss']
})
export class DialogoRutasComponent implements OnInit, OnDestroy {

  marker1: google.maps.Marker;
  marker2: google.maps.Marker;

  array: Paradas[] = [];

  @ViewChild('map', { static: true }) gmapElement: any;
  map: google.maps.Map;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: false
  });



  ruta: Ruta
  private ngUnsubscribe: Subject<void> = new Subject();
  trayectorias: any;

  constructor(public dialogRef: MatDialogRef<DialogoRutasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ruta,
    private horarioService: HorariosService, private busesService: BusesService, private trayectoriaS: TrayectoriasService) { }

  ngOnInit() {
    const mapProperties = {
      center: new google.maps.LatLng(-0.2087546, -78.4880402),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);
    this.ruta = new Ruta();
    this.ruta.id = this.data.id;
    this.ruta.nombre = this.data.nombre;
    this.ruta.descripcion = this.data.descripcion;
    this.ruta.zona = this.data.zona;
    this.ruta.bus = this.data.bus;


    this.trayectoriaS.listar().subscribe((ltrayectorias)=>{
      this.trayectorias = ltrayectorias

      this.horarioService.buscarHorarioId(this.data.trayectoria).subscribe(async (resul) => {
        if (resul.length == 0) console.log("no hay datos")
        else {
          resul.forEach(async (data: any) => {
            this.ruta.trayectoria = await data.payload.doc.data().nombreTrayectoria;
            this.trayectorias.forEach(async (element) => {
              
              if(element.id ==  data.payload.doc.data().idTrayectoria){
                //marcadores origen y destino
                this.marker1 = new google.maps.Marker({
                  map: this.map,
                  draggable: false,
                  icon:{
                    url:'http://maps.google.com/mapfiles/kml/paddle/go.png', 
              
                  },
                  position: { lat: element.origen["lat"], lng: element.origen["lng"] }
                });

                this.marker2 = new google.maps.Marker({
                  map: this.map,
                  draggable: false,
                  icon:{
                    url:'http://maps.google.com/mapfiles/kml/paddle/stop.png', 
              
                  },
                  position: { lat: element.destino["lat"], lng: element.destino["lng"] }
                });

                //paradas
                for (let i = 0; i < element.paradas.length; i++) {
                  let parada = new google.maps.Marker({
                    position: new google.maps.LatLng(element.paradas[i]["lat"], element.paradas[i]["lng"]),
                    map: this.map,
                    icon:{
                      url:'http://maps.google.com/mapfiles/ms/micons/bus.png' 
                    },  
                    draggable: false
                  });
                }

                this.directionsRenderer.setMap(this.map);
                this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition(),element)

              }
            });
        
          })
        }
      })
  
  

    })


    this.busesService.buscarBusId(this.data.bus).subscribe((resul) => {
      if (resul.length == 0) console.log("no hay datos")
      else {
        resul.forEach((data: any) => {
          this.ruta.bus = data.payload.doc.data().placa;
        })
      }
    })

  

  }

  cancelar() {
    this.dialogRef.close();

  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB,element) {
    let waypoints: any[] = [];

    for (let i = 0; i < element.paradas.length; i++) {
      let lat = element.paradas[i]["lat"];
      let lng = element.paradas[i]["lng"];
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



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

  }


}
