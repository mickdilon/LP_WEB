import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms'
declare var jQuery : any;
declare var $ :any;

@Component({
  selector: 'frm-ciclo',
  templateUrl: './frm-ciclo.component.html',
  styleUrls: ['./frm-ciclo.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class frmCicloComponent
{ 
  @Input() formularioPadre;
  @Input() asterisk : boolean;
  @Input() fase : string;
  inputComponent : string;
  preguntaCiclo = "¿Cuando te interesa entrar?";
  constructor()
  {
      jQuery(document).ready(function() {
          jQuery('.frm-select-ciclo').on('change', function(e){
            var valorSelect = e.target.options[e.target.selectedIndex].value;
            if(valorSelect != "") {
              jQuery(".frm-ciclo").removeClass("sin-ciclo");
              jQuery(".frm-ciclo").addClass("con-ciclo");
              jQuery("#valida_ciclo").val("1");
            }else {
              jQuery(".frm-ciclo").removeClass("con-ciclo");
              jQuery(".frm-ciclo").addClass("sin-ciclo");
              jQuery("#valida_ciclo").val("0");
            }

          })
       });
  }
  ngOnInit()
  {
    this.inputComponent = this.fase + '.frm_ciclo';
  }
}