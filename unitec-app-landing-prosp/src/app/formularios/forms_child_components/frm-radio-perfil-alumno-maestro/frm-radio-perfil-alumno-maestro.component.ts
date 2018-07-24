import { Component, Input, OnInit } from '@angular/core';

declare var jQuery : any;
declare var $ :any;

@Component({
  selector: 'frm-radio-perfil-alumno-maestro',
  templateUrl: './frm-radio-perfil-alumno-maestro.component.html',
  styleUrls: ['./frm-radio-perfil-alumno-maestro.component.scss']
})
export class FrmRadioPerfilAlumnoMaestroComponent implements OnInit {

    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;
   
    constructor() { 

      jQuery(document).ready(function() {
        $(".radio-form").click(function(){
          console.log( ".icon-" + $(this).val() );

          $("fieldset.radio-input").removeAttr('style');
          $("fieldset div label").removeAttr('style');
          $( "fieldset div i.icono" ).css({
            'color': '#006fba'
          })

          $( "fieldset div i.icon-" + $(this).val() ).css({
            'color': '#ffffff'
          })

          $("fieldset div label.icon-" + $(this).val()).css({
            'color': '#ffffff'
          })

          $("fieldset.icon-" + $(this).val()).css({
            'background-color': '#006fba'
          });

        })
      });

    }

    //Inicializacion del componente
    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_radio_perfil_AlumnoMaestro';
    }

}