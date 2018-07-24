import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-frm-aviso-de-privacidad',
  templateUrl: './frm-aviso-de-privacidad.component.html',
  styleUrls: ['./frm-aviso-de-privacidad.component.scss']
})
export class FrmAvisoDePrivacidadComponent implements OnInit {
    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;
    url : string = "//www.unitec.mx/politicas-de-privacidad/";

    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_aviso_de_privacidad';
    }
}