import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TrayectoriasService } from './../../../_service/trayectorias.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Trayectoria } from './../../../_model/trayectorias';

import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit, NgZone } from '@angular/core';
import { } from 'googlemaps';


export interface Paradas {
	parada: number;
	nombre: string;
	lat: number;
	lng: number;
}

@Component({
	selector: 'app-crear-trayectoria',
	templateUrl: './crear-trayectoria.component.html',
	styleUrls: ['./crear-trayectoria.component.scss']
})

export class CrearTrayectoriaComponent implements OnInit, AfterViewInit {

	public dataSource = new MatTableDataSource<any>()
	displayedColumns: string[] = ['parada', 'nombre', 'eliminar'];

	@ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
		this.dataSource.paginator = paginator;
	}

	@ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
		this.dataSource.sort = sort;
	}


	// Primer input Origen
	@Input() adressType: string;
	@Output() setAddress: EventEmitter<any> = new EventEmitter();
	@ViewChild('addresstext', { static: true }) addresstext: any;


	//botones
	activarParadas: boolean = false;

	autocompleteInput: string;
	queryWait: boolean;

	address: Object;
	formattedAddress: any;

	//Segundo input Destino
	@Input() adressType2: string;
	@Output() setAddress2: EventEmitter<any> = new EventEmitter();
	@ViewChild('addresstext2', { static: true }) addresstext2: any;

	autocompleteInput2: string;
	queryWait2: boolean;

	address2: Object;
	formattedAddress2: any;


	//Tercer input Paradas
	@Input() adressType3: string;
	@Output() setAddress3: EventEmitter<any> = new EventEmitter();
	@ViewChild('addresstext3', { static: true }) addresstext3: any;


	autocompleteInput3: string;
	queryWait3: boolean;

	address3: Object;
	formattedAddress3: any;

	//Mapa
	@ViewChild('map', { static: true }) gmapElement: any;
	map: google.maps.Map;
	directionsService = new google.maps.DirectionsService();
	directionsRenderer = new google.maps.DirectionsRenderer({
		draggable: false,
	});


	//marcadores
	marker1: google.maps.Marker;
	marker2: google.maps.Marker;

	waypoints1: any[] = [];

	//paradas
	paradaLat: any;
	paradaLng: any;
	nombreParada: string;
	numParada: number = 0;
	array: Paradas[] = [];

	parada: google.maps.Marker;

	origen: Paradas[] = [];
	destino: Paradas[] = [];

	form: FormGroup;
	mensaje: string;


	constructor(public zone: NgZone, private afs: AngularFirestore, private trayectoriasService: TrayectoriasService,
		private snackBar: MatSnackBar,
		private router: Router,
		private route: ActivatedRoute) {

	}

	ngOnInit(): void {

		this.form = new FormGroup({
			'id': new FormControl(''),
			'nombre': new FormControl('', Validators.required),
			'origen': new FormControl('', Validators.required),
			'destino': new FormControl('', Validators.required),
			'paradas': new FormControl('')
		});

		const mapProperties = {
			center: new google.maps.LatLng(-0.2087546, -78.4880402),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProperties);

		this.marker1 = new google.maps.Marker({
			map: this.map,
			draggable: true,
			icon: {
				url: 'http://maps.google.com/mapfiles/kml/paddle/go.png',

			},
			position: { lat: -0.2087546, lng: -78.4880402 }
		});


		this.marker2 = new google.maps.Marker({
			map: this.map,
			draggable: true,
			icon: {
				url: 'http://maps.google.com/mapfiles/kml/paddle/stop.png',

			},
			position: { lat: -0.1886271, lng: -78.5007647 }
		});

		this.origen.push({
			nombre: "",
			parada: 0,
			lat: this.marker1.getPosition().lat(),
			lng: this.marker1.getPosition().lng()
		})

		this.destino.push({
			nombre: "",
			parada: 0,
			lat: this.marker2.getPosition().lat(),
			lng: this.marker2.getPosition().lng()
		})


		google.maps.event.addListener(this.marker1, 'dragend', (result) => {
			console.log(this.destino[0]['nombre'])
			if (this.destino[0]['nombre'] != '') {
				console.log(this.destino[0]['nombre'])
				this.update(this.marker1, this.marker2)
			}

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
				if (result == this.destino[0]['nombre']) {
					this.origen[0]['nombre'] = 'No valida';
					this.autocompleteInput = '';
					this.marker1.setPosition(new google.maps.LatLng(-0.2087546, -78.4880402))
					this.update(this.marker1, this.marker2)
					this.mensaje = 'El origen debe ser diferente al destino'
					this.snackBar.open(this.mensaje, 'AVISO', {
						duration: 4000,
						verticalPosition: 'top'
					});
				} else {
					this.origen[0]['nombre'] = result;
					this.autocompleteInput = result;

				}
			})

		});


		google.maps.event.addListener(this.marker2, 'dragend', (result) => {
			if (this.origen[0]['nombre'] != '') {
				console.log(this.destino[0]['nombre'])
				this.update(this.marker1, this.marker2)
			}

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
				if (result == this.origen[0]['nombre']) {
					console.log('El destino debe ser diferente al origen')
					this.destino[0]['nombre'] = 'No Valida';
					this.autocompleteInput2 = '';
					this.marker2.setPosition(new google.maps.LatLng(-0.1886271, -78.5007647))
					this.update(this.marker1, this.marker2)
					this.mensaje = 'El destino debe ser diferente al origen'
					this.snackBar.open(this.mensaje, 'AVISO', {
						duration: 4000,
						verticalPosition: 'top'
					});
				} else {
					this.destino[0]['nombre'] = result;
					this.autocompleteInput2 = result;
				}
			})

		});

		this.directionsRenderer.setMap(this.map)
	}

	private getArray() {
		this.dataSource.data = this.array as any[];
	}

	get f() { return this.form.controls; }


	update(marker1: google.maps.Marker, marker2: google.maps.Marker) {
		this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, marker1.getPosition(), marker2.getPosition())
	}

	ngAfterViewInit() {
		this.getPlaceAutocomplete();
	}

	private getPlaceAutocomplete() {
		var options = {
			keyword: 'establishment'
		}

		var autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
			{
				componentRestrictions: { country: 'EC' },
				types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
			});

		google.maps.event.addListener(autocomplete, 'place_changed', () => {

			var place = autocomplete.getPlace();
			if (place.address_components != null && place.address_components.length >= 1) {
				this.invokeEvent(place);

				if (place.name == this.destino[0]['nombre']) {
					this.mensaje = 'El origen debe ser diferente al destino'
					this.snackBar.open(this.mensaje, 'AVISO', {
						duration: 4000,
						verticalPosition: 'top'
					});
					this.origen[0]['nombre'] = 'No Valida';
					this.autocompleteInput = '';
					this.marker1.setPosition(new google.maps.LatLng(-0.2087546, -78.4880402))
					this.update(this.marker1, this.marker2)
					this.activarParadas = false
				} else {
					this.formattedAddress = 'place.name'
					this.marker1.setPosition(place.geometry.location)
					this.origen[0]['nombre'] = place.name;
					this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())
				}

			} else {
				this.activarParadas = false
			}
		})

		const autocomplete2 = new google.maps.places.Autocomplete(this.addresstext2.nativeElement,
			{
				componentRestrictions: { country: 'EC' },
				types: [this.adressType2]
			});
		google.maps.event.addListener(autocomplete2, 'place_changed', () => {
			var place2 = autocomplete2.getPlace();
			if (place2.address_components != null && place2.address_components.length >= 1) {
				this.invokeEvent(place2);

				if (place2.name == this.origen[0]['nombre']) {
					this.mensaje = 'El destino debe ser diferente al origen'
					this.snackBar.open(this.mensaje, 'AVISO', {
						duration: 4000,
						verticalPosition: 'top'
					});
					this.destino[0]['nombre'] = 'No Valida';
					this.autocompleteInput2 = '';
					this.marker2.setPosition(new google.maps.LatLng(-0.1886271, -78.5007647))
					this.update(this.marker1, this.marker2)
					this.activarParadas = false
				} else {
					this.formattedAddress2 = place2.name
					this.marker2.setPosition(place2.geometry.location)
					this.destino[0]['nombre'] = place2.name;
					this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())
					this.activarParadas = true
				}

			} else {
				this.activarParadas = false
			}
		})


		const autocomplete3 = new google.maps.places.Autocomplete(this.addresstext3.nativeElement,
			{
				componentRestrictions: { country: 'EC' },
				types: [this.adressType3]
			});

		google.maps.event.addListener(autocomplete3, 'place_changed', () => {
			const place3 = autocomplete3.getPlace();
			if (place3.address_components != null && place3.address_components.length >= 1) {
				this.invokeEvent(place3);
				this.formattedAddress3 = place3.name
				this.nombreParada = place3.name
				var lat = place3.geometry.location.lat()
				var lng = place3.geometry.location.lng()

				this.paradaLat = lat
				this.paradaLng = lng

				this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())
			}
		})

	}

	invokeEvent(place: Object) {
		this.setAddress.emit(place);
	}


	getAddrComponent(place, componentTemplate) {
		let result;
		for (let i = 0; i < place.address_components.length; i++) {
			const addressType = place.address_components[i].types[0];
			if (componentTemplate[addressType]) {
				result = place.address_components[i][componentTemplate[addressType]];
				return result;
			}
		}
		return;
	}

	getStreetNumber(place) {
		const COMPONENT_TEMPLATE = { street_number: 'short_name' },
			streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
		return streetNumber;
	}

	getStreet(place) {
		const COMPONENT_TEMPLATE = { route: 'long_name' },
			street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
		return street;
	}

	getCity(place) {
		const COMPONENT_TEMPLATE = { locality: 'long_name' },
			city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
		return city;
	}



	calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {


		let waypoints: any[] = [];

		for (let i = 0; i < this.array.length; i++) {
			let lat = this.array[i]["lat"];
			let lng = this.array[i]["lng"];
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


	async obtenerDireccion(marker) {

		'use strict';

		const getAddress = async () => {
			return new Promise((resolve, reject) => {
				const geocoder = new google.maps.Geocoder();
				geocoder.geocode({ location: marker.getPosition() }, (results, status) => {
					console.log(results[0]['formatted_address'])
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
				console.log(location);
				return await location.toString()
			} catch (error) {

			}
		}

		return await cargarDireccion();


	}

	crearParada() {
		if (this.paradaLng === undefined || this.nombreParada == '') {

		} else {
			var numero = this.numParada
			var lat = this.paradaLat;
			var lng = this.paradaLng;

			//http:// google.com/mapfiles/kml/paddle/pause.png
			this.parada = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				icon: {
					url: 'http://maps.google.com/mapfiles/ms/micons/bus.png',

				},
				map: this.map,
				draggable: true,
			});
			this.parada.set("identificador", numero)
			this.array.push({
				nombre: this.nombreParada,
				parada: this.numParada,
				lat: this.paradaLat,
				lng: this.paradaLng
			})

			this.waypoints1.push(this.parada)

			google.maps.event.addListener(this.parada, 'dragend', (result) => {

				'use strict';

				const getAddress = address => {
					return new Promise((resolve, reject) => {
						const geocoder = new google.maps.Geocoder();
						geocoder.geocode({ location: result.latLng }, (results, status) => {
							console.log(results[0]['formatted_address'])
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
						console.log(location);
						return location.toString()
					} catch (error) {

					}
				}

				var nom1: number;
				for (var a = 0; a < this.waypoints1.length; a++) {
					if (result.latLng == this.waypoints1[a]["position"]) {
						// le asignamos una funcion al eventos dragend del marcado
						nom1 = this.waypoints1[a]['identificador'];
						this.array[a].lat = this.waypoints1[a].position.lat();
						this.array[a].lng = this.waypoints1[a].position.lng();
					} else {

					}
				}

				cargarDireccion().then(result => {
					this.array[nom1]['nombre'] = result
				})

				this.getArray();
				this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())
			})

			this.getArray();
			this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())

			this.numParada++;
			this.autocompleteInput3 = "";

			this.paradaLat = null
			this.paradaLng = null
			this.autocompleteInput3 = ''
			this.nombreParada = ''
		}
	}

	operar() {
		if (this.array.length == 0) {
			this.mensaje = 'Debe ingresar al menos una parada'
			this.snackBar.open(this.mensaje, 'AVISO', {
				duration: 4000,
				verticalPosition: 'top'
			});
		} else {
			let origen = []
			origen.push({
				lat: this.marker1.getPosition().lat(),
				lng: this.marker1.getPosition().lng(),
				nombre: this.origen[0]['nombre']

			})


			let destino = []
			destino.push({
				lat: this.marker2.getPosition().lat(),
				lng: this.marker2.getPosition().lng(),
				nombre: this.destino[0]['nombre']
			})

			let trayectoria = new Trayectoria();
			trayectoria.id = this.afs.createId();
			trayectoria.nombre = this.form.value['nombre'];
			trayectoria.origen = origen[0];
			trayectoria.destino = destino[0];

			trayectoria.paradas = this.array;

			this.trayectoriasService.registrar(trayectoria);
			this.mensaje = 'SE REGISTRO CON EXITO'
			this.router.navigate(['/moduloRutas/visualizarTrayectoria'])
			this.snackBar.open(this.mensaje, 'AVISO', {
				duration: 4000,
				verticalPosition: 'top'
			});
			origen = [];
			destino = [];
			this.array = [];
			this.dataSource = new MatTableDataSource(this.array);
		}

	}

	habilitarBoton() {

		if (this.autocompleteInput === undefined || this.autocompleteInput2 === undefined) {
			this.activarParadas = false
		} else if (this.origen[0]['nombre'].trim() === '' || this.destino[0]['nombre'].trim() === '') {
			this.activarParadas = false
		} else if (this.autocompleteInput.trim() !== '' && this.autocompleteInput2.trim() !== '' && this.dataSource.data.length < 8) {
			this.activarParadas = true
		}
		if (this.dataSource.data.length > 7) {
			this.activarParadas = false
		}

		return this.activarParadas
	}

	removeRows(row) {

		for (let a in this.waypoints1) {
			if (this.waypoints1[a].identificador == row.parada) {
				this.waypoints1[a].setMap(null);
			}
		}

		this.waypoints1.forEach((item, index) => {
			if (item.identificador === row.parada) {
				console.log(index, item)
				this.waypoints1.splice(index, 1)
			}
		});

		this.dataSource.data.forEach((item, index) => {
			if (item.parada === row.parada) {
				console.log(index, item.parada, item.nombre)
				this.dataSource.data.splice(index, 1)
			}
		});

		this.dataSource._updateChangeSubscription()
		this.array = this.dataSource.data
		this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, this.marker1.getPosition(), this.marker2.getPosition())
	}

}
