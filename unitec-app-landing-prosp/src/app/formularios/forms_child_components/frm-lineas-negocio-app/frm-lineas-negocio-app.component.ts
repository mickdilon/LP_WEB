import {
  Component,
  ViewEncapsulation,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ElementRef,
  ANALYZE_FOR_ENTRY_COMPONENTS
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { reglasInputsService } from "../../forms_services/reglasInputs.service";
import { formCookiesService } from "../../forms_services/formCookies.service";
import { readJson } from "../../../services/readJson.service";
import { sendService } from "../../forms_services/send.service";
import * as _ from 'underscore';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: "frm-lineas-negocio-app",
  templateUrl: "./frm-lineas-negocio-app.component.html",
  styleUrls: ["./frm-lineas-negocio-app.component.scss"]
})
export class frmLineasNegocioAppComponent {
  @Input() formularioPadre;
  @Input() asterisk: boolean;
  @Input() fase: string;
  inputComponent: string;
  private siguiente_paso: string = "productos";
  //Lineas de negocio
  lineasNegocio:any = [
    { id: "PREPARATORIA", name: "Preparatoria", class: "cuadro-prepa PREPA" },
    { id: "LICENCIATURA", name: "Licenciatura", class: "cuadro-lic UG" },
    { id: "INGENIERIA", name: "Ingeniería", class: "cuadro-ing ING" },
    { id: "SALUD", name: "Lic. en Salud", class: "cuadro-salud CS" },
    { id: "POSGRADO", name: "Posgrado", class: "cuadro-pos POS" }
  ];
  //lineasNegocio:any = localStorage.getItem("jsonLinksCategorias");
  //Resultados de la eleccion de la linea de negocio
  carreraResultado: string;
  modalidadResultado: string;
  campusResultado: string;
  preguntaCiclo: string = "¿Cuando quieres entrar?";
  titulo_paso_actual = "Selecciona tu carrera";
  titulo_estado = "Selecciona tu estado";
  titulo_linea = "¿Qué quieres estudiar?";
  titulo_modalidad = "¿Qué modalidad?";
  titulo_capus = "¿En qué campus?";
  titulo_ciclos = "¿En qué periodo escolar?";
  //Configuración de ciclos
  config_ciclos = [
    {
      ciclo: { valor: "18-2", texto: "En enero" },
      subNivelInteres: ["1"],
      idCarreras: [""],
      excluirCarreras: ["35","192", "193", "195", "196", "197"],
      excluirsubNivel: [""],
      excluirCampus: ["REY"]
    },
    {
      ciclo: { valor: "18-3", texto: "En mayo" },
      subNivelInteres: ["2", "3", "7"],
      idCarreras: [""],
      excluirCarreras: ["35", "192", "193", "195", "196", "197"],
      excluirsubNivel: [""],
      excluirCampus: ["REY"]
    },
    {
      ciclo: { valor: "19-1", texto: "En septiembre" },
      subNivelInteres: ["1", "2", "3", "7"],
      idCarreras: [""],
      excluirCarreras: ["35", "192", "193", "195", "196", "197"],
      excluirsubNivel: [""],
      excluirCampus: [""]
    },
    {
      ciclo: { valor: "18-3", texto: "En Mayo" },
      subNivelInteres: ["4", "5", "6"],
      idCarreras: ["35", "192", "193", "195", "196", "197"],
      excluirCarreras: [""],
      excluirsubNivel: ["1", "2", "3", "7"],
      excluirCampus: ["QRO", "LEO", "REY"]
    },
    {
      ciclo: { valor: "19-1", texto: "En Agosto" },
      subNivelInteres: [""],
      idCarreras: ["35"],
      excluirCarreras: ["192", "193", "195", "196", "197"],
      excluirsubNivel: ["1", "2", "3", "4", "5", "6", "7"],
      excluirCampus: ["QRO", "LEO", "REY"]
    }
  ];
  //Preguntas
  pregunta_prepa = "Preparatoria";
  pregunta_lic = "¿Qué Licenciatura?";
  pregunta_ing = "¿Qué Ingeniería?";
  pregunta_salud = "¿Qué Licenciatura?";
  pregunta_posgrado = "¿Qué Posgrado?";
  pregunta_default = "¿Qué Carrera?";

