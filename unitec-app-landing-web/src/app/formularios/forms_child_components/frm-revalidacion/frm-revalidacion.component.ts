import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import {reglasInputsService} from '../../forms_services/reglasInputs.service';

declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'frm-revalidacion',
  templateUrl: './frm-revalidacion.component.html',
  styleUrls: ['./frm-revalidacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class frmRevalidacionComponent implements OnInit
{ 
    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;

    constructor(private regIn:reglasInputsService)
    {

    }
    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_revalidacion';
      //console.log(this.inputComponent);
    }
    //Reglas de los input no se permiten caracteres especiales y tampoco mas de 2 letras consecutivas
    //Este metodo es diferente a las validaciones simplemente se bloquea el input para no permitir la entrada
    reglasInputs(keyCode)
    {
      let serviceResponse = this.regIn.esNumero(keyCode);
      return serviceResponse;
    }

    cambiaTipoRegistro(evento)
    {
      let ev = evento.srcElement || evento.target;
      let tipoRegistro = "10040";
      if(ev.checked == true) {
        tipoRegistro = "10183";
      }else {
        tipoRegistro = "10040";
      }
      jQuery("#frm_tipo_registro").val(tipoRegistro);
    }

}