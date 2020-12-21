import { Component, Input, OnInit, Output, ViewChild, EventEmitter, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import * as geofirex from 'geofirex'
import * as firebaseApp from 'firebase/app'
import { Observable } from 'rxjs';
import { BusquedasService } from 'src/app/_sevices/busquedas.service';
import { TrayectoriasService } from 'src/app/_sevices/trayectorias.service';
import { google } from 'google-maps';

import { MapsAPILoader } from '@agm/core';
import { IonicComponentService } from 'src/app/_sevices/ionic-component.service';
import { MenuController } from '@ionic/angular';

declare var google: google;

@Component({
  selector: 'app-filtrar',
  templateUrl: './filtrar.page.html',
  styleUrls: ['./filtrar.page.scss'],
})
export class FiltrarPage implements OnInit, AfterViewInit {
  geo = geofirex.init(firebaseApp);
  tabla: any[] = [];
  rutasCompletas: any[] = [];

  points: Observable<any>;

  // Primer input Origen
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext', { static: true }) addresstext: any;

  autocomplete: string;
  queryWait: string;

  address: Object;
  formattedAddress: any;


  latitud: number = -0.1773481;
  longitud: number = -78.4871631;
  name: string = '';

  @ViewChild('map', { static: true }) map_div: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: false
  });

  paradas = [];

  //Autocomplete
  latitude: number;
  longitude: number;
  zoom: number;
  addresss: string;
  private geoCoder;

  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;

  constructor(private trayectorias: TrayectoriasService, private busquedas: BusquedasService,
    private ngZone: NgZone, private ionicComponents: IonicComponentService,
    private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.enable(true);
    //Carga Autocomplete
    this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      componentRestrictions: { country: 'EC' },
      types: [this.adressType]
    });
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        this.name = place.name
        this.marker.setPosition(place.geometry.location)
        this.map.panTo(place.geometry.location)

      });
    });





    this.busquedas.listarRutas().subscribe((rutas: any) => {
      rutas.forEach((element: any) => {

        this.busquedas.buscarHorarios(element.trayectoria).subscribe((horario: any) => {
          this.busquedas.buscarTrayectoriaId(horario[0].idTrayectoria).subscribe((trayec) => {
            this.rutasCompletas.push({
              ruta: element,
              horario: horario[0],
              trayectoria: trayec[0]
            })
          })
        })
      });

    })

    this.loadMap();
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;


        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  //cargar mapa
  loadMap() {
    const mapProperties = {
      center: new google.maps.LatLng(this.latitud, this.longitud),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.map_div.nativeElement, mapProperties);
    this.directionsRenderer.setMap(this.map);
  }

  ngAfterViewInit() {
    const iconF = {
      url: 'assets/mapsIcons/filter.png',
      scaledSize: new google.maps.Size(35, 50)
    }

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(this.latitud, this.longitud),
      map: this.map,
      icon: iconF,
      title: 'Center',
      draggable: true,
      animation: google.maps.Animation.DROP
    });


    google.maps.event.addListener(this.marker, 'dragend', (result) => {

      'use strict';
      const getAddress = address => {
        return new Promise((resolve, reject) => {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: result.latLng }, (results, status) => {
            if (status === 'OK') {
              resolve(results[0]['formatted_address']);
            } else {
              reject(status);
            }
          });
        });
      };

      const cargarDireccion = async () => {
        try {
          let location = await getAddress('Pomasqui')
          return location.toString()
        } catch (error) {

        }
      }

      cargarDireccion().then(result => {
        this.autocomplete = result;
      })

    })
  }

  filtro() {
    
    if (this.autocomplete != undefined) {
      //quitar ruta creada
      this.directionsRenderer.setMap(null);

      //funcion limpiar marcadores ***
      if (this.paradas != []) {
        for (var i = 0; i < this.paradas.length; i++) {
          this.paradas[i].setMap(null);
        }
        //limpiar array de paradas 
        this.paradas = [];
      }

      this.tabla = []

      let center = this.geo.point(this.marker.getPosition().lat(), this.marker.getPosition().lng());

      for (let i = 0; i < this.rutasCompletas.length; i++) {
        let position;
        let distance = 0;
        let cont = 0;

        let aux1 = null;
        let aux2 = null;
        let aux3 = 2;

        if (this.rutasCompletas[i].trayectoria.origen) {
          position = this.geo.point(this.rutasCompletas[i].trayectoria.origen.lat, this.rutasCompletas[i].trayectoria.origen.lng);
          distance = this.geo.distance(position, center)
          if (distance < 2) {
            aux1 = distance
            cont = cont + 1;
            //console.log('Distancia origen' + aux1)
          }
        }
        if (this.rutasCompletas[i].trayectoria.destino) {
          position = this.geo.point(this.rutasCompletas[i].trayectoria.destino.lat, this.rutasCompletas[i].trayectoria.destino.lng);
          distance = this.geo.distance(position, center)
          if (distance < 2) {
            aux2 = distance
            cont = cont + 1;
            //console.log('Distancia destino' + aux2)
          }
        }

        if (this.rutasCompletas[i].trayectoria.paradas.length > 0) {
          let parB = this.rutasCompletas[i].trayectoria.paradas
          for (let j = 0; j < parB.length; j++) {
            position = this.geo.point(parB[j].lat, parB[j].lng);
            distance = this.geo.distance(position, center)
            if (distance < 2) {
              if (distance < aux3) {
                aux3 = distance
              }

              //console.log('Distancia parada' + aux3)
              cont = cont + 1;
            }
          }
        }
        if (cont > 0) {
          if (aux1 == null) { aux1 = 100 }
          if (aux2 == null) { aux2 = 100 }
          if (aux3 == null) { aux3 = 100 }
          let otrosNumeros = [aux1, aux2, aux3];
          let menor = otrosNumeros[0];//Suponemos que el menor es el primero
          // Ciclo comienza en 1 porque el 0 ya está contemplado
          for (let x = 1; x < otrosNumeros.length; x++) {
            let numeroActual = otrosNumeros[x];
            if (numeroActual < menor) {
              menor = numeroActual;
            }
          }

         // console.log(aux1, aux2, aux3)

          this.tabla.push({
            ruta: this.rutasCompletas[i].ruta,
            trayectoria: this.rutasCompletas[i].trayectoria,
            horarios: this.rutasCompletas[i].horario,
            distance: menor.toFixed(2)
          })
        }
      }

      if(this.tabla.length == 0){
        this.ionicComponents.presentToast('No se encontraron Rutas cercanas', 900)
      }

    } else {
      this.ionicComponents.presentToast('Ingrese una dirección', 900)
    }

    console.log(this.tabla)
    console.log(this.rutasCompletas)

  }


  graficar(list) {
    this.directionsRenderer.setMap(this.map);
    const infowindow = new google.maps.InfoWindow();
    const infowindowO = new google.maps.InfoWindow();
    const infowindowD = new google.maps.InfoWindow();

    //funcion limpiar marcadores ***
    if (this.paradas != []) {
      for (var i = 0; i < this.paradas.length; i++) {
        this.paradas[i].setMap(null);
      }
      //limpiar array de paradas 
      this.paradas = [];
    }

    //buscar trayectoria a marcar en el mapa
    const iconO = {
      url: 'assets/mapsIcons/go.png',
      scaledSize: new google.maps.Size(50, 50)
    }

    const iconD = {
      url: 'assets/mapsIcons/stop.png',
      scaledSize: new google.maps.Size(50, 50)
    }

    const iconP = {
      url: 'assets/mapsIcons/bus.png',
      scaledSize: new google.maps.Size(50, 50)
    }

    //marcadores en el mapa 
    let origen = new google.maps.Marker({
      position: new google.maps.LatLng(list.trayectoria.origen["lat"], list.trayectoria.origen["lng"]),
      map: this.map,
      draggable: false,
      icon: iconO,
      title: list.trayectoria.origen["nombre"],
      animation: google.maps.Animation.DROP
    });

    let destino = new google.maps.Marker({
      position: new google.maps.LatLng(list.trayectoria.destino["lat"], list.trayectoria.destino["lng"]),
      map: this.map,
      icon: iconD,
      draggable: false,
      title: list.trayectoria.destino["nombre"],
      animation: google.maps.Animation.DROP
    });

    var oContent =
      '<h3>' + list.horarios.horarioO.nombre + '</h3>' +
      '<p>Hora Mañana:' + list.horarios.horarioO.horaOM +
      '</br>Hora Noche:' + list.horarios.horarioO.horaON +
      '</p>';

    var dContent =
      '<h3>' + list.horarios.horarioD.nombre + '</h3>' +
      '<p>Hora Mañana:' + list.horarios.horarioD.horaDM +
      '</br>Hora Noche:' + list.horarios.horarioD.horaDN +
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

    let paradas = list.trayectoria.paradas

    for (let i = 0; i < paradas.length; i++) {
      if (paradas[i].parada == list.horarios.horarioP[i].id) {
        var sContent =
          '<h3>' + list.horarios.horarioP[i].nombre + '</h3>' +
          '<p>Hora Mañana:' + list.horarios.horarioP[i].horarioM +
          '</br>Hora Noche:' + list.horarios.horarioP[i].horarioN +
          '</p>';
      }


      let parada = new google.maps.Marker({
        position: new google.maps.LatLng(paradas[i]["lat"], paradas[i]["lng"]),
        map: this.map,
        draggable: false,
        visible: true,
        title: paradas[i]["nombre"],
        animation: google.maps.Animation.DROP
      });

      parada['customInfo'] = sContent;

      google.maps.event.addListener(parada, "click", function () {
        infowindow.setContent(this.customInfo);
        infowindow.open(this.map, this);
      });

      this.paradas.push(parada)
    }
    let waypoints = list.trayectoria.paradas
    this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, origen.getPosition(), destino.getPosition(), waypoints)
  }

  //calcular ruta
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB, wayp) {

    let waypoints: any[] = [];
    for (let i = 0; i < wayp.length; i++) {
      let lat = wayp[i]["lat"];
      let lng = wayp[i]["lng"];
      waypoints.push({
        location: { lat, lng },
        stopover: true
      });
    }

    console.log(waypoints)
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

}