  constructor(
    private regIn: reglasInputsService,
    private readJsonService: readJson,
    private elRef: ElementRef,
    private formCookieService: formCookiesService,
    private sendService: sendService
  ) {
    console.log("Constructor para lineas de negocio::");
    /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
    this.lineasNegocio = JSON.parse(localStorage.getItem("jsonCarrerasCRM"));
    console.log("Lineas de negocio antes de las clases");
    console.log(this.lineasNegocio);
    var that = this;

    function actualizaLineas(){
      for(var lin=0;lin<this.lineasNegocio.length;lin++){

        if(this.lineasNegocio[lin].crmit_name == "PREPARATORIA") {
          this.lineasNegocio[lin]["class"] = "cuadro-prepa PREPA";
        }else if(this.lineasNegocio[lin].crmit_name == "LICENCIATURA") {
          this.lineasNegocio[lin]["class"] = "cuadro-lic UG";
        }else if(this.lineasNegocio[lin].crmit_name == "INGENIERIA") {
          this.lineasNegocio[lin]["class"] = "cuadro-ing ING";
        }else if(this.lineasNegocio[lin].crmit_name == "SALUD") {
          this.lineasNegocio[lin]["class"] == "cuadro-salud CS";
        }else if(this.lineasNegocio[lin].crmit_name == "POSGRADO") {
          this.lineasNegocio[lin]["class"] = "cuadro-pos POS";
        }else {
          this.lineasNegocio[lin]["class"] = "cuadro-lic UG";
        }
        //console.log(this.lineasNegocio[lin]["name"]);
      }
      console.log("DESPUES del asignar las clases");
      console.log(this.lineasNegocio); 
    }
    setTimeout(actualizaLineas.bind(this),500);
  }
  ngOnInit() {
    this.inputComponent = this.fase + ".frm_lineas_negocio_app";
    //Se cambia el titulo del paso actual
    jQuery(".app-menu-title").html(this.titulo_paso_actual);
    //Funcionalidad de div activo para listado de estados
    jQuery(".division-div").click(function() {
      jQuery(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
    });
    jQuery(document).ready(function() {
      //Funcionalidad de div activo para listado de estados
      jQuery(".col-cuadros-contenedor").click(function() {
        //alert("Click en cuadros");
        jQuery(".col-cuadros-contenedor")
          .children(".col-cuadros-lineas")
          .removeClass("active");
        jQuery(this)
          .children(".col-cuadros-lineas")
          .addClass("active");
      });
    });








  }
  muestraProductos(evento, linea) {
    console.log(
      "METODO muestraProductos(evento, linea) en frm-lineas-negocio-app.component.ts"
    );
    console.log("MUESTRA PRODUCTOS LINEA Y EVENTO: ");
    console.log("EVENTO: ");
    console.log(evento);
    console.log("LINEA: ");
    console.log(linea);
    jQuery("#formApp").data("categoria","");
    //Guardamos la linea seleccionada en formApp y en la cookie
    jQuery("#formApp").data("linea", linea);
    if (
      this.formCookieService.getCookieByKey("c_form_data", "linea") == false
    ) {
      this.formCookieService.appendCookieValue("c_form_data", "linea", linea);
    }

    //Limpiar el div para pintar los productos que corresponden cada vez que se llama el metodo
    //jQuery("#secProductos").html("");
    jQuery("#secModalidades").hide("slow");
    //Cambiar titulo dependiendo la carrera
    jQuery(".app-menu-title").html(this.getPreguntaProducto(linea));
    //Cambiar el bind al boton siguiente CORREGIR MUESTRA MODALIDADES
    jQuery(".app-rigth-arrow").unbind("click");
    jQuery(".app-rigth-arrow").bind("click", event =>
      this.muestraModalidades(event)
    );
    //Cambiar el bind al boton atras
    console.log("Bindear para seleccionar lineas");
    jQuery(".app-left-arrow").unbind("click");
    jQuery(".app-left-arrow").bind("click", event =>
      this.seleccionarLinea(event)
    );

    console.log("Siguiente paso muestra productos: ");
    //Ocultar columna de lineas de negocio
    jQuery("#secLineasNegocio").hide("slow");
    //Mostrar la columna de listado de productos
    jQuery("#secProductos").show("slow");
    //Guardar en formApp la linea seleccionada
    jQuery("#formApp").data("linea", linea);
    //Obtener el listado de carreras

    if (
      jQuery("#formApp").data("categoria") == "" ||
      typeof jQuery("#formApp").data("categoria") == "undefined"
    ) {
      console.log("CATEGORIA SELECCIONADA: ");
      console.log(jQuery("#formApp").data("categoria"));
    /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
      let objCarreras = this.getCarrerasCRM(linea);
      //IdDynamics
      console.log("DESPUES DE TRAERNOS LAS NUEVAS CARRERAS DE SOLVIS JEAB:");
      console.log(objCarreras);
      jQuery("#secProductos").html("");
      //Armar el listado y colocarlo en la seccion secProductos
      //Se modifico impresion del nombre de la categoria por ajuste en JSON
      for (var i = 0; i < objCarreras.length; i++) {
        if(objCarreras[i] != undefined){
          //console.log(objCarreras[i][0].carrera + " " + objCarreras[i][0].IdDynamics);
          let iddiv = "div_carrera" + i;
          jQuery("#secProductos").append(
            '<div class="div-productos" id="' +
              iddiv +
              '" #div_carrera style="padding-bottom: 10px;cursor:pointer;" value="' +
              objCarreras[i][0].IdDynamics +
              '" ' +
              "label='"+objCarreras[i][0].carrera+"'>" +
              objCarreras[i][0].carrera +
              "</div>"
          );
          //Seteamos el listener para obtener las modalidades una vez seleccionado la carrera
          let one = i;
          this.elRef.nativeElement
            .querySelector("#div_carrera" + one)
            .addEventListener("click", event => this.muestraModalidades(event));
        }
      }
    } else {
      console.log(
        "Entro en la condicion no para cuando no se selecciona categoria previamente"
      );
      jQuery("#secProductos").html("");
      let objCarreras = this.getCarreras(jQuery("#formApp").data("linea"));
      console.log(objCarreras);
      //Armar el listado y colocarlo en la seccion secProductos
      for (var i = 0; i < objCarreras.length; i++) {
        let iddiv = "div_carrera" + i;
        jQuery("#secProductos").append(
          '<div class="div-productos" id="' +
            iddiv +
            '" #div_carrera style="padding-bottom: 10px;cursor:pointer;" value="' +
            objCarreras[i][0].Grupo_carreras +
            '" ' +
            ">" +
            objCarreras[i][0].Nombre_categoria +
            "</div>"
        );
        //Seteamos el listener para obtener las modalidades una vez seleccionado la carrera
        let one = i;
        this.elRef.nativeElement
          .querySelector("#div_carrera" + one)
          .addEventListener("click", event => this.muestraModalidades(event));
      }
      //Div activo
      jQuery("#" + jQuery("#formApp").data("divCarreraId")).addClass("active");
    }
    //Validar si es prepa avanzar al siguiente paso
    /*if (jQuery("#formApp").data("linea") == "PREPARATORIA") {
      console.log("Es prepa");
      jQuery("#div_carrera0").click();
    }*/

    //Validamos si en la cookie de precarga tiene el valor para el producto
    if(this.formCookieService.getCookieByKey("c_preload_form","idDynamics") != false) {
      
            console.log("Si tiene el valor en la cookie por campaña para la carrera");
            //Ejecutamos click a la linea de negocio correspondiente
            try {
            this.clickProducto(this.formCookieService.getCookieByKey("c_preload_form","idDynamics"));
            }catch(err) {
              console.log("En el click para producto" + err);
            }
            
    }else if( (jQuery("#h_id_producto").val() != "" && typeof jQuery("#h_id_producto").val() != "undefined") && jQuery("#h_prellenado_formulario_pagina").val() == "true") {
      var nodo_encontrado = this.readJsonService.buscar("Grupo_carreras", jQuery("#h_id_producto").val(), JSON.parse(localStorage.getItem("jsonCarreras")));
      this.clickProducto(nodo_encontrado[0].IdDynamics);
    }




  } //Termina paso para mostrar productos

  //Metodo para darle click al producto
  clickProducto(idDynamics)
  {
    console.log("Click producto " + idDynamics);
    /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
    var nodo_encontrado = this.readJsonService.buscar("IdDynamics", idDynamics, JSON.parse(localStorage.getItem("jsonCarreras")));
    try {
      setTimeout(function(){
        try{
          jQuery(".div-productos[value='" + nodo_encontrado[0].Grupo_carreras + "']").click();
        }catch(err) {
          console.log("En el click a pregunta" + err);
        }
      }, 500);
      
    }catch(err) {
      console.log("No existe el atributo para el click" + err);
    }
  }


  //Metodo para seleccionar la linea de negocio
  seleccionarLinea(event) {
    console.log(
      "METODO seleccionarLinea(event) en frm-lineas-negocio-app.component.ts"
    );
    //Cambio de titulo
    jQuery(".app-menu-title").html(this.titulo_linea);
    //Mostar flecha izquierda
    jQuery(".app-left-arrow").css("visibility", "visible");
    //Binding de las flechas de navegacion
    jQuery(".app-left-arrow").unbind("click");
    jQuery(".app-left-arrow").bind("click", event =>
      this.seleccionarEstado(event)
    );
    jQuery(".app-rigth-arrow").unbind("click");
    jQuery(".app-rigth-arrow").bind("click", event =>
      this.muestraProductos(event, jQuery("#formApp").data("linea"))
    );

    //Ocultar las categorias correspondientes y mostrar seleccionar linea
    jQuery("#secProductos").hide("slow");
    jQuery(".col-estados").hide("slow");
    jQuery("#secLineasNegocio").show("slow");
  }
  //Seleccionar estado
  seleccionarEstado(event) {
    console.log(
      "METODO seleccionarEstado(event) en frm-lineas-negocio-app.component.ts"
    );
    //Bindear la flecha derecha para avanzar a mostrar las lineas
    jQuery(".app-rigth-arrow").unbind("click");
    jQuery(".app-rigth-arrow").bind('click', event =>
      this.seleccionarLinea(event)
    );

    // Mostramos el siguiente selector
    jQuery("#secLineasNegocio").hide("slow");
    // Ocultar flecha para regresar y quitarle el evento click
    jQuery(".app-left-arrow").unbind("click");
    jQuery(".app-left-arrow").css("visibility", "hidden");
    // Ocultamos el selector actual
    jQuery(".col-estados").show("slow");
    jQuery(".app-menu-title").html(this.titulo_estado);
  }
  seleccionarModalidad(evento) {
    if (jQuery(".div-productos").hasClass("active") == false) {
      console.log("No ha seleccionado la modalidad");
      // (".app-menu-title").addClass("parpadea");
      jQuery(".app-menu-title").addClass("parpadea");
      jQuery("#divisor-menu-app").addClass("hr-error");
      jQuery("#divisor-menu-app").addClass("parpadea");
      setTimeout(function() {
        jQuery(".app-menu-title").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("hr-error");
      }, 1000);

      // jQuery('.col-error-app').html(this.error_estado);
      // jQuery('.row-error-app').show();
      // .app-menu-title
    } else {
      console.log("Avanza a modalidad");
      // Ocultamos el selector actual
      jQuery("#secModalidades").hide("slow");
      // Mostramos el siguiente para campus
      jQuery("#secCampus").show("slow");
    }
  }
  // calcula el nivelInteres dependiendo la linea
  getPreguntaProducto(linea) {
    let value;
    switch (linea) {
      case "PREPARATORIA":
        value = this.pregunta_prepa;
        break;
      case "LICENCIATURA":
        value = this.pregunta_default;
        break;
      case "INGENIERIA":
        value = this.pregunta_ing;
        break;
      case "SALUD":
        value = this.pregunta_salud;
        break;
      case "POSGRADO":
        value = this.pregunta_posgrado;
        break;
      default:
        value = this.pregunta_default;
        break;
    }
    return value;
  } // Termina pregunta producto

  muestraModalidades(evento) {
    console.log(
      "METODO muestraModalidades(event) en frm-lineas-negocio-app.component.ts"
    );
    let ev = evento.srcElement || evento.target;
    console.log("VEMOS EL EVENTO SOLVIS");
    console.log(ev);

    // COLOCAR LA CLASE ACTIVA AL ELEMENTO
    // Si no existe el id del evento buscamos el id del elemento que fue seleccionado previamente
    let ev_id = jQuery(".div-productos.active").attr("id");
    let ev_value = jQuery(".div-productos.active").attr("value");
    // Binding a las flechas
    jQuery(".app-left-arrow").unbind("click");
    jQuery(".app-left-arrow").bind("click", event =>
      this.muestraProductos(event, jQuery("#formApp").data("linea"))
    );
    jQuery(".app-rigth-arrow").unbind("click");
    jQuery(".app-rigth-arrow").bind("click", event =>
      this.muestraCampus(event)
    );
    if (
      (jQuery("#formApp").data("categoria") == "" ||
        typeof jQuery("#formApp").data("categoria") == "undefined") &&
      (typeof ev.id == "undefined" || ev.id == "")
    ) {
      jQuery(".app-menu-title").addClass("parpadea");
      jQuery("#divisor-menu-app").addClass("hr-error");
      jQuery("#divisor-menu-app").addClass("parpadea");
      setTimeout(function() {
        jQuery(".app-menu-title").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("hr-error");
      }, 1000);
    } else {
      // Colocar la clase active al elemento seleccionado, solo si viene de un evento click de un elemento con id
      if (
        typeof ev.id != "undefined" ||
        (ev_id != "" || typeof ev_id != "undefined")
      ) {
        try {
          // Limpiar el metodo de modalidades para cada vez que se ejecuta el metodo
          // Titulo para modalidades
          jQuery(".app-menu-title").html(this.titulo_modalidad);
          // Bindear para regresar a carreras
          jQuery(".app-left-arrow").unbind();
          let linea = jQuery("#formApp").data("linea");
          jQuery(".app-left-arrow").bind("click", event =>
            this.muestraProductos(event, linea)
          );
          // Variables de busqueda para las modalidades
          let keySearch = "Grupo_carreras";
          // Validamos si viene de un evento o si fue click de una flecha
          if (typeof ev.id == "undefined" || ev.id == "") {
            jQuery("#" + ev_id)
              .addClass("active")
              .siblings()
              .removeClass("active");
            var grupoCarrera = ev_value;
            jQuery("#formApp").data("divCarreraId", ev_id);
          } else {
            jQuery("#" + ev.id)
              .addClass("active")
              .siblings()
              .removeClass("active");
            var grupoCarrera = ev.attributes.value.nodeValue;
            jQuery("#formApp").data("divCarreraId", ev.id);
          }
          console.log("DESPUES DE INDENTIFICAR SI FUE UN DIV O UNA FLECHA EN MUESTRA MODLIDADES:");
          console.log(grupoCarrera);
          console.log("ETIQUETA SOLVIS PARA ASIGNAR CARRERA");
          console.log(grupoCarrera);

          jQuery("#"+ev.id).attr("label");
          jQuery("#formApp").data("carrera","poner aqui carrera");
          // Obtener el id de carrera para ir al json de modalidades y traer las correspondientes SOLVIS:
              /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
          var idCarreraSolvis = grupoCarrera;
          let arrayCodigosUnicos = [];
          let objJsonCodigosUnicos = JSON.parse(
            localStorage.getItem("jsonProductosCRM")
          );
          arrayCodigosUnicos = this.readJsonService.buscar(
            "carrera_codigounico",
            idCarreraSolvis,
            objJsonCodigosUnicos
          );
          console.log("TRAER EL ARRAY CON CODIGOS UNICOS:");
          console.log(arrayCodigosUnicos);
          console.log("MODALIDAD PARA IR POR MODALIDADES: " + arrayCodigosUnicos[0].modalidad_crmit_codigounico);
          // jsonModalidadCRM
          let arraModalidadesCodigos = [];
          let objJsonModalidadesUnicos = JSON.parse(
            localStorage.getItem("jsonModalidadCRM")
          );
          console.log("Antes de for: " + arrayCodigosUnicos.length + "  " + arrayCodigosUnicos[0].modalidad_crmit_codigounico);
          for(var xx=0;xx<arrayCodigosUnicos.length;xx++) {
            arraModalidadesCodigos[xx] = this.readJsonService.buscar(
              "crmit_codigounico",
              arrayCodigosUnicos[xx].modalidad_crmit_codigounico,
              objJsonModalidadesUnicos
            );
          }
          console.log("DESPUES DE CONSULTAR LAS MODALIDADES SOLVIS: ");
          console.log(arraModalidadesCodigos);

          // Guardamos el grupo carrera en formApp y en cookie
          jQuery("#formApp").data("categoria", grupoCarrera);
          if (
            this.formCookieService.getCookieByKey("c_form_data", "categoria") ==
            false
          ) {
            this.formCookieService.appendCookieValue(
              "c_form_data",
              "categoria",
              grupoCarrera
            );
          }
          // Reseteamos modalidad
          jQuery("#formApp").data("modalidad", "");
          if (
            jQuery("#formApp").data("modalidad") == "" ||
            typeof jQuery("#formApp").data("modalidad") == "undefined"
          ) {
            jQuery("#secModalidades .row").html("");
            let arrayModalidadesGrupo = [];
            let objJsonCarreras = JSON.parse(
              localStorage.getItem("jsonModalidadCRM")
            );
            arrayModalidadesGrupo = this.readJsonService.buscar(
              "crmit_codigounico",
              grupoCarrera,
              objJsonCarreras
            );
            // Formamos el arreglo para el nuevo div de modalidades
            let modalidadesParaSelect = [];
            let id;
            let value;
            console.log("REVISAR MODALIDADES");
            console.log(arraModalidadesCodigos);
            // Dependiendo el id se cargan las modalidades
            for (var i in arraModalidadesCodigos) {
              console.log("DENTRO DEL FOR: SOL" + arraModalidadesCodigos[0][i].crmit_name);
              // Ajustar modalidades por id
              switch (arraModalidadesCodigos[0][i].crmit_name) {
                case "PRESENCIAL":
                  id = arraModalidadesCodigos[0][i].crmit_name;
                  value = "Presencial";
                  break;
                case "EJECUTIVA":
                  id = arraModalidadesCodigos[0][i].crmit_name;
                  value = "Ejecutiva";
                  break;
                case "EN LINEA":
                  id = arraModalidadesCodigos[0][i].crmit_name;
                  value = "En Línea";
                  break;
                case "FLEXIBLE":
                  id = arraModalidadesCodigos[0][i].crmit_name;
                  value = "Flexible";
                  break;
                case "HIBRIDA":
                  id = arraModalidadesCodigos[0][i].crmit_name;
                  value = "Híbrida";
                  break;
                default:
                  id = arraModalidadesCodigos[0][i].crmit_name;
                  value = "Presencial";
              }
              console.log("VAlores asignados en el switch: ");
              console.log(id);
              console.log(value);
              // Se agregan las modalidades al div correspondiente
              let iddiv = "div_modalidad" + i;
              if (value == "Presencial") {
                var mod_class = "cuadro-pres";
              } else if (value == "Ejecutiva") {
                var mod_class = "cuadro-eje";
              } else {
                var mod_class = "cuadro-enlinea";
              }

              jQuery("#secModalidades .row").append(
                '<div class="col-6 col-cuadros-contenedor div-padre-modalidad" modalidad="'+value+'" id="' +
                  iddiv +
                  '" #div_modalidad value="' +
                  id +
                  '" ' +
                  ">" +
                  '<div class="col-12 col-cuadros-modalidades" >' +
                  '<div class="imagen-lineas-cuadros ' +
                  mod_class +
                  '" id="' +
                  iddiv +
                  '" value="' +
                  id +
                  '">\
                  </div>\
                  <div class="titulo-lineas-cuadros" id="'+iddiv+'" value="'+id+'" style="text-align:center;">' +
                  value +
                  "</div>" +
                  "</div>" +
                  "</div>"
              );
              // Seteamos el listener
              let one = i;
              this.elRef.nativeElement
                .querySelector("#div_modalidad" + one)
                .addEventListener("click", event => this.muestraCampus(event));
            }
          }
          /** Si solo hay una modalidad pasamos automaticamente al siguiente nivel (Seleccionar campus)*/
          /*if(arrayModalidadesGrupo.length == 1) {
                            jQuery("#div_modalidad0").click();
                        }*/
        } catch (err) {
          console.log("ERROR");
        }
      }
      // IMPLEMENTACION DE SELECCION DE MODALIDAD
      console.log("IMPLEMENTACION MODALIDADES: ");
      // getCookieByKey("c_preload_form","idDynamics")
      console.log(this.formCookieService.getCookieByKey("c_preload_form","idDynamics"));
      /*this.clickModalidad(
        this.formCookieService.getCookieByKey("c_preload_form","idDynamics"), 
        this.formCookieService.getCookieByKey("c_preload_form","subnivelInteres")
      );*/
    /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
      if( (jQuery("#h_id_producto").val() != "" && typeof jQuery("#h_id_producto").val() != "undefined") && jQuery("#h_prellenado_formulario_pagina").val() == "true") {
        var nodo_encontrado = this.readJsonService.buscar("Grupo_carreras", jQuery("#h_id_producto").val(), JSON.parse(localStorage.getItem("jsonCarreras")));
        console.log("Dentro de nodo encontrado:  ");
        console.log(nodo_encontrado);
        // if(nodo_encontrado.length == 1) {
          // this.clickModalidad(nodo_encontrado[0].IdDynamics,this.calculaSubNivelInteres(nodo_encontrado[0].interes,nodo_encontrado[0].modalidad,nodo_encontrado[0].lineaweb));
          // this.clickModalidad(nodo_encontrado[0].IdDynamics,nodo_encontrado[0].interes);
        // }
      }
      

      // Ocultamos el listado de productos
      jQuery("#secProductos").hide("slow");
      jQuery("#secCampus").hide("slow");
      // Mostramos las carreras
      jQuery("#secModalidades").show("slow");
    }
    // fin del else
  } // Termina muestra modalidades


    // Metodo para darle click al producto
  clickModalidad(idDynamics, subNivelInteres)
  {
      // Click a la modalidad por subnivel de interes
      var modalidad = this.getModalidadPorSubnivel(subNivelInteres);
      console.log("Click a modalidad " + subNivelInteres);
      setTimeout(function(){
        jQuery(".div-padre-modalidad[modalidad='"  + modalidad + "']").click();
      }, 500);
  }

  // Mostrar los campus de acuerdo a la modalidad seleccionada
  muestraCampus(evento) {
    console.log(
      "METODO: muestraCampus(evento) wn frm-lineas-negocio-app-component.ts"
    );
    // Mostrar flecha derecha
    jQuery(".app-rigth-arrow").css("visibility", "visible");
    // Binding a las flechas
    jQuery(".app-left-arrow").unbind("click");
    jQuery(".app-left-arrow").bind("click", event =>
      this.muestraModalidades(event)
    );

    jQuery(".app-rigth-arrow").unbind("click");
    jQuery(".app-rigth-arrow").bind("click", event =>
      this.muestraCiclos(event)
    );

    // Obtencion de valores de localstorage
    var ev = evento.srcElement || evento.target;
    console.log("EVENTO SOLVIS CAMPUS + ");
    console.log(ev);
    // Si no existe el id del evento buscamos el id del elemento que fue seleccionado previamente
    var ev_id = jQuery(".col-cuadros-modalidades.active").attr("id");
    var ev_value = jQuery(".col-cuadros-modalidades.active").attr("value");
    console.log("ID CUANDO NO TRAE EL EVENTO:" + ev_id);
    console.log("VALOR CUANDO NO TRAE EL EVENTO:" + ev_value);
    // Si se ejecuto la accion por medio de las flechas eliminamos la cookie de url para que el prospecto pueda seleccionar
    if(typeof ev.id == "undefined" || ev.id == "") {
      console.log("SE ELIMINA COOKIE DE URL PARA QUE EL PROSPECTO PUEDA SELECCIONAR");
      this.formCookieService.removeCookie("c_preload_form");
    }

    // Validar que exista una modalidad seleccionada
    console.log("Antes de entrar a validacion de modalidad en muestra campus");
    console.log(jQuery("#formApp").data("modalidad"));

    if (
      (jQuery("#formApp").data("modalidad") == "" ||
        typeof jQuery("#formApp").data("modalidad") == "undefined") &&
      (typeof ev.id == "undefined" || ev.id == "")
    ) {
      console.log(
        "No ha seleccionado la modalidad: " +
          typeof jQuery("#formApp").data("modalidad")
      );
      // (".app-menu-title").addClass("parpadea");
      jQuery(".app-menu-title").addClass("parpadea");
      jQuery("#divisor-menu-app").addClass("hr-error");
      jQuery("#divisor-menu-app").addClass("parpadea");
      setTimeout(function() {
        jQuery(".app-menu-title").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("hr-error");
      }, 1000);
    } else {
      console.log("ENTRO EN MUESTRA CAMPUS");
      // Limpiar la seccion de campus
      // jQuery("#secCampus .row").html("");
      jQuery("#secCiclos").hide("slow");

      // Mostrar y ocultar las secciones correspondientes
      jQuery("#secCampus").show("slow");

      // Colocar el elemento con la clase active
      jQuery(".col-cuadros-contenedor")
        .children(".col-cuadros-modalidades")
        .removeClass("active");

      jQuery(".app-menu-title").html(this.titulo_capus);
      // Bindear la flecha izquierda para ir a modalidad
      jQuery(".app-left-arrow").unbind();
      jQuery(".app-left-arrow").bind("click", event =>
        this.muestraModalidades(event)
      );

      if (
        typeof ev.id != "undefined" ||
        (ev_id != "" || typeof ev_id != "undefined")
      ) {
        try {
          // Validamos si viene de un evento o si fue click de una flecha
          if (typeof ev.id == "undefined" || ev.id == "") {
            jQuery("#" + ev_id)
              .children(".col-cuadros-modalidades")
              .addClass("active");
            var IdDynamics = jQuery("#formApp").data("idCarrera");
          } else {
            jQuery("#" + ev.id)
              .children(".col-cuadros-modalidades")
              .addClass("active");
            var IdDynamics = ev.attributes.value.nodeValue;
          }
              /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
          console.log("ID dynamics en muestra campus: " + IdDynamics);
          let keySearch = "IdDynamics";
          let arrayCampusIdDynamics = [];
          let objJsonCarreras = JSON.parse(
            localStorage.getItem("jsonCarreras")
          );
          arrayCampusIdDynamics = this.readJsonService.buscar(
            keySearch,
            IdDynamics,
            objJsonCarreras
          );
          /*let arrayNombresCortos = arrayCampusIdDynamics[0].campus[0].split(
            ","
          );*/
          let campus;
          console.log("RESULTADOS JSON EN MUESTRA CAMPUS - REVISAR SUBNIVEL DE INTERES");
          console.log(arrayCampusIdDynamics);
          // Asignación de variables a formApp data y cookie
          // let carrera = arrayCampusIdDynamics[0].nombre;
          // let subnivelinteres = arrayCampusIdDynamics[0].interes;

          // console.log( "Array Dinamics Linea: " + arrayCampusIdDynamics[0].lineaweb );
          // console.log( "Subnivel de Interes Revisar: " + subnivelinteres );

          /*let nivelInteres = this.getNivelInteres(
            arrayCampusIdDynamics[0].lineaweb
          );*/
          // let modalidad = arrayCampusIdDynamics[0].modalidad;
          // let lineaweb = arrayCampusIdDynamics[0].lineaweb;
          console.log("ANTES DE ASIGNAR CARRERA SOLVISSSSS");
          console.log(arrayCampusIdDynamics);
          // jQuery("#formApp").data("carrera", carrera);
          jQuery("#formApp").data("idCarrera", IdDynamics);
          // Calculamos el subnivel de interes
          // let subNivelCalculado = this.calculaSubNivelInteres(subnivelinteres, modalidad, lineaweb );
          // let subNivelCalculado = subnivelinteres;
          // console.log( "Nivel Calculado: " + nivelInteres);
          // console.log( "Subnivel Calculado: " + subNivelCalculado);

          // Query("#formApp").data("subnivelinteres", subNivelCalculado);
          // jQuery("#formApp").data("nivelInteres", nivelInteres);
          // jQuery("#formApp").data("modalidad", modalidad);
          // Carrera
          if (
            this.formCookieService.getCookieByKey("c_form_data", "carrera") ==
            false
          ) {
            this.formCookieService.appendCookieValue(
              "c_form_data",
              "carrera",
              "ponercarrera"
            );
          }
          // IdCarrera
          if (
            this.formCookieService.getCookieByKey("c_form_data", "idCarrera") ==
            false
          ) {
            this.formCookieService.appendCookieValue(
              "c_form_data",
              "idCarrera",
              IdDynamics
            );
          }
          // subnivelinteres
          if (
            this.formCookieService.getCookieByKey(
              "c_form_data",
              "subnivelinteres"
            ) == false
          ) {
            // this.formCookieService.appendCookieValue(
            //   "c_form_data",
            //   "subnivelinteres",
            //   subnivelinteres
            // );

            /**Update by SRP */
            this.formCookieService.appendCookieValue(
              "c_form_data",
              "subnivelinteres",
              "subnivelcalculado"
            );
            /**Update by SRP */
          }
          // nivelInteres
          if (
            this.formCookieService.getCookieByKey(
              "c_form_data",
              "nivelInteres"
            ) == false
          ) {
            this.formCookieService.appendCookieValue(
              "c_form_data",
              "nivelInteres",
              "nivelinteresrevisar"
            );
          }
          // modalidad
          if (
            this.formCookieService.getCookieByKey("c_form_data", "modalidad") ==
            false
          ) {
            this.formCookieService.appendCookieValue(
              "c_form_data",
              "modalidad",
              "modalidadrevisar"
            );
          }

    /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */

          var id_carrera_para_traer_campus = jQuery("#formApp").data("categoria");
          // Traer de campus_nivel el id unico del json de campus para mostrarlos por solvis
          console.log("ID dynamics en muestra campus: " + id_carrera_para_traer_campus);
          let arraycodigosunicoscampus = [];
          let objJsonCodigosUnicosCampus = JSON.parse(
            localStorage.getItem("jsonProductosCRM")
          );
          arraycodigosunicoscampus = this.readJsonService.buscar(
            "carrera_codigounico",
            id_carrera_para_traer_campus,
            objJsonCodigosUnicosCampus
          );
          console.log("CODIGOS UNICOS EN CAMPUS SOLVIS: ");
          console.log(arraycodigosunicoscampus);
          // Traemos los campus correspondientes del json de campus
          let arraymostrarcampus = [];
          let objJsonloscampus = JSON.parse(
            localStorage.getItem("jsonCampusCRM")
          );
          var id_campus_unico = 0;
          for(var l=0; l<arraycodigosunicoscampus.length; l++){
            id_campus_unico = arraycodigosunicoscampus[l].campus_crmit_codigounico;
            arraymostrarcampus = arraymostrarcampus.concat(this.readJsonService.buscar(
              "crmit_tb_campusid",
              id_campus_unico,
              objJsonloscampus
            ));
          }
          console.log("LOS CAMPUS CORRESPONDIENTES DE SOLVIS:");
          console.log(arraymostrarcampus);




          // console.log(arrayCampusIdDynamics);
          jQuery("#formApp").data("campus", "");
          // Solo entra al for para reconstruir si es nuevo registro
          if (
            jQuery("#formApp").data("campus") == "" ||
            typeof jQuery("#formApp").data("campus") == "undefined"
          ) {
            jQuery("#secCampus .row").html("");

            for (var i in arraymostrarcampus) {
              if (arraymostrarcampus[i].crmi_name == "ATIZAPAN") {
                var campus_class = "cuadro-atz";
              } else if (arraymostrarcampus[i].crmi_name == "MARINA") {
                var campus_class = "cuadro-mar";
              } else if (arraymostrarcampus[i].crmi_name == "ECATEPEC") {
                var campus_class = "cuadro-eca";
              } else if (arraymostrarcampus[i].crmi_name == "GUADALAJARA") {
                var campus_class = "cuadro-gdl";
              } else if (arraymostrarcampus[i].crmi_name == "LEON") {
                var campus_class = "cuadro-leo";
              } else if (arraymostrarcampus[i].crmi_name == "SUR") {
                var campus_class = "cuadro-sur";
              } else if (arraymostrarcampus[i].crmi_name == "CUITLAHUAC") {
                var campus_class = "cuadro-cui";
              } else if (arraymostrarcampus[i].crmi_name == "TOLUCA") {
                var campus_class = "cuadro-tol";
              } else if (arraymostrarcampus[i].crmi_name == "QUERETARO") {
                var campus_class = "cuadro-qro";
              } else if (arraymostrarcampus[i].crmi_name == "REYES") {
                var campus_class = "cuadro-rey";
              } else {
                var campus_class = "cuadro-atz";
              }

              campus = arraymostrarcampus[i].crmi_name
              let iddiv = "div_campus" + i;
              jQuery("#secCampus .row").append(
                '<div class="col-6 col-cuadros-contenedor div-padre-campus" id="' +
                  iddiv +
                  '" #div_campus value="' +
                  arraymostrarcampus[0].crmi_name +
                  '" ' +
                  ">" +
                  '<div class="col-12 col-cuadros-campus">' +
                  '<div class="imagen-lineas-cuadros ' +
                  campus_class +
                  '" id="' +
                  iddiv +
                  '" value="' +
                  arraymostrarcampus[0].crmi_name +
                  '">\
                  </div>\
                  <div class="titulo-lineas-cuadros" id="'+iddiv+'" value="'+arraymostrarcampus[0].crmi_name+'" style="text-align:center;">' +
                  campus +
                  "</div>" +
                  "</div>" +
                  "</div>"
              );
              // Seteamos el listener
              let one = i;
              this.elRef.nativeElement
                .querySelector("#div_campus" + one)
                .addEventListener("click", event => this.muestraCiclos(event));
            }

            // IMPLEMENTACION DE SELECCION DE CAMPUS
            console.log("IMPLEMENTACION CAMPUS: ");
            console.log(this.formCookieService.getCookieByKey("c_preload_form","campus"));
            this.clickCampus(this.formCookieService.getCookieByKey("c_preload_form","campus"));


          }

          // Si solo existe una campus pasamos al siguiente nivel
          /*if(arrayNombresCortos.length == 1) {
                            jQuery("#div_campus0").click();
                        }*/
        } catch (error) {
          console.log("Error sin id para operaciones ");
        }
      }
      // Ocultamos las modalidades
      jQuery("#secModalidades").hide("slow");
      // Ocultamos los ciclos
      // jQuery("#secCiclos").show("slow");
    } // Fin del else de validacion
  } // Termina muestra campus

  // Calcula el subniveldeInteres por medio del nivelInteres
  calculaSubNivelInteres(nivelInteres, modalidad, lineaweb)
  {
    console.log( "Funcion calculaSubInteres nivelInteres: " + nivelInteres + " Modalidad: " + modalidad + " lineaweb: " + lineaweb );
      let subniveldeInteres:any;
      // Recibe el nivelInteres de JSON
      if(nivelInteres == 1) {
        return "7";
      }else if(nivelInteres == 2 && lineaweb != "SALUD" ) {
        return "2";
      }else if(nivelInteres == 3) {
        return "3";
      }else if(nivelInteres == 4) {
        return "4";
      }else if(nivelInteres == 5 && modalidad == 1) {
        return "2";
      }else if(nivelInteres == 5 && modalidad == 2) {
        return "3";
      }else if(nivelInteres == 5 && modalidad == 3){
        return "4";
      }else if (lineaweb == "SALUD" && nivelInteres == 2 ) {
        return "1";
      }else if(nivelInteres == 6) {
        return "5";
      }else if(nivelInteres == 7) {
        return "6";
      }else if(nivelInteres == 8) {
        return "5";
      }else if(nivelInteres == 9) {
        return "5";
      }else if(nivelInteres == 10){
        return "6";
      }


  }



    // Metodo para darle click al producto
    clickCampus(campus)
    {
        console.log("Click a campus " + campus);
        setTimeout(function(){
          jQuery(".div-padre-campus[value='"  + campus + "']").click();
        }, 500);
    }


  // Muestra la seleccion de ciclos versión aplicación
  muestraCiclos(evento) {
    console.log(
      "METODO: muestraCiclos(evento) wn frm-lineas-negocio-app-component.ts"
    );
    // Bindear las flechas
    // Binding a las flechas
    jQuery(".app-left-arrow").unbind("click");
    jQuery(".app-left-arrow").bind("click", event => this.muestraCampus(event));
    // Quitamos el evento a la flecha hacia la derecha por que es el ultimo paso
    jQuery(".app-rigth-arrow").unbind("click");
    jQuery(".app-left-arrow").css("visibility","hidden");
    // Realizar la validacion para saber si selecciono el campus
    let ev = evento.srcElement || evento.target;
    console.log("Evento en muestro ciclos");
    console.log(ev);
    // Si no existe el id del evento buscamos el id del elemento que fue seleccionado previamente
    // Cambiamos a campus las clases JEAB
    var ev_id = jQuery(".col-cuadros-campus.active").attr("id");
    var ev_value = jQuery(".col-cuadros-campus.active").attr("value");
    console.log("ID CICLOS CUANDO NO TRAE EL EVENTO:" + ev_id);
    console.log("VALOR CICLOS CUANDO NO TRAE EL EVENTO:" + ev_value);

    if (
      (jQuery("#formApp").data("campus") == "" ||
        typeof jQuery("#formApp").data("campus") == "undefined") &&
      (typeof ev.id == "undefined" || ev.id == "")
    ) {
      console.log(
        "No ha seleccionado un campus: " +
          typeof jQuery("#formApp").data("campus")
      );
      jQuery(".app-menu-title").addClass("parpadea");
      jQuery("#divisor-menu-app").addClass("hr-error");
      jQuery("#divisor-menu-app").addClass("parpadea");
      setTimeout(function() {
        jQuery(".app-menu-title").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("hr-error");
      }, 1000);
    } else {
      console.log("Entra a muestra ciclos");
      jQuery(".app-rigth-arrow").css("visibility", "hidden");
      // TITULO CORRESPONDIENTE
      jQuery(".app-menu-title").html(this.titulo_ciclos);
      // Mostrar botón para poder enviar formulario
      jQuery("#enviarTrd").show("slow");

      // Limpiar los div de ciclos
      jQuery("#secCiclos .row").html("");
      console.log("Mostrar seleccion de ciclos");

      // Clase active al elemento seleccionado
      // Colocar el elemento con la clase active
      jQuery(".col-cuadros-contenedor")
        .children(".col-cuadros-campus")
        .removeClass("active");

      // Validamos si viene de un evento o si fue click de una flecha
      if (typeof ev.id == "undefined" || ev.id == "") {
        jQuery("#" + ev_id)
          .children(".col-cuadros-campus")
          .addClass("active");
        console.log("EL ID DEL EVENTO EN MUESTRA CICLOS: #" + ev_id);
        var campus = ev_value;
      } else {
        jQuery("#" + ev.id)
          .children(".col-cuadros-campus")
          .addClass("active");
        console.log("EL ID DEL EVENTO EN MUESTRA CICLOS: #" + ev.id);
        var campus = ev.attributes.value.nodeValue;
      }

      // Bindear la flecha izquierda para ir a campus
      jQuery(".app-left-arrow").unbind();
      jQuery(".app-left-arrow").bind("click", event =>
        this.muestraCampus(event)
      );

      // Guarda los valores en formApp y en cookie
      // Campus corto
      jQuery("#formApp").data("campus", campus);
      // Transformacion a campus corto por solvis JEAB
      var campus_corto;
      switch (campus) {
        case "ATIZAPAN":
        campus_corto = "ATZ";
          break;
        case "CUITLAHUAC":
        campus_corto = "CUI";
          break;
        case "ECATEPEC":
        campus_corto = "ECA";
          break;
        case "MARINA":
        campus_corto = "MAR";
          break;
        case "SUR":
        campus_corto = "SUR";
          break;
        case "LEON":
        campus_corto = "LEO";
          break;
        case "TOLUCA":
        campus_corto = "TOL";
          break;
        case "EN LINEA":
        campus_corto = "ONL";
          break;
        case "GUADALAJARA":
        campus_corto = "GDL";
          break;
        case "QUERETARO":
        campus_corto = "QRO";
          break;
        case "REYES":
        campus_corto = "REY";
        break;
      } 
      jQuery("#formApp").data("campus", campus_corto);
      jQuery("#formApp").data("campusLargo", campus);
     



      if (
        this.formCookieService.getCookieByKey("c_form_data", "campus") == false
      ) {
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "campus",
          campus
        );
      }
      // Campus largo
      jQuery("#formApp").data("campusLargo", this.campusNombreLargo(campus));
      if (
        this.formCookieService.getCookieByKey("c_form_data", "campusLargo") ==
        false
      ) {
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "campusLargo",
          this.campusNombreLargo(campus)
        );
      }
      this.carreraResultado = jQuery("#formApp").data("categoria");
      this.modalidadResultado = this.getNombreModalidad(
        jQuery("#formApp").data("modalidad")
      );
      this.campusResultado = jQuery("#formApp").data("campusLargo");
      // Cuando se eligieron todas las posibles variables mostramos el select de ciclo
      this.construyeInputciclos();
      jQuery("#secCampus").hide("slow");
      jQuery("#secCiclos").show("slow");
    }
  }

  // Trae las carreras del json de carreras que se cargo al inicio de la aplicacion en localstorage
  // Modificacion a la funcion para la obtencion de carreras por ajuste en los JSON 09-10-2017
  getCarreras(linea, campus = "") {
    // jQuery("#select_lineas").html("");
    let keySearch = "lineaweb";
    let arrayCarrerasPorLinea = [];
    let objJsonCarreras = JSON.parse(localStorage.getItem("jsonCarreras"));
    arrayCarrerasPorLinea = this.readJsonService.buscar(
      keySearch,
      linea,
      objJsonCarreras
    );
    // IMPLEMENTACION DE LISTADO DE CARRERAS POR COOKIE
    // si tiene la cookie de subnivel de interes obtener del arreglo solo con el subnivel de interes que viene en la url
    // OBTENER EL SUBNIVEL DE INTERES DE LA COOKIE
    let subnivelInteresCookie:any = this.formCookieService.getCookieByKey("c_preload_form","subnivelInteres");
    if(subnivelInteresCookie != "" && subnivelInteresCookie.toUpperCase() != "X" && typeof subnivelInteresCookie != "undefined") {
      var arrayCarrerasPorSubnivel = this.readJsonService.buscar(
        "modalidad",
        this.getModalidadPorSubnivel(subnivelInteresCookie),
        arrayCarrerasPorLinea
      );
      if(arrayCarrerasPorSubnivel.length > 0) {
        arrayCarrerasPorLinea = arrayCarrerasPorSubnivel;
      }
    }
    // console.log("Las carreras por linea CON DUPLICADOS");
    // console.log(arrayCarrerasPorLinea);
    // Construimos el arreglo para la vista
    // Closure para ordenar
    var filter: any;
    var compare = function(filter) {
      return function(a, b) {
        var a = a[filter],
          b = b[filter];
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      };
    };
    // Seteamos el filtro y ordenamos por grupo_carreras
    // filter = compare("Grupo_carreras");
    filter = compare("nombre");
    // Eliminar duplicados
    arrayCarrerasPorLinea = this.readJsonService.removeDuplicates(
      arrayCarrerasPorLinea,
      "Grupo_carreras"
    );
    // console.log("Las carreras por linea sin duplicados");
    // console.log(arrayCarrerasPorLinea);
    // Ordernar por nombre
    // arrayCarrerasPorLinea.sort(filter);
    // Formamos el arreglo para el nuevo div
    let carrerasParaSelect = [];
    for (var i in arrayCarrerasPorLinea) {

      // Modificacion para traer el nombre de las categorias por ajuste en los json 09-10-2017 JEAB
      // let objJsonCarreras = JSON.parse(localStorage.getItem("jsonLinksCategorias"));
      let arrayCategoriasPorID = this.readJsonService.buscar(
        "IdCategoria",
        arrayCarrerasPorLinea[i].Grupo_carreras,
        JSON.parse(localStorage.getItem("jsonLinksCategorias"))
      );
      // Eliminar duplicados de las categorias
      /*arrayCategoriasPorID = this.readJsonService.removeDuplicates(
        arrayCategoriasPorID,
        "IdCategoria"
      );*/
      // Se añade el nodo Nombre_categoria por el join con el nuevo json
          /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
      carrerasParaSelect[i] = [
        {
          carrera: arrayCarrerasPorLinea[i].nombre,
          Grupo_carreras: arrayCarrerasPorLinea[i].Grupo_carreras,
          Nombre_categoria: arrayCategoriasPorID[0].Categoria,
          IdDynamics: arrayCarrerasPorLinea[i].IdDynamics
        }
      ];
    }

    return carrerasParaSelect;
  } // Termina get Carreras


  arrUnique(arr) {
    var cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (_.isEqual(itm["carrera_codigounico"], itm2["carrera_codigounico"])) unique = false;
        });
        if (unique)  cleaned.push(itm);
    });
    return cleaned;
  }


    // Modificacion a la funcion para la obtencion de carreras por ajuste en los JSON solvis 04-05-2018 JEAB
    getCarrerasCRM(linea, campus = "") {
      // jQuery("#select_lineas").html("");
      let keySearch = "nivelestudios_crmit_codigounico";
      let arrayCarrerasPorLinea = [];
      var arrayCarrerasPorCodigoUnico = [];
          /**
     * 
     * 
     * 
     * 
     * MODIFICACION PARA SOLVIS
     * 
     * 
     * 
     * 
     * 
     */
      let objJsonCarreras = JSON.parse(localStorage.getItem("jsonProductosCRM"));
      arrayCarrerasPorLinea = this.readJsonService.buscar(
        keySearch,
        linea,
        objJsonCarreras
      );
      const that = this; 
      // console.log(objJsonCarreras);
      console.log("Dentro de getCarreras CRM listado con nueva funcion SOLVIS:");
      arrayCarrerasPorLinea = this.arrUnique(arrayCarrerasPorLinea);
      console.log(arrayCarrerasPorLinea);
      var indexC = 0;
      arrayCarrerasPorLinea.forEach(function(subarreglo) {
        // console.log("Carrera");
        // console.log(subarreglo["carrera_codigounico"]);
        arrayCarrerasPorCodigoUnico[indexC ++] = that.readJsonService.buscar(
          "codigounico",
          subarreglo["carrera_codigounico"],
          JSON.parse(localStorage.getItem("jsonDetalleProductosCRM"))
        );
        
      });
      var tamarr = arrayCarrerasPorCodigoUnico.length;
      var ifor;
      var efor;
      for(ifor=0;ifor<tamarr;ifor++){
        for(efor=0;efor<arrayCarrerasPorCodigoUnico[ifor].length;efor++){
          arrayCarrerasPorCodigoUnico[efor] = arrayCarrerasPorCodigoUnico[ifor][efor];
        }
      }
      // console.log("Afuera del foreach");
      var carrerasParaSelect:any = [];
      for(var exi=0;exi<arrayCarrerasPorCodigoUnico.length;exi++){
        // console.log("Dentro del for para haer el arreglo de carreras solvis: ");
        // console.log(arrayCarrerasPorCodigoUnico[exi]);
        for(var exe=0;exe<arrayCarrerasPorCodigoUnico[exi].length;exe++){

            // console.log(arrayCarrerasPorCodigoUnico[exi][exe]["name"]);
            carrerasParaSelect[exi] = [
              {
                carrera: arrayCarrerasPorCodigoUnico[exi][exe]["name"],
                Grupo_carreras: arrayCarrerasPorCodigoUnico[exi][exe]["ofertaeducativaid"],
                Nombre_oferta: arrayCarrerasPorCodigoUnico[exi][exe]["ofertaeducativaname"],
                IdDynamics: arrayCarrerasPorCodigoUnico[exi][exe]["codigounico"]
              }
            ];

        }
      }
      // console.log("CARRERAS PARA SELECT SOLVIS");
      // console.log(carrerasParaSelect);
      
      // IMPLEMENTACION DE LISTADO DE CARRERAS POR COOKIE
      // si tiene la cookie de subnivel de interes obtener del arreglo solo con el subnivel de interes que viene en la url
      // OBTENER EL SUBNIVEL DE INTERES DE LA COOKIE
      /*let subnivelInteresCookie:any = this.formCookieService.getCookieByKey("c_preload_form","subnivelInteres");
      if(subnivelInteresCookie != "" && subnivelInteresCookie.toUpperCase() != "X" && typeof subnivelInteresCookie != "undefined") {
        var arrayCarrerasPorSubnivel = this.readJsonService.buscar(
          "modalidad",
          this.getModalidadPorSubnivel(subnivelInteresCookie),
          arrayCarrerasPorLinea
        );
        if(arrayCarrerasPorSubnivel.length > 0) {
          arrayCarrerasPorLinea = arrayCarrerasPorSubnivel;
        }
      }*/
      // Construimos el arreglo para la vista
      // Closure para ordenar
      var filter: any;
      var compare = function(filter) {
        return function(a, b) {
          var a = a[filter],
            b = b[filter];
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        };
      };
      // Seteamos el filtro y ordenamos por grupo_carreras
      filter = compare("carrera");
      // filter = compare("nombre");
      // Eliminar duplicados
      /*carrerasParaSelect = this.readJsonService.removeDuplicates(
        carrerasParaSelect,
        "carrera"
      );*/
      // console.log(carrerasParaSelect);
      return carrerasParaSelect;
      // console.log("Las carreras por linea sin duplicados");
      // console.log(arrayCarrerasPorLinea);
      // Ordernar por nombre
      // arrayCarrerasPorLinea.sort(filter);
      // Formamos el arreglo para el nuevo div
      /*let carrerasParaSelect = [];
      for (var i in arrayCarrerasPorLinea) {*/
  
        // Modificacion para traer el nombre de las categorias por ajuste en los json 09-10-2017 JEAB
        // let objJsonCarreras = JSON.parse(localStorage.getItem("jsonLinksCategorias"));
        /*let arrayCategoriasPorID = this.readJsonService.buscar(
          "IdCategoria",
          arrayCarrerasPorLinea[i].Grupo_carreras,
          JSON.parse(localStorage.getItem("jsonLinksCategorias"))
        );*/
        // Eliminar duplicados de las categorias
        /*arrayCategoriasPorID = this.readJsonService.removeDuplicates(
          arrayCategoriasPorID,
          "IdCategoria"
        );*/
        // Se añade el nodo Nombre_categoria por el join con el nuevo json
        /*carrerasParaSelect[i] = [
          {
            carrera: arrayCarrerasPorLinea[i].nombre,
            Grupo_carreras: arrayCarrerasPorLinea[i].Grupo_carreras,
            Nombre_categoria: arrayCategoriasPorID[0].Categoria,
            IdDynamics: arrayCarrerasPorLinea[i].IdDynamics
          }
        ];
      }*/
      // return "carrerasParaSelect";
    } // Termina get Carreras

  getModalidadPorSubnivel(subNivelInteres)
  {
    let modalidad;
    if(subNivelInteres == 1 || subNivelInteres == 2 || subNivelInteres == 5 || subNivelInteres == 7) {
      // Presencial
      modalidad = 1;
    }else if(subNivelInteres == 3) {
      // ejecutiva
      modalidad = 2;
    }else if(subNivelInteres == 4 || subNivelInteres == 6){
      modalidad = 3;
    }
    return modalidad;
  }


  // Calcula el nivelInteres dependiendo la linea
  getNivelInteres(linea) {
    let value;
    switch (linea) {
      case "PREPARATORIA":
        value = "P";
        break;
      case "LICENCIATURA":
        value = "U";
        break;
      case "INGENIERIA":
        value = "U";
        break;
      case "SALUD":
        value = "U";
        break;
      case "POSGRADO":
        value = "G";
        break;
      default:
        value = "U";
        break;
    }
    return value;
  } // Termina get nivel interes

  // Campus nombre largo
  campusNombreLargo(campus) {
    let value;
    switch (campus) {
      case "ATZ":
        value = "Atizapán";
        break;
      case "CUI":
        value = "Cuitláhuac";
        break;
      case "ECA":
        value = "Ecatepec";
        break;
      case "MAR":
        value = "Marina";
        break;
      case "SUR":
        value = "Sur";
        break;
      case "LEO":
        value = "León";
        break;
      case "TOL":
        value = "Toluca";
        break;
      case "ONL":
        value = "En Línea";
        break;
      case "GDL":
        value = "Guadalajara";
        break;
      case "QRO":
        value = "Querétaro";
        break;
      case "REY":
      value = "Los Reyes";
      break;
    }
    return value;
  } // fin de campus nombre largo

  // Metodo para convertir la modalidad
  getNombreModalidad(modalidad) {
    let value;
    switch (modalidad) {
      case "1":
        value = "Presencial";
        break;
      case "2":
        value = "Ejecutiva";
        break;
      case "3":
        value = "En linea";
        break;
      default:
        value = "Presencial";
        break;
    }
    return value;
  } // Fin del metodo de la modalidad

  // Despues de tener todas las variables construimos el input del ciclo (carrera,campus,et)

  construyeInputciclos() {
    var config_ciclos = this.config_ciclos;
    var ciclos_input: any = [];
    jQuery("#formApp").data("subnivelinteres","2");
    for (let objCiclo of config_ciclos) {
      // console.log(objCiclo.ciclo["valor"]);
      // Si la carrera seleccionada esta en el array de ciclos entonces es valido el ciclo
      // console.log(objCiclo.idCarreras.indexOf(jQuery("#formApp").data("idCarrera")));
      if (
        (objCiclo.idCarreras.indexOf(jQuery("#formApp").data("idCarrera")) !==
          -1 ||
          objCiclo.subNivelInteres.indexOf(
            jQuery("#formApp").data("subnivelinteres")
          ) !== -1) &&
        objCiclo.excluirCarreras.indexOf(
          jQuery("#formApp").data("idCarrera")
        ) == -1 &&
        objCiclo.excluirsubNivel.indexOf(
          jQuery("#formApp").data("idCarrera")
        ) == -1 &&
        objCiclo.excluirCampus.indexOf(jQuery("#formApp").data("campus")) ==
          -1
      ) {
        ciclos_input.push({
          id: objCiclo.ciclo["valor"],
          texto: objCiclo.ciclo["texto"]
        });
      }
    } // Fin del for
    console.log("Los ciclos para los que aplica");
    console.log(ciclos_input);
    // jQuery('#frm_ciclo').html("<option value='' selected>" + this.preguntaCiclo + "</option>")
    // Armar el listado y colocarlo en la seccion secProductos
    for (var i = 0; i < ciclos_input.length; i++) {
      var ciclos_class = "cuadro-periodo";

      let iddiv = "div_ciclos" + i;
      jQuery("#secCiclos .row").append(
        '<div class="col-6 col-cuadros-contenedor" id="' +
          iddiv +
          '" #div_ciclos value="' +
          ciclos_input[i].id +
          '" ' +
          ">" +
          '<div class="col-12 col-cuadros-ciclos" id="' +
          iddiv +
          '" value="' +
          ciclos_input[i].id +
          '">' +
          '<div id="' +
          iddiv +
          '" value="' +
          ciclos_input[i].id +
          '" class="imagen-lineas-cuadros ' +
          ciclos_class +
          '">\
            </div>\
            <div class="titulo-lineas-cuadros" id="'+iddiv+'" value="'+ciclos_input[i].id+'" style="text-align:center;">' +
          ciclos_input[i].texto +
          "</div>" +
          "</div>" +
          "</div>"
      );


      if ( location.href.indexOf( "impulsa" ) !== -1 ) {
        // console.log( "redirige a la funcion sendFormularioImpulsa" );
        // Seteamos el listener
        let one = i;
        this.elRef.nativeElement
          .querySelector("#div_ciclos" + one)
          .addEventListener("click", event =>
            this.sendService.sendFormularioImpulsa(event)
          );

      } else if( location.href.indexOf( "orientacion-profesional" ) !== -1 ){
        // console.log( "redirige a la funcion sendFormularioOrientacion-vocacional" );
        // Seteamos el listener
        let one = i;
        this.elRef.nativeElement
          .querySelector("#div_ciclos" + one)
          .addEventListener("click", event =>
            this.sendService.sendFormularioOrientacion(event)
          );
        
      } else {
        // console.log( "redirige a la funcion sendFormularioTradicional" );
        // Seteamos el listener
      let one = i;
      this.elRef.nativeElement
        .querySelector("#div_ciclos" + one)
        .addEventListener("click", event =>
          this.sendService.sendFormularioTradicional(event)
        );
      }

    }
  } // Termina metodo construye input ciclos
} // Fin de la clase
