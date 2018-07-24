import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { userValidations } from "../../forms_services/validaciones.service";
import { Animaciones } from "../../../utilities/animaciones";
import { getJson } from "../../../services/getJson.service";
import { GenericService } from "../../../services/generic.service";
import { sendService } from "../../forms_services/send.service";
import { OnInit } from "@angular/core";


//Servicio de cookie
import { formCookiesService } from "../../forms_services/formCookies.service";
//Servicio para reconocimiento de voz
import { WebspeachService } from "../../../services/webspeach.service";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-formulario-tradicional",
  templateUrl: "./formulario-tradicional.component.html",
  styleUrls: ["./formulario-tradicional.component.scss"],
  providers: [
    userValidations,
    sendService,
    Animaciones,
    formCookiesService,
    WebspeachService,
    GenericService
  ]
})
export class formularioTradicionalComponent implements OnInit {
  //Variables de inicializacion
  titulo = "";
  formularioTradicional: FormGroup;
  formularioPadre: FormGroup;
  isDoubleWay: boolean = true;
  primerPaso: string = "faseUno";
  segundoPaso: string = "faseDos";
  btnToogleValue: string = "Continuar";
  btnEnviar: string = "Enviar";
  titulo_app_menu: string = "Realiza el test de orientación profesional";
  cookie_campania = "utm_campaign";
  utm_campaing : string = "ASPIRANTES LIC" ;
  banner: string;
  //hubspotutk: string = "4B2B772A039E1F20612CC32A5B633BCE";
  
