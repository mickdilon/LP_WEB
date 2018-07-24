import { Component, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import {reglasInputsService} from '../../forms_services/reglasInputs.service';
import { EventEmitter, Output } from '@angular/core';
//Servicio de reconocimiento por voz
import { NavegadorService } from '../../../services/navegador.service';
declare var jQuery : any;
declare var $ : any;

@Component({
  selector: 'frm-mail',
  templateUrl: './frm-mail.component.html',
  styleUrls: ['./frm-mail.component.scss'],
  providers: [ NavegadorService ]
})

export class frmMailComponent
{

  @Input() formularioPadre;
  @Input() asterisk : boolean;
  @Input() fase : string;
  inputComponent : string;
  speechData: string;
  whatsbrowser : string;
  //Lamada al metodo padre
  @Output() execChildInput = new EventEmitter();
  @Output() execChildInputTypeAhead = new EventEmitter();
  constructor(private elementRef:ElementRef, private regIn:reglasInputsService,private navegador : NavegadorService ) 
  { 

    this.whatsbrowser = navegador.whatsBrowser();
    console.log(this.whatsbrowser);
    //Inicialización del typeahead

  }
    //Llamada al padre
    callSpeechParentComponent(childComponent) 
    {
      this.execChildInput.emit(childComponent);
    }
    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_mail';

    }

  ngAfterViewInit() 
  {



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

  focusOutFunction(evento) {
    //jQuery("#lbl-frm-email").removeClass("active");
    this.execChildInputTypeAhead.emit(jQuery("#EmailbyPass").val());
  }

  focusInFunction(evento) {
    jQuery("#lbl-frm-email").addClass("active");
    //this.execChildInputTypeAhead.emit(jQuery("#EmailbyPass").val());
  }

}
