import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormulariosService } from 'src/app/_service/formularios.service';

@Component({
  selector: 'app-ver-formulario-completo',
  templateUrl: './ver-formulario-completo.component.html',
  styleUrls: ['./ver-formulario-completo.component.scss']
})
export class VerFormularioCompletoComponent implements OnInit {
  
    nombre: string
    apellido:string
    mail:string
    telefono:string
    tipo:string
    descripcion:string
    descripcionResp:string
    estado:string
    colorLetra:string = 'Green'


  constructor(public dialogRef: MatDialogRef<VerFormularioCompletoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formulariosService: FormulariosService) { }

  ngOnInit() {
    
    this.nombre = this.data.nombre
    this.apellido = this.data.apellido
    this.mail = this.data.email
    this.telefono = this.data.telefono
    this.tipo = this.data.tipo
    this.descripcion = this.data.descripcion
    this.estado = this.data.estado

    if(this.estado=='Aprobar'){
      this.colorLetra = 'green'
    }else if(this.estado=='Rechazar'){
      this.colorLetra = 'red'
    }else{
      this.colorLetra = 'blue'
    }

    this.formulariosService.buscarRespuesta(this.data.id).subscribe((res: any) =>{
      if(res.length ==0){
        this.descripcionResp = 'Formulario no atendido';
      }else{
        this.descripcionResp = res[0].descripcion;
      }
    })
  }

}
