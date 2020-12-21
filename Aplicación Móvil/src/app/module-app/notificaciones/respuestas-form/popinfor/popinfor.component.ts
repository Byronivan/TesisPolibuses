import { Component, Input, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { BusquedasService } from 'src/app/_sevices/busquedas.service';

@Component({
  selector: 'app-popinfor',
  templateUrl: './popinfor.component.html',
  styleUrls: ['./popinfor.component.scss'],
})
export class PopinforComponent implements OnInit {
  form: any
  respuesta: any
  constructor(public popover: PopoverController, public navParams: NavParams, private busquedas: BusquedasService) { }

  async ngOnInit() {
    this.form = this.navParams.get('form');
    this.busquedas.buscarRespuestaForm(this.form.id).subscribe(async (respuesta: any) => {
      this.respuesta = await respuesta[0]
      console.log(this.form)
      console.log(this.respuesta)
    })
  }

  ClosePopover() {
    this.popover.dismiss();
  }

}
