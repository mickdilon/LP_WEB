import { Component, ViewEncapsulation, Input, OnInit, EventEmitter, Output } from '@angular/core';
import {formCookiesService} from '../../forms_services/formCookies.service';
import { FormGroup } from '@angular/forms';
import { readJson } from "../../../services/readJson.service";
declare var jQuery : any;
declare var $ :any;

@Component({
  selector: 'frm-estado-expuesto',
  templateUrl: './frm-estado-expuesto.component.html',
  styleUrls: ['./frm-estado-expuesto.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [readJson]
})

export class frmEstadoExpuestoComponent
{ 
  @Input() formularioPadre;
  @Input() asterisk : boolean;
  @Input() fase : string;
  inputComponent : string;
  titulo_linea = "¿Qué quieres estudiar?";
  private siguiente_paso : string = "lineas_de_negocio";
  //Listado de Estados
  estados = [
    {"id": "1", "name_id":"AGUASCALIENTES*a4a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"AGUASCALIENTES"},
    {"id": "2", "name_id":"BAJA CALIFORNIA NOR*a6a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"BAJA CALIFORNIA NOR"},
    {"id": "3", "name_id":"BAJA CALIFORNIA SUR*a8a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"BAJA CALIFORNIA SUR"},
    {"id": "4", "name_id":"CAMPECHE*aaa36c72-5072-e211-b35f-6cae8b2a4ddc","name":"CAMPECHE"},
    {"id": "5", "name_id":"COAHUILA*aca36c72-5072-e211-b35f-6cae8b2a4ddc","name":"COAHUILA"},
    {"id": "6", "name_id":"COLIMA*aea36c72-5072-e211-b35f-6cae8b2a4ddc","name":"COLIMA"},
    {"id": "7", "name_id":"CHIAPAS*b0a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"CHIAPAS"},
    {"id": "8", "name_id":"CHIHUAHUA*b2a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"CHIHUAHUA"},
    {"id": "9", "name_id":"CIUDAD DE MEXICO*b4a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"CIUDAD DE MEXICO"},
    {"id": "10", "name_id":"DURANGO*b6a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"DURANGO"},
    {"id": "11", "name_id":"GUANAJUATO*b8a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"GUANAJUATO"},
    {"id": "12", "name_id":"GUERRERO*baa36c72-5072-e211-b35f-6cae8b2a4ddc","name":"GUERRERO"},
    {"id": "13", "name_id":"HIDALGO*bca36c72-5072-e211-b35f-6cae8b2a4ddc","name":"HIDALGO"},
    {"id": "14", "name_id":"JALISCO*bea36c72-5072-e211-b35f-6cae8b2a4ddc","name":"JALISCO"},
    {"id": "15", "name_id":"ESTADO DE MEXICO*c0a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"ESTADO DE MEXICO"},
    {"id": "16", "name_id":"MICHOACAN*c2a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"MICHOACAN"},
    {"id": "17", "name_id":"MORELOS*c4a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"MORELOS"},
    {"id": "18", "name_id":"NAYARIT*c6a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"NAYARIT"},
    {"id": "19", "name_id":"NUEVO LEON*c8a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"NUEVO LEON"},
    {"id": "20", "name_id":"OAXACA*caa36c72-5072-e211-b35f-6cae8b2a4ddc","name":"OAXACA"},
    {"id": "21", "name_id":"PUEBLA*cca36c72-5072-e211-b35f-6cae8b2a4ddc","name":"PUEBLA"},
    {"id": "22", "name_id":"QUERETARO*cea36c72-5072-e211-b35f-6cae8b2a4ddc","name":"QUERETARO"},
    {"id": "23", "name_id":"QUINTANA ROO*d0a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"QUINTANA ROO"},
    {"id": "24", "name_id":"SAN LUIS POTOSI*d2a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"SAN LUIS POTOSI"},
    {"id": "25", "name_id":"SINALOA*d4a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"SINALOA"},
    {"id": "26", "name_id":"SONORA*d6a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"SONORA"},
    {"id": "27", "name_id":"TABASCO*d8a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"TABASCO"},
    {"id": "28", "name_id":"TAMAULIPAS*daa36c72-5072-e211-b35f-6cae8b2a4ddc","name":"TAMAULIPAS"},
    {"id": "29", "name_id":"TLAXCALA*dca36c72-5072-e211-b35f-6cae8b2a4ddc","name":"TLAXCALA"},
    {"id": "30", "name_id":"VERACRUZ*dea36c72-5072-e211-b35f-6cae8b2a4ddc","name":"VERACRUZ"},
    {"id": "31", "name_id":"YUCATAN*e0a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"YUCATAN"},
    {"id": "32", "name_id":"ZACATECAS*e2a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"ZACATECAS"},
    {"id": "33", "name_id":"EXTRANJERO*e4a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"EXTRANJERO"},
    {"id": "34", "name_id":"NINGUNO*e6a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"NINGUNO"},
    {"id": "35", "name_id":"NO VALIDO SEPOMEX*e8a36c72-5072-e211-b35f-6cae8b2a4ddc","name":"NO VALIDO SEPOMEX"}
  ];
  private titulo_estado = "Selecciona tu Estado";
  
  constructor(
    private formCookieService:formCookiesService, 
    private readJsonService: readJson
  )
  {
    //cookies.setObject('foo', {bar: 'baz'});
    //cookies.setObject('foo', {baaddar: 'bdadadaz'});
    //console.log(cookies.getObject('foo'));
  }
  ngOnInit()
  {
      
      this.inputComponent = this.fase + '.frm_estado_expuesto';
      jQuery(document).ready(function(){
          //Se cambia el titulo del paso actual
          jQuery(".app-menu-title").html(this.titulo_estado);
          //Funcionalidad de div activo para listado de estados
          jQuery('.division-div').click(function() {
              jQuery(this).addClass('active').siblings().removeClass('active')
          });
      });
    //Colocar los estilos a las flechas
    console.log("Antes de agregar el estilo en muestra estados");
    //jQuery(".app-rigth-arrow").addClass("active-right-arrow");

  }

  muestraLineasDeNegocio(estadoSeleccionado) {

    //Guardamos en formapp y en cookie estado seleccionado
    jQuery("#formApp").data("estado", estadoSeleccionado);
    if(this.formCookieService.getCookieByKey("c_form_data","estado") == false) {
      this.formCookieService.appendCookieValue("c_form_data", "estado", estadoSeleccionado);
    }


    console.log("Siguiente paso muestra lineas de negocio" );
    //Ocultamos el selector actual
    jQuery(".col-estados").hide('slow');
    //Cambiamos el titulo
    jQuery(".app-menu-title").html(this.titulo_linea);
    //Mostramos el siguiente selector
    jQuery(".col-lineas-negocio").show('slow');
    jQuery("#secLineasNegocio").show('slow');
    //Cambiar la funcionalidad del boton siguiente
    //jQuery(".app-rigth-arrow").unbind();
    //jQuery(".app-rigth-arrow").bind("click",(event) => this.seleccionarLinea(event));
    //Mostar flecha izquierda
    jQuery(".app-left-arrow").css("visibility", "visible");
    //Colocar el estilo a la flecha derecha
    console.log("Antes de agregar el estilo en mostrar lineas de negocio");
    //jQuery(".app-rigth-arrow").addClass("active-right-arrow");
    //jQuery(".app-left-arrow").addClass("active-right-arrow");
    //Colocar funcionalidad de flecha izquierda
    jQuery(".app-left-arrow").unbind();
    jQuery(".app-left-arrow").bind("click",(event) => this.seleccionarEstado(event));
    
    //PRECARGA DE VALORES
    //Validamos si exixte en la cookie por campaña el valor para linea de negocio
    if(this.formCookieService.getCookieByKey("c_preload_form","nivelInteres") != false) {
      console.log("SI TIENE EL VALOR DE COOKIE POR CAMPAÑA");
      //Ejecutamos click a la linea de negocio correspondiente
      this.clickNivelInteres(this.formCookieService.getCookieByKey("c_preload_form","nivelInteres"));

      //SI no tiene la cookie por la url de campaña, entonces validamos por url de producto para la precarga
    }else if( (jQuery("#h_id_producto").val() != "" && typeof jQuery("#h_id_producto").val() != "undefined") && jQuery("#h_prellenado_formulario_pagina").val() == "true" ) {
      console.log("NODO CARRERAS POR URL");
      var nodo_encontrado = this.readJsonService.buscar("Grupo_carreras", jQuery("#h_id_producto").val(), JSON.parse(localStorage.getItem("jsonCarreras")));
      console.log(nodo_encontrado);
      this.clickLineaPorLineaWeb(nodo_encontrado[0].lineaweb);
    }

    //Añadir a la coockie del formulario el valor de estado
  }

clickLineaPorLineaWeb(lineaweb)
{
    switch (lineaweb) {
      case "PREPARATORIA":
      jQuery(".PREPA").click();
      break;
    case "LICENCIATURA":
      jQuery(".UG").click();
      break;
    case "INGENIERIA":
      jQuery(".ING").click();
      break;
    case "SALUD":
      jQuery(".CS").click();
      break;
    case "POSGRADO":
      jQuery(".POS").click();
      break;
    default:
      break;

  }//Fin del switch
}



  clickNivelInteres(nivelInteres)
  {

    switch (nivelInteres) {
        case "PREPA":
        jQuery(".PREPA").click();
        break;
      case "UG":
        jQuery(".UG").click();
        break;
      case "ING":
        jQuery(".ING").click();
        break;
      case "CS":
        jQuery(".CS").click();
        break;
      case "PG":
        jQuery(".POS").click();
        break;
      default:
        break;

    }//Fin del switch


  }// Fin del metodo

  seleccionarLinea(event)
  {
    if(jQuery("#formApp").data("linea") == "" || typeof jQuery("#formApp").data("linea") == "undefined"){

            console.log("No ha seleccionado la linea de negocio: " + typeof jQuery("#formApp").data("linea"));
            //(".app-menu-title").addClass("parpadea");
            jQuery( ".app-menu-title" ).addClass("parpadea");
            jQuery( "#divisor-menu-app" ).addClass("hr-error");
            jQuery( "#divisor-menu-app" ).addClass("parpadea");
            setTimeout(function(){
                jQuery( ".app-menu-title" ).removeClass( "parpadea" );
                jQuery( "#divisor-menu-app" ).removeClass("parpadea");
                jQuery( "#divisor-menu-app" ).removeClass("hr-error");  
                
            },1000);

            //jQuery('.col-error-app').html(this.error_estado);
            //jQuery('.row-error-app').show();
            //.app-menu-title


        } else {

            console.log("Avanza a productos");
            //Asignar a las flechas los eventos que corresponden
            jQuery(".app-left-arrow").unbind("click");
            jQuery(".app-left-arrow").bind("click",(event) => this.muestraLineasDeNegocio(event));
    
            //jQuery(".app-rigth-arrow").unbind("click");
            //jQuery(".app-rigth-arrow").bind("click",(event) => this.(event, jQuery("#formApp").data("linea")));


            //Ocultamos el selector actual
            jQuery("#secLineasNegocio").hide('slow');
            //Mostramos el siguiente selector
            jQuery("#secProductos").show('slow');

        }
  }

  //Seleccionar estado
  seleccionarEstado(event)
  {
    
    console.log("METODO seleccionarEstado(event) en frm-estado-expuesto.component.ts");
    //Mostramos el siguiente selector
    jQuery("#secLineasNegocio").hide('slow');
    //Ocultar flecha para regresar y quitarle el evento click
    jQuery(".app-left-arrow").unbind("click");
    //jQuery(".app-rigth-arrow").unbind("click");
    //jQuery(".app-rigth-arrow").bind("click",(event) => this.muestraLineasDeNegocio(event));
    jQuery(".app-left-arrow").css("visibility", "hidden");


    //Ocultamos el selector actual
    jQuery(".col-estados").show('slow');
    jQuery(".app-menu-title").html(this.titulo_estado);
        
  }

}//Fin de la clase