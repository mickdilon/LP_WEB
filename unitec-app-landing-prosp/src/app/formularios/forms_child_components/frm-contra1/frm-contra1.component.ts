import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import {reglasInputsService} from '../../forms_services/reglasInputs.service';
import { EventEmitter, Output } from '@angular/core';
//Servicio de reconocimiento por voz
import { NavegadorService } from '../../../services/navegador.service';
declare var jQuery : any;
declare var $ : any;
@Component({
  selector: 'frm-contra1',
  templateUrl: './frm-contra1.component.html',
  styleUrls: ['./frm-contra1.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NavegadorService ]
})

export class frmContra1 implements OnInit
{ 
    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;
    speechData: string;
    whatsbrowser : string;
    //Lamada al metodo padre
  @Output() execChildInput = new EventEmitter();

    constructor(private regIn:reglasInputsService,private navegador : NavegadorService)
    {
      this.whatsbrowser = navegador.whatsBrowser();
      console.log(this.whatsbrowser);
    }
    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_contra1';
      //console.log(this.inputComponent);
    }
        //Llamada al padre
        callSpeechParentComponent(childComponent) 
        {
          this.execChildInput.emit(childComponent);
        }
    //Reglas de los input no se permiten caracteres especiales y tampoco mas de 2 letras consecutivas
    //Este metodo es diferente a las validaciones simplemente se bloquea el input para no permitir la entrada
    reglasInputs(keyCode)
    {
      //Quitar los espacios al presionar una tecla
      jQuery("#frm_contra1").val(jQuery("#frm_contra1").val().replace(/ /g, ""));
      //let serviceResponse = this.regIn.esNumero(keyCode);
      return true;
    }

    onKey(keyCode)
    {
      //Quitar los espacios al presionar una tecla
      jQuery("#frm_contra1").val(jQuery("#frm_contra1").val().replace(/ /g, ""));
    }

}