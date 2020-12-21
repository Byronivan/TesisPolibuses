import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/_sevices/authentication.service';
import { TrayectoriasService } from 'src/app/_sevices/trayectorias.service';
import { Trayectoria } from 'src/app/model/trayectorias';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/*import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  ILatLng,
  Marker,
  BaseArrayClass,
  LatLng,
  GoogleMapOptions,
  MarkerOptions,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';
*/

import { Platform } from '@ionic/angular';
declare var google;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit{
  @ViewChild('map', { static: true }) map_div: any;
  map:any;

  trayectoria: Trayectoria;
  trayectorias: Trayectoria[] = [];
  cambioC: boolean = false;
  /*or: LatLng = new LatLng(-0.2087546, -78.4880402);
  de: LatLng = new LatLng(-0.0385379, -78.493882);*/
  marker1: any;
  marker2: any;
  
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: false
  });

  maps:any;
  idTrayectoria: string;
  origen: any = [];
  destino: any = [];

  routePoints = [
    { "lat": -0.2087546, "lng": -78.4880402 },
    { "lat": -0.1029273, "lng": -78.4926028 },
    { "lat": -0.106146, "lng": -78.4996945 },
    { "lat": 0.1799981, "lng": -78.5093734 },
    { "lat": -0.0385379, "lng": -78.493882 }
  ];

  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(private auth: AuthenticationService,
    private trayectoriasService: TrayectoriasService,
    public platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.listarTrayectorias();
      this.loadMap();
    });
  }

  loadMap(){
    window.alert('entro')
    const mapProperties = {
      center: new google.maps.LatLng(-0.2087546, -78.4880402),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.map_div.nativeElement, mapProperties);

    this.marker1 = new google.maps.Marker({
      map: this.map,
      draggable: false,
      position: { lat: -0.2087546, lng: -78.4880402 }
    });

    this.marker2 = new google.maps.Marker({
      map: this.map,
      draggable: false,
      position: { lat: -0.2087546, lng: -78.4880402 }
    });

    this.directionsRenderer.setMap(this.map);
  }

  /*loadMap() {

    this.maps = GoogleMaps.create('map_canvas1');

    this.maps.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
      let coordinates: LatLng = new LatLng(-0.2087546, -78.4880402);

      let position = {
        target: coordinates,
        zoom: 13
      };

      this.maps.animateCamera(position);

      this.maps.addPolyline({
        points: this.routePoints,
        'color': '#AA00FF',
        'width': 4,
        'geodesic': true
      }).then((resp) => {
        let restaurantMarkerOptions: MarkerOptions = {
          title: "Sample Title",
          position: this.routePoints[this.routePoints.length - 1],
          animation: GoogleMapsAnimation.BOUNCE
        };
        this.maps.addMarker(restaurantMarkerOptions).then((marker: Marker) => {
          marker.showInfoWindow();
        });
      });
    });

  }
*/
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    let waypoints: any[] = [];
    for (let i = 0; i < this.trayectoria.paradas.length; i++) {
      let lat = this.trayectoria.paradas[i]["lat"];
      let lng = this.trayectoria.paradas[i]["lng"];
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

  listarTrayectorias() {
    this.trayectoriasService.listar().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.trayectorias = data;
    });
  }

  onChangeC(newValue) {
    if (typeof newValue === "undefined") {

    } else {
      window.alert('nueva trayectoria');
      this.idTrayectoria = newValue;
      this.trayectoriasService.buscarTrayectoriaId(newValue).subscribe(trayec => {
        if (trayec.length == 0) console.log('hola');
        else {
          trayec.forEach((data: any) => {
            this.trayectoria = new Trayectoria()
            this.trayectoria.id = data.payload.doc.data().id
            this.trayectoria.nombre = data.payload.doc.data().nombre
            this.trayectoria.origen = data.payload.doc.data().origen
            this.trayectoria.destino = data.payload.doc.data().destino
            this.trayectoria.paradas = data.payload.doc.data().paradas
            let latLngM1 = new google.maps.LatLng(data.payload.doc.data().origen["lat"], data.payload.doc.data().origen["lng"]);
            this.marker1.setPosition(latLngM1);
            let latLngM2 = new google.maps.LatLng(data.payload.doc.data().destino["lat"], data.payload.doc.data().destino["lng"]);
            this.marker2.setPosition(latLngM2);
            
            for (let i = 0; i < data.payload.doc.data().paradas.length; i++) {
              let parada = new google.maps.Marker({
                position: new google.maps.LatLng(this.trayectoria.paradas[i]["lat"], this.trayectoria.paradas[i]["lng"]),
                map: this.map,
                draggable: false
              });
            }
            this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())
          })
        }
      })
      this.cambioC = true;
    }
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
