import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportesService } from 'src/app/_service/reportes.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

interface Tipo {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit, OnDestroy {

  chart: any;
  tipo: string = 'barras';
  fechaInicio: Date;
  fechaFin: Date;

  mensaje: string = '';

  forms:any[] = [];

  private ngUnsubscribe: Subject<void> = new Subject();

  tipos: Tipo[] = [
    { value: 'lineas', viewValue: 'Grafica de lineas' },
    { value: 'barras', viewValue: 'Grafica de barras' },
    { value: 'pastel', viewValue: 'Grafica de pastel' }
  ];

  constructor(private reportesService: ReportesService, private snackBar: MatSnackBar,  private router: Router,public route: ActivatedRoute) { }

  ngOnInit() {
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
    this.graficar(this.tipo)

  }



  graficar(tipo) {
    this.reportesService.buscarPorFecha(this.fechaInicio, this.fechaFin).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
      if (this.chart) {
        this.chart.destroy();
      }
      let fechas = data.map(res => moment(res.fecha.toDate()).format('DD-MM-YYYY'));
      let tipos = data.map(res => res.tipo);
      let datos = data;
      var countTip = {}
      var count = {};

      tipos.forEach(function (i) { countTip[i] = (countTip[i] || 0) + 1; });
      fechas.forEach(function (i) { count[i] = (count[i] || 0) + 1; });

      let sugerencia: any[] = []
      let queja: any[] = []
      let novedad: any[] = []


      let fechaCont: any[] = [];
      let cantidadCont: any[] = [];

      let tipoLabel: any[] = [];
      let cantTipo: any[] = [];

      for (let key in countTip) {
        tipoLabel.push(key)
        cantTipo.push(countTip[key])
      }

      for (let key in count) {
        fechaCont.push(key);
        cantidadCont.push(count[key]);
      }

      let contSug = 0
      let contQueja = 0
      let contNov = 0

      for (let j = 0; j < fechaCont.length; j++) {
        contSug = 0
        contQueja = 0
        contNov = 0

        for (let i = 0; i < datos.length; i++) {
          let f = moment(fechaCont[j], 'DD-MM-YYYY').toDate().toDateString()
          let ff = moment(datos[i].fecha.toDate(), 'DD-MM-YYYY').toDate().toDateString()
          if (f == ff) {
            if (datos[i].tipo == 'Sugerencia') {
              contSug = contSug + 1
            } else if (datos[i].tipo == 'Queja') {
              contQueja = contQueja + 1
            } else if (datos[i].tipo == 'Novedad') {
              contNov = contNov + 1
            }
          }

        }

        console.log('Fecha: ' + fechaCont[j] + 'Quejas: ' + contQueja + 'Sugerencias' + contSug + 'Novedades' + contNov)

        sugerencia.push(contSug)
        queja.push(contQueja)
        novedad.push(contNov)
      }




      if (tipo == 'lineas') {
        //GRAFICO UNO FECHAS VS CANTIDAD
        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: fechaCont,
            datasets: [
              {
                label: 'Total',
                data: cantidadCont,
                borderColor: "#3cba9f",
                fill: false,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 0, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 99, 132, 0.2)'
                ]
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: ['CANTIDAD DE FORMULARIOS POR  DÌA', 'El gráfico muestra la cantidad de formularios registrado por día sin importar su tipo'],
              position: 'top'
            },
            scales: {
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'FECHA'
                },
                display: true
              }],
              yAxes: [{
                ticks: { beginAtZero: true },
                scaleLabel: {
                  display: true,
                  labelString: 'CANTIDAD DE FORMULARIOS'
                },
                display: true
              }],
            }
          }
        });

      } else if (tipo == 'barras') {
        //GRAFICO UNO FECHAS VS CANTIDAD TIPO
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart('canvas', {
          type: 'bar',
          data: {
            labels: fechaCont,
            datasets: [
              {
                label: 'Sugerencias',
                data: sugerencia,
                // this dataset is drawn below
                order: 1,
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
              },
              {
                label: 'Quejas',
                data: queja,
                // this dataset is drawn on top
                order: 2,
                backgroundColor: 'rgba(54, 162, 235, 0.2)'
              },
              {
                label: 'Novedades',
                data: novedad,
                // this dataset is drawn on top
                order: 2,
                backgroundColor: 'rgba(255, 206, 86, 0.2)'
              }

            ]
          },
          options: {
            title: {
              display: true,
              text: ['CANTIDAD DE FORMULARIOS POR  TIPO', 'El gráfico muestra la cantidad de formularios por tipo, registrados diariamente en la línea de tiempo'],
              position: 'top'
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'FECHA'
                },
                display: true
              }],
              yAxes: [{
                ticks: { beginAtZero: true },
                scaleLabel: {
                  display: true,
                  labelString: 'CANTIDAD DE FORMULARIOS'
                },
                display: true
              }],
            }
          }
        });
      } else if (tipo == 'pastel') {

        //GRAFICO UNO FECHAS VS CANTIDAD ESTADO

        // Notice the rotation from the documentation.

        var options = {
          title: {
            display: true,
            text: ['CANTIDAD DE FORMULARIOS POR TIPO', 'El gráfico segmenta el tipo de formularios recibidos en un intervalo de tiempo '],
            position: 'top'
          },
        };
        this.chart = new Chart('canvas', {
          type: 'pie',
          data: {
            labels: tipoLabel,
            datasets: [
              {
                fill: true,
                backgroundColor: [
                  'skyblue',
                  'green',
                  'red'],
                data: cantTipo,
                // Notice the borderColor 
                borderWidth: [2, 2]
              }
            ]
          },
          options: options
        });
      }
    })

  }

  fechaCorrecta() {
    let fechaI = moment(this.fechaInicio, 'DD-MM-YYYY');
    let fechaF = moment(this.fechaFin, 'DD-MM-YYYY');

    let today = moment(new Date(), 'DD-MM-YYYY');
    
    if (fechaI.isAfter(fechaF) == true || fechaI.isAfter(today)) {
      this.mensaje = 'La fecha Inicio debe ser menor a la fecha fin'
      this.snackBar.open(this.mensaje, 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });

      this.fechaInicio = new Date();
      this.fechaFin = new Date();
      this.graficar(this.tipo)
    } else if(fechaF.isAfter(today)){
      this.mensaje = 'La fecha fin debe ser menor a la fecha de hoy'
      this.snackBar.open(this.mensaje, 'AVISO', {
        duration: 4000,
        verticalPosition: 'top'
      });

      this.fechaInicio = new Date();
      this.fechaFin = new Date();
      this.graficar(this.tipo)
    } 
    else {
      this.graficar(this.tipo)
    }
  }

  verForms(){
    let value = {'fechaInicio':this.fechaInicio,
                 'fechaFin': this.fechaFin}
    this.router.navigate(['/reportes/detalle', value])
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }



}