  //Errores del flujo de la aplicacion
  error_estado = "Por favor selecciona un estado";
  error_linea = "Por favor selecciona tu estudio de interes";
  error_producto = "Por favor selecciona una carrera";
  error_modalidad = "Por favor selecciona una modalidad";
  error_campus = "Por favor selecciona un campus";
  error_ciclo = "Por favor selecciona ciclo de interes";
  //Titulos estado
  titulo_estado = "Selecciona tu estado";
  //Variable para almacenar los datos del speech
  speechData: string;
  //Variable para emular GET
  $_GET: any;
  //Variable para almacenar el arreglo para la pre carga del formulario
  preload: any;
  //Constructor
  constructor(
    private formBuilder: FormBuilder,
    private userValidations: userValidations,
    private sendService: sendService,
    private getJsonService: getJson,
    private animaciones: Animaciones,
    private formCookieService: formCookiesService,
    private speechRecognitionService: WebspeachService,
    private genericService: GenericService
  ) {
    //Invocamos el metodo getJsonCarreras para obtener las carreras y ponerlas en localstorage
    this.getJsonService.getJsonCarreras();
    //Consumimos el json de categorias cambio por ajuste en los json 09-10-2017
    this.getJsonService.getJsonLinksCategorias();
    //Consumimos el Json de solvis :/
    console.log("Antes de las carreras de solvis");
    this.getJsonService.getJsonCarrerasJsonCRM();
    this.getJsonService.getJsonProductosJsonCRM();
    this.getJsonService.getJsonDetalleProductosCRM();
    this.getJsonService.getJsonModalidadesCRM();
    this.getJsonService.getJsonCampusCRM();
    this.getJsonService.getPrioridadAttemp();
    this.getJsonService.getCiclosSolvis();
    //getJsonDetalleProductosCRM
    console.log("Después de las carreras de solvis");
    //Funcionalidad para ponerle foto al elemento siguiente en el evento enter
    jQuery(function() {
      jQuery("input,select,button").on("keypress", function(e) {
        try {
          e.which !== 13 ||
            jQuery("[tabIndex=" + (+this.tabIndex + 1) + "]")[0].focus();
        } catch (e) {
          jQuery('[tabIndex="1"]')[0].focus();
        }
      });
    });

    this.$_GET = genericService.getMethod();

    //Inicializacion del formulario 
    this.formularioTradicional = formBuilder.group({
      faseUno: formBuilder.group({
        frm_nombre: ["", Validators.compose([userValidations.validaNombres])],
        frm_apaterno: ["", Validators.compose([userValidations.validaNombres])],
        frm_amaterno: ["", Validators.compose([userValidations.validaNombres])],
        frm_mail: ["", Validators.compose([userValidations.validaEmail])],
        frm_celular: ["", Validators.compose([userValidations.validaCelular])]
      }),
      faseDos: formBuilder.group({
        frm_estado: [
          "",
          Validators.compose([userValidations.validaEstadoByPass])
        ]
      })
    });
    //Implementacion de typeahead
    jQuery(document).ready(function() {
    //Funcionalidad para poner el foco del input cuando lo seleccionan
    //jQuery('input').on('focus', function() {
      //console.log("Foco en el input: " + jQuery(this).offset().top);
      //document.body.scrollTop = jQuery(this).offset().top;
      //jQuery("#modal_frm_app").scrollTop(jQuery(this).offset().top);
    //});

    //Update By SRP
    //Active CSS en Safari Mobile
    //document.addEventListener("touchstart", function() {},false);

    //Fix al body en los input dentro del modal para Iphone
    /*jQuery("#modal_frm_app").on('show.bs.modal', function () {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        jQuery("body").css({
          'position': 'fixed !important',
          'width': '100%'
        });
        console.log("Activa fix Iphone");
      }
    });

    jQuery("#modal_frm_app").on('hidden.bs.modal', function () {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        jQuery("body").removeAttr('style');
        console.log("Desactiva fix Iphone");
        jQuery("body").css({
          'opacity': '1',
          'visibility': 'visible',
          'animation': 'none'
        });
        console.log("Restaurar Estilos Iniciales");
      }
    });*/
    //End Fix al body en los input dentro del modal para Iphone
    //Update By SRP
      

    //Implementacion para Hacer scrollTop en los Input
    jQuery('input').on('focus', function() {
 
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {          
         console.log("iphone");
      } else{
        jQuery("#modal_frm_app").scrollTop( jQuery("#modal_frm_app").scrollTop() + (this.getBoundingClientRect().top - 50) )
        console.log("Android");
      }
    });

      var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
          var matches, substringRegex;
          matches = [];
          var substrRegex = new RegExp(q, "i");
          $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
              matches.push(str);
            }
          });
          cb(matches);
        };
      };
      var domains = [
        "hotmail.com",
        "yahoo.com.mx",
        "msn.com",
        "yahoo.com",
        "gmail.com",
        "outlook.com",
        "live.com.mx",
        "live.com",
        "prodigy.net.mx",
        "icloud.com"
      ];
      $(".m_autocomplete").typeahead(
        {
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: "domains",
          source: substringMatcher(domains)
        }
      );
    });

    //Validar si existe campaña en la url para el prellenado del formulario
    console.log("URL LOCATION: ");
    //Implementacion By SRP 18-01-2018
    //this.banner = this.formCookieService.getUrlParameterByName(this.cookie_campania);
    //JEAB 9-02-2018
    this.banner = this.$_GET[this.cookie_campania]; 
    if( this.banner == null || this.banner == "" ) {
      this.banner = this.utm_campaing;
    }

    //Se registra el valor de la cookie utm_campaing
    this.formCookieService.appendCookieValue(
      "c_form_data",
      "banner",
      this.banner
    );
    
    // Cookie hubspot hubspotutk
    var hubspotutk = this.formCookieService.getCookie("hubspotutk") || "";
    //Se registra el valor de la cookie hubspotutk para modo de Prueba
    this.formCookieService.appendCookieValue(
      "c_form_data",
      "hubspotutk",
      hubspotutk
    );
    //Implementacion By SRP 18-01-2018
    //Obtencion de parametros y render del banner preload UG_2_704_ATZ (Para valores vacios se debe colocar X_X_X_ [nivelInteres,subNivelInteres,idDynamics,campus])
    this.preload = this.$_GET["preload"];
    //Split por que los parametros viene separados por "_"
    try{
      this.preload = this.preload.split("_");
    
    //Cargar los valores para el prellenado en una cookie
    //[nivelInteres,subNivelInteres,idDynamics,campus]
    //Setear la cookie de nivel de interes
    if(typeof this.preload[0] != "undefined") {
      this.formCookieService.appendCookieValue("c_preload_form","nivelInteres",this.preload[0]);
    }
    //Setear el subnivel de interes
    if(typeof this.preload[1] != "undefined") {
      this.formCookieService.appendCookieValue("c_preload_form","subnivelInteres",this.preload[1]);
    }
    //Setear el subnivel de interes
    if(typeof this.preload[2] != "undefined") {
      this.formCookieService.appendCookieValue("c_preload_form","idDynamics",this.preload[2]);
    }
    //Setear el campus
    if(typeof this.preload[3] != "undefined") {
      this.formCookieService.appendCookieValue("c_preload_form","campus",this.preload[3]);
    }
  }catch(ex) {
    console.log("No viene nada en get");

  }

  } //Fin del constructor

  //NgOnInit
  ngOnInit() {}

  rmCookie(){
    console.log("Eliminar cookie de url para el el prospecto pueda elegir");
    this.formCookieService.removeCookie("c_preload_form");
    console.log("Poner el flag de prellenado por url para que el prospecto pueda elegir");
    jQuery("#h_prellenado_formulario_pagina").val("false");
  }
  btnToogle() {
    //Quitar los espacios del celular
    var nvo_tel = jQuery("#frm_celular")
      .val()
      .replace(/[\(\)\{\}\[\]\+\-\_\s]/g, "-")
      .replace(/\-+/g, "")
      .replace(/^\-|\-$/, "")
      .toLowerCase();
    //Se asigna el valor del celular sanitizado al input esto es por que la asignacion de valor al input con webspeech no es nativa
    jQuery("#frm_celular").val(nvo_tel);
    //Se asigna el valor tambien al control
    this.formularioTradicional.controls.faseUno[
      "controls"
    ].frm_celular.setValue(nvo_tel);
    //Si el boton tiene el valor continuar, es decir viene del primer paso
    if (this.btnToogleValue == "Continuar") {
      //Si los inputs de la fase 1 del formulario no es valida
      //Se reccorre cada uno de los inputs y se les pasa el validador angular
      //Para que se muestren como campos invalidos los que tengan errores
      if (!this.formularioTradicional.controls.faseUno.valid) {
        let myFase = this.formularioTradicional.controls.faseUno["controls"];
        for (let control in myFase) {
          myFase[control].markAsDirty();
        }
        return false;
      
      //Si la fase 1 es valida se realiza proceso para mandar al siguiente paso
      } else {
        //alert("Preparamos para la fase 2");
        //En este else paso todas las validaciones
        //Creamos los valores de la cookie del primer paso
        let nombre = jQuery("#frm_nombre").val();
        let apaterno = jQuery("#frm_apaterno").val();
        let amaterno = jQuery("#frm_amaterno").val();
        let email = jQuery("#frm_mail").val();
        let celular = jQuery("#frm_celular").val();
        let tipoRegistro = jQuery("#frm_tipo_registro").val();

        // Variable de ejemplo para simular el CID by SRP
        //Implementacion de CID JEAB
        let cid = jQuery("#CID").val();

        this.formCookieService.appendCookieValue(
          "c_form_data",
          "nombre",
          nombre
        );
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "apaterno",
          apaterno
        );
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "amaterno",
          amaterno
        );
        this.formCookieService.appendCookieValue("c_form_data", "email", email);
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "celular",
          celular
        );
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "tipoRegistro",
          tipoRegistro
        );

        // Variable de ejemplo para simular el CID by SRP
        //JEAB se implemento el correcto
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "CID",
          cid
        );

        //Se registra el valor de es Alumno
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "esAlumno",
          "0"
        );

        //Creamos en formApp los valores del primer paso
        jQuery("#formApp").data("nombre", nombre);
        jQuery("#formApp").data("apaterno", apaterno);
        jQuery("#formApp").data("amaterno", amaterno);
        jQuery("#formApp").data("email", email);
        jQuery("#formApp").data("celular", celular);
        jQuery("#formApp").data("tipoRegistro", tipoRegistro);

        //Implementación envío de microregistro SOLVIS JEAB 04-JUNIO-2018
        //Para test vocacional no hay micro registro
        //this.sendService.sendMicroRegistro();
        //Termina implementación SOLVIS



        jQuery("#modal_frm_app").scrollTop(0);
        //console.log("Verificar la cookie del formulario");
        //console.log(this.formCookieService.getCookieValues("c_form_data"));
        //Setear el primer titulo
        jQuery(".app-menu-title").html(this.titulo_estado);
        //Preparar para el segundo paso o aplicacion (Se oculta todo lo del primer paso y se muestra lo del segundo paso)
        jQuery(".modal-header-formulario").hide("slow");
        jQuery(".frm-politicas").hide("slow");
        jQuery("#paso1").hide("slow");
        jQuery("#continuarTrd").hide("slow");
        jQuery("#paso2").show("slow");
        jQuery(".modal-header-app").show("slow");
        //Quitamos el margen para el formulario
        jQuery(".modal-body").css("margin-top", "0px");
        //Deshabilitar flecha izquierda después de llenar el formulario no es posible regresar
        jQuery(".app-left-arrow").css("visibility", "hidden");
        //Colocar el evento siguiente a la flecha derecha por el momento es seleccionar linea de negocio
        //Recibe evento selector y nombrepaso (linea, campus, producto, ciclo)
        //this.bindNavButtons("click", ".app-rigth-arrow", "linea");
        //Remover el titulo que se le puso al video y cerrarlo
        jQuery(".titulo-logo").remove();
        jQuery(".modal-body").removeClass("margen-para-video");

        //Si existe video se cierra
        try {
          $("#iframeytform")[0].contentWindow.postMessage(
            '{"event":"command","func":"' + "stopVideo" + '","args":""}',
            "*"
          );
        } catch (err) {
          console.log(
            "No existe la instancia del video youtube para detenerlo"
          );
        }
        //alert("Se termino de preparar la fase 2");
        return false;
      }
    } else {
      this.animaciones.myToggle(".frm-politicas");
      this.animaciones.myToggle("#paso1");
      this.animaciones.myToggle("#paso2");
      this.btnToogleValue = "Continuar";
      this.animaciones.myToggle("#enviarTrd");
      return false;
    }
  }

  bindNavButtons(evento, selector, avanza_a_seccion) {
    //Limpiar de eventos
    jQuery(selector).unbind(evento);
    //Validacion de los diferentes pasos
    switch (avanza_a_seccion) {
      case "linea":
        jQuery(selector).unbind();
        jQuery(selector).bind(evento, event => this.seleccionarLinea(event));
        break;
      case "campus":
        jQuery(selector).unbind();
        jQuery(selector).bind(evento, event => this.seleccionarCampus(event));
        break;
      case "estado":
        jQuery(selector).unbind();
        jQuery(selector).bind(evento, event => this.seleccionarEstado(event));
        break;
      case "producto":
        jQuery(selector).unbind();
        jQuery(selector).bind(evento, event => this.seleccionarProducto(event));
        break;
      case "modalidad":
        jQuery(selector).unbind();
        jQuery(selector).bind(evento, event =>
          this.seleccionarModalidad(event)
        );
        break;
      case "ciclo":
        jQuery(selector).unbind();
        jQuery(selector).bind(evento, event => this.seleccionarCiclo(event));
        break;
      default:
        break;
    }
  }
  /* Metodos para avanzar a los siguientes pasos*/
  seleccionarLinea(event) {
    //if ( jQuery('.division-div').hasClass('active') == false)
    if (
      jQuery("#formApp").data("estado") == "" ||
      typeof jQuery("#formApp").data("estado") == "undefined"
    ) {
      console.log(
        "No ha seleccionado el estado" + jQuery("#formApp").data("estado")
      );
      //(".app-menu-title").addClass("parpadea");
      jQuery(".app-menu-title").addClass("parpadea");
      jQuery("#divisor-menu-app").addClass("hr-error");
      jQuery("#divisor-menu-app").addClass("parpadea");
      setTimeout(function() {
        jQuery(".app-menu-title").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("parpadea");
        jQuery("#divisor-menu-app").removeClass("hr-error");
      }, 1000);

      //jQuery('.col-error-app').html(this.error_estado);
      //jQuery('.row-error-app').show();
      //.app-menu-title
    } else {
      console.log("Avanza a linea");
      //Ocultamos el selector actual
      jQuery(".col-estados").hide("slow");
      //Mostramos el siguiente selector
      jQuery(".col-lineas-negocio").show("slow");
    }
  }
  seleccionarCampus(event) {
    console.log("Cambiar campus");
  }
  seleccionarEstado(event) {
    console.log("Cambiar estado");
  }
  seleccionarProducto(event) {
    console.log("Cambiar producto");
  }
  seleccionarModalidad(event) {
    console.log("Cambiar modalidad");
  }
  seleccionarCiclo(event) {
    console.log("Cambiar ciclo");
  }

  showFormAppErrors(paso) {
    //Se limpian posibles anteriores errores
    //Se añade el error solicitado
  }

  responde() {
    console.log("click del padre");
  }

  enviar() {
    //Validacion de estado con jquery por integracion con mdbootstrap
    let valida_estado = jQuery("#valida_estado").val();

    if (valida_estado == "0") {
      jQuery(".frm-estado").addClass("sin-estado");
      jQuery(".frm-estado").removeClass("con-estado");
    }

    //Validacion de ciclo con jquery por integracion con mdbootstrap
    let valida_ciclo = jQuery("#valida_ciclo").val();
    if (valida_ciclo == "0") {
      jQuery(".frm-ciclo").addClass("sin-ciclo");
      jQuery(".frm-ciclo").removeClass("con-ciclo");
    }

    //Validación de linea de negocio, carrera, campus, modalidad
    //Traemos los datos de #formApp para validar si se eligieron
    let lineaNegocio = jQuery("#formApp").data("linea");
    let carrera = jQuery("#formApp").data("categoria");
    let modalidad = jQuery("#formApp").data("modalidad");
    let campus = jQuery("#formApp").data("campus");

    if (
      this.formularioTradicional.controls.faseDos.valid == false ||
      valida_estado == "0" ||
      typeof lineaNegocio == "undefined" ||
      typeof carrera == "undefined" ||
      typeof modalidad == "undefined" ||
      typeof campus == "undefined"
    ) {
      let myControl = this.formularioTradicional.controls.faseDos["controls"];
      for (let control in myControl) {
        myControl[control].markAsDirty();
      }
      //Validación de linea de negocio, carrera, campus, modalidad
      if (lineaNegocio == "" || typeof lineaNegocio == "undefined") {
        jQuery(".frm-estudio-interes-mensaje").html("Elige un area de interes");
        jQuery(".frm-estudio-interes").removeClass("oculta-error");
        jQuery(".frm-estudio-interes").addClass("muestra-error");
      } else if (carrera == "" || typeof carrera == "undefined") {
        jQuery(".frm-estudio-interes-mensaje").html("Elige una carrera");
        jQuery(".frm-estudio-interes").removeClass("oculta-error");
        jQuery(".frm-estudio-interes").addClass("muestra-error");
      } else if (modalidad == "" || typeof modalidad == "undefined") {
        jQuery(".frm-estudio-interes-mensaje").html("Elige una modalidad");
        jQuery(".frm-estudio-interes").removeClass("oculta-error");
        jQuery(".frm-estudio-interes").addClass("muestra-error");
      } else if (campus == "" || typeof campus == "undefined") {
        jQuery(".frm-estudio-interes-mensaje").html("Elige un campus");
        jQuery(".frm-estudio-interes").removeClass("oculta-error");
        jQuery(".frm-estudio-interes").addClass("muestra-error");
      }
      return false;
    } else {
      this.sendService.sendFormularioTradicional();
      return false;
    }
  } //Termina el metodo enviar del formulario
  //Metodo del webspeech para los input hijos
  vozInput(childComponent): void {
    //this.speechRecognitionService.DestroySpeechObject();
    //Obtener el id del input
    var arr_input_id = childComponent.inputComponent.split(".");
    var id_input = arr_input_id[1];
    //Quitar las animaciones de todo lo que este activo en el form
    jQuery("form .iconos-form").removeClass("rotate-mic");
    jQuery("form input").removeClass("rainbow_border");

    //Agregar las animaciones al input seleccionado
    if (id_input == "frm_mail") {
      jQuery("." + id_input + ".iconos-form").addClass("rotate-mic");
      jQuery(".frm_mail_class").addClass("rainbow_border");
    } else {
      var id = "#" + id_input;
      jQuery("." + id_input + ".iconos-form").addClass("rotate-mic");
      jQuery(id).addClass("rainbow_border");
    }
    this.speechRecognitionService.DestroySpeechObject();

    this.speechRecognitionService.record().subscribe(
      value => {
        this.speechData = value;
        let valor_input;
        jQuery("." + id_input + ".iconos-form").removeClass("rotate-mic");
        if (id_input == "frm_mail") {
          jQuery(".frm_mail_class").remove("rainbow_border");
        } else {
          jQuery("#" + id_input).remove("rainbow_border");
        }
        jQuery("#frm_tradicional input").removeClass("rainbow_border");
        this.speechRecognitionService.DestroySpeechObject();
        //Validacion angular
        //Validacion para saber cual es el id del input

        if (id_input == "frm_nombre") {
          valor_input = value.toLowerCase();
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_nombre.setValue(valor_input);
          jQuery("#" + id_input).val(valor_input);
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_nombre.markAsDirty();
        } else if (id_input == "frm_apaterno") {
          valor_input = value.toLowerCase();
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_apaterno.setValue(valor_input);
          jQuery("#" + id_input).val(valor_input);
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_apaterno.markAsDirty();
        } else if (id_input == "frm_amaterno") {
          valor_input = value.toLowerCase();
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_amaterno.setValue(valor_input);
          jQuery("#" + id_input).val(valor_input);
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_amaterno.markAsDirty();
        } else if (id_input == "frm_celular") {
          valor_input = value.toLowerCase().trim();
          var nuevo_v = valor_input.replace(/\s+/g, "");
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_celular.setValue(nuevo_v);
          jQuery("#" + id_input).val(nuevo_v);
          $("#frm_celular").attr("value", nuevo_v);
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_celular.markAsDirty();
        } else if (id_input == "frm_mail") {
          valor_input = value.toLowerCase();
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_mail.setValue(valor_input);
          jQuery(".frm_mail_class").val(valor_input);
          jQuery("#" + id_input).focus();
          jQuery(".frm_mail_class").focus();
          this.formularioTradicional.controls.faseUno[
            "controls"
          ].frm_mail.markAsDirty();
        }
        jQuery("#" + id_input).focus();

        console.log("Saber si es valida la fase 1");
        console.log(this.formularioTradicional.controls.faseUno.valid);
        return;
      },
      err => {
        jQuery("." + id_input + ".iconos-form").removeClass("rotate-mic");
        if (id_input == "frm_mail") {
          jQuery(".frm_mail_class").removeClass("rainbow_border");
        } else {
          jQuery("#" + id_input).removeClass("rainbow_border");
        }
        console.log("Error", err);
        if (err.error == "no-speech") {
          //console.log("-- reiniciando el servicio --");
          jQuery("#frm_tradicional input").removeClass("rainbow_border");
          this.speechRecognitionService.DestroySpeechObject();
        }
        return;
      },
      () => {
        jQuery("." + id_input + ".iconos-form").removeClass("rotate-mic");
        if (id_input == "frm_mail") {
          jQuery(".frm_mail_class").removeClass("rainbow_border");
        } else {
          jQuery("#" + id_input).removeClass("rainbow_border");
        }
        if (id_input == "frm_mail") {
          jQuery(".frm_mail_class").val(this.speechData);
        } else {
          jQuery("#" + id_input).val(this.speechData);
        }
        console.log("-- Completado --");
        jQuery("#frm_tradicional input").removeClass("rainbow_border");
        this.speechRecognitionService.DestroySpeechObject();
        return;
      }
    );
  } //Termina metodo voz inputs

  validaEmailConAutocomplete(childComponent): void {
    console.log(childComponent);
    this.formularioTradicional.controls.faseUno["controls"].frm_mail.setValue(
      childComponent
    );
    this.formularioTradicional.controls.faseUno[
      "controls"
    ].frm_mail.markAsDirty();
  }
  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
    return;
  }
} //Termina clase del componente del formulario
