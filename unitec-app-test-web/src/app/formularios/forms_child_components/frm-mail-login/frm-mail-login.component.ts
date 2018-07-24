import { Component, Input } from '@angular/core';
import { reglasInputsService } from '../../forms_services/reglasInputs.service';

declare var jQuery : any;
declare var $ : any;

@Component({
    selector: 'frm-mail-login',
    templateUrl: './frm-mail-login.component.html',
    styleUrls: ['./frm-mail-login.component.scss']
})
export class frmMailLoginComponent {
    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;

    constructor ( private regIn:reglasInputsService 
                ) { 

    }

    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_mail_login';
    }

    //Reglas de los input no se permiten caracteres especiales y tampoco mas de 2 letras consecutivas
    //Este metodo es diferente a las validaciones simplemente se bloquea el input para no permitir la entrada
    reglasInputs(evento)
    {
      let serviceResponse = this.regIn.sinEspacios(evento);
      //Validar el input por la implementacion del autocomplete
      jQuery("#lbl-frm-email").addClass("active");
      //this.execChildInputTypeAhead.emit(jQuery("#EmailbyPass").val());
      //Retornamos la respuesta del servicio
      return serviceResponse;
    }
}