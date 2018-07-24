import { Component, Input } from '@angular/core';
import {reglasInputsService} from '../../forms_services/reglasInputs.service';
import { EventEmitter, Output } from '@angular/core';
//Servicio de reconocimiento por voz
import { NavegadorService } from '../../../services/navegador.service';

@Component({
  selector: 'frm-amaterno',
  templateUrl: './frm-amaterno.component.html',
  styleUrls: ['./frm-amaterno.component.css'],
  providers: [ NavegadorService ]
})

export class frmAmaternoComponent
{

    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;
    speechData: string;
    whatsbrowser : string;
    //Lamada al metodo padre
    @Output() execChildInput = new EventEmitter();
    constructor(private regIn:reglasInputsService,
      private navegador : NavegadorService)
    {
      this.whatsbrowser = navegador.whatsBrowser();
      console.log(this.whatsbrowser);
    }
    //Llamada al padre
    callSpeechParentComponent(childComponent) 
    {
        this.execChildInput.emit(childComponent);
    }
    //Inicializacion del componente
    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_amaterno';
    }
    //Reglas de los input no se permiten caracteres especiales y tampoco mas de 2 letras consecutivas
    //Este metodo es diferente a las validaciones simplemente se bloquea el input para no permitir la entrada
    reglasInputs(objInput, keyCode, key)
    {
      let serviceResponse = this.regIn.EvaluateTextP(objInput, keyCode, key);
      return serviceResponse;
    }
}
