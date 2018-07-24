import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms'
declare var jQuery : any;
declare var $ :any;

@Component({
  selector: 'frm-estado',
  templateUrl: './frm-estado.component.html',
  styleUrls: ['./frm-estado.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class frmEstadoComponent
{ 
  @Input() formularioPadre;
  @Input() asterisk : boolean;
  @Input() fase : string;
  inputComponent : string;
  constructor()
  {
      jQuery(document).ready(function() {
          //jQuery('.mdb-select').material_select();
          jQuery('.frm-estado-ciclo').on('change', function(e){
            var valorSelect = e.target.options[e.target.selectedIndex].value;
            if(valorSelect != "") {
              jQuery(".frm-estado").removeClass("sin-estado");
              jQuery(".frm-estado").addClass("con-estado");
              jQuery("#valida_estado").val("1");
            }else {
              jQuery(".frm-estado").removeClass("con-estado");
              jQuery(".frm-estado").addClass("sin-estado");
              jQuery("#valida_estado").val("0");
            }

          })
       });
  }
  ngOnInit()
  {

    this.inputComponent = this.fase + '.frm_estado';
  }
}