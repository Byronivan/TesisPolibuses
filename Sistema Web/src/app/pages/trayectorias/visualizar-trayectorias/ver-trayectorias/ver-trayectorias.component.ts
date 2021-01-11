import { Paradas } from './../../crear-trayectoria/crear-trayectoria.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Trayectoria } from './../../../../_model/trayectorias';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ver-trayectorias',
  templateUrl: './ver-trayectorias.component.html',
  styleUrls: ['./ver-trayectorias.component.scss']
})
export class VerTrayectoriasComponent implements OnInit {

  trayectoria: Trayectoria;

  public dataSource = new MatTableDataSource<any>()
  displayedColumns: string[] = ['parada', 'nombre'];

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  pagina: any;

  marker1: google.maps.Marker;
  marker2: google.maps.Marker;

  autocompleteInput: string;
  autocompleteInput2: string;

  array: Paradas[] = [];

  @ViewChild('map', { static: true }) gmapElement: any;
  map: google.maps.Map;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: false
  });

  constructor(public dialogRef: MatDialogRef<VerTrayectoriasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Trayectoria) { }

  ngOnInit() {


    this.trayectoria = new Trayectoria();
    this.trayectoria.nombre = this.data.nombre;
    this.trayectoria.origen = this.data.origen;
    this.trayectoria.destino = this.data.destino;
    this.trayectoria.paradas = this.data.paradas;
    this.dataSource.data = this.data.paradas as any[];  

    const mapProperties = {
      center: new google.maps.LatLng(-0.2087546, -78.4880402),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);

    this.marker1 = new google.maps.Marker({
      map: this.map,
      draggable: false,
      icon:{
				url:'http://maps.google.com/mapfiles/kml/paddle/go.png', 
	
			},
      position: { lat: this.trayectoria.origen["lat"], lng: this.trayectoria.origen["lng"] }
    });

    this.marker2 = new google.maps.Marker({
      map: this.map,
      draggable: false,
      icon:{
				url:'http://maps.google.com/mapfiles/kml/paddle/stop.png', 
	
			},
      position: { lat: this.trayectoria.destino["lat"], lng: this.trayectoria.destino["lng"] }
    });

    this.obtenerDireccion(this.marker1).then((result) => {
      this.autocompleteInput = this.trayectoria.origen["nombre"];

    });

    this.obtenerDireccion(this.marker2).then((result) => {
      this.autocompleteInput2 = this.trayectoria.destino["nombre"];
    });

    this.directionsRenderer.setMap(this.map);

    this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())

    for (let i = 0; i < this.trayectoria.paradas.length; i++) {
      let parada = new google.maps.Marker({
        position: new google.maps.LatLng(this.trayectoria.paradas[i]["lat"], this.trayectoria.paradas[i]["lng"]),
        map: this.map,
        icon:{
					url:'http://maps.google.com/mapfiles/ms/micons/bus.png' 
        },  
        draggable: false
      });
    }

  }

  obtenerDireccion(marker) {
    'use strict';

    const getAddress = () => {
      return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: marker.getPosition() }, (results, status) => {
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
        let location = await getAddress()
        return location.toString()
      } catch (error) {

      }
    }

    return cargarDireccion();

  }

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

  cancelar() {
    this.dialogRef.close();
  }



}
