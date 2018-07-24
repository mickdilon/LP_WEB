import { Injectable } from "@angular/core";
import { formCookiesService } from "../forms_services/formCookies.service";
import { readJson } from "../../services/readJson.service";
import { getJson } from "../../services/getJson.service";
//var nodo_encontrado = this.readJsonService.buscar("Grupo_carreras", jQuery("#h_id_producto").val(), JSON.parse(localStorage.getItem("jsonCarreras")));

declare var $: any;
declare var jQuery: any;
declare var dataLayer: any;
declare var ga: any;

@Injectable()
export class sendService {
  ciclo_default = "";
  urlreferrer: any = window.location;
  private url_ajax_php = "/lp_web/sendScribe.php";
  private url_ajax_micro_php = "/lp_web/sendMicroScribe.php";
  //private url_ajax_php = "/wp-content/phpServeApp/backend1.php";
  constructor(private formCookieService: formCookiesService, private readJsonService: readJson, private getJsonService:getJson) {}

  send(theData, urls) {
    console.log(theData);
    for (let i in urls) {
      jQuery
        .ajax({
          type: "GET",
          url: urls[i],
          data: { theData: theData }
        })
        .done(function(resultado) {
          console.log( resultado );
          return resultado;
        });
    }
  }

  sendMicroRegistro(evento = null)
  {
    console.log("Envío a microregistro");
    let dataForm = JSON.parse( JSON.stringify( jQuery("#formApp").data() ) );
    jQuery
    .ajax({
      type: "POST",
      url: this.url_ajax_micro_php,
      data: dataForm,
      // dataType: "JSON",
      success: function(res) {
        console.log("Micro registro enviado");   
        console.log(res);       
      },
      error: function(xhr, textStatus, error){
          console.log("Error");
          console.log(xhr.statusText);
          console.log(textStatus);
          console.log(error);
      }
    });

  }//Termina envío a microregistro


  sendFormularioTradicional(evento = null) {
    //var url_multimedia_thankyou_predeterminada = "assets/sidenav.jpg";
    //Si no esta la imagen destacada se asigna la imagen predeterminada
    var url_multimedia_thankyou = jQuery("#h_horizontal_url_imagen_destacada").val();
    console.log("CATEGORIA PARA THNKjjjjj: " + jQuery("#formApp").data("categoria"));
    //Implementacion ajax de la imagen destacada


    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  console.log("is mobile: " + isMobile);
  jQuery(".img-header-thankyou").css({
    "background-image": "url(" + jQuery("#h_horizontal_url_imagen_destacada").val() + ")"
  });
}else {
  console.log("No es mobile");
  jQuery(".img-header-thankyou").css({
    "background-image": "url(" + "" + ")"
  });
}
    var ev = null;
    //Evento
    if (evento != null) {
      ev = evento.srcElement || evento.target;
    }
    //Validacion para saber si el evento viene de la caja de ciclo
    if (ev == null || typeof ev == "undefined" || ev == "") {
      jQuery("#formApp").data("ciclo", "");
    } else {
      jQuery("#formApp").data("ciclo", ev.attributes.value.nodeValue);
    }

    if (
      jQuery("#formApp").data("ciclo") == "" ||
      typeof jQuery("#formApp").data("ciclo") == "undefined"
    ) {
      console.log(
        "No ha seleccionado el ciclo: " +
          typeof jQuery("#formApp").data("ciclo")
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
      //Se registra el valor de la urlreferer
      this.formCookieService.appendCookieValue(
        "c_form_data",
        "urlreferrer",
        this.urlreferrer
      );

      var cookie_form_values = this.formCookieService.getCookieValues(
        "c_form_data"
      );
      //Preparamos los datos para la thank you page
      jQuery(".modal-header-formulario").hide("slow");
      jQuery(".modal-header-thankyou").show("slow");
      jQuery("#enviarTrd").hide();
      jQuery(".modal-body-form").hide("slow");
      jQuery(".modal-body-thankyou").show("slow");
      jQuery(".tercer-texto-thankyou").html(cookie_form_values["carrera"]);
      //Traer el nombre de la carrera con el nodo categoria
      var id_carrera_solvis = jQuery("#formApp").data("categoria");
      console.log("El id: " + id_carrera_solvis);
      var nodo_encontrado = this.readJsonService.buscar(
        "codigounico",
        id_carrera_solvis,
        JSON.parse(localStorage.getItem("jsonDetalleProductosCRM"))
      );      
      console.log("ANTES DE PONER EL TEXTO DE LA CARRERA SOLVIS:");
      console.log(nodo_encontrado[0].name);
      jQuery(".tercer-texto-thankyou").html(nodo_encontrado[0].name);
      //Carrera seleccionada la seteamos
      jQuery("#formApp").data("carrera", nodo_encontrado[0].name);
      jQuery("#formApp").data("BL", nodo_encontrado[0].BL);
      jQuery("#nombre-thankyou").html(cookie_form_values["nombre"]);

      /*Implementacion enviar datos BY SRP 28-01-2018*/
      jQuery("#txt-thanks").html("Gracias por proporcionarnos tus datos. En breve te enviaremos la información que nos solicitas de:");
      /*End Implementacion enviar datos BY SRP 28-01-2018*/

      //Si no viene con evento
      console.log("EL EVENTO DESPUES DE CLICLEAR CICLO: ");
      console.log(ev);
      if (ev.id != "null" && ev.id != null && typeof ev.id != "undefined") {
        console.log("CICLO: " + ev.attributes.value.nodeValue);
        //Setear en la cookie el ciclo y en formApp
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "ciclo",
          ev.attributes.value.nodeValue
        );
      } else {
        console.log("El evento no esta definido para el ciclo");
      }
      /*Implementacion enviar datos BY SRP 17-01-2018*/
      //Convertir a JSON la Cookie
      let dataFormC = JSON.parse( JSON.stringify( this.formCookieService.getCookieValues("c_form_data") ) );
      jQuery("#formApp").data("banner",dataFormC.banner);
      //Obtener nivel y modalidad
      var nodo_encontrado_nivel_modalidad = this.readJsonService.buscar(
        "carrera_codigounico",
        id_carrera_solvis,
        JSON.parse(localStorage.getItem("jsonProductosCRM"))
      );      
      console.log("ANTES DE OBTENER LOS ID DE NIVEL Y MODALIDAD:");
      var id_modalidad_solvis = nodo_encontrado_nivel_modalidad[0].modalidad_crmit_codigounico;
      var id_nivel_solvis = nodo_encontrado_nivel_modalidad[0].nivelestudios_crmit_codigounico;
      var id_carrera_codigo_unico = nodo_encontrado_nivel_modalidad[0].carrera_codigounico;
      var id_campus_codigo_unico = nodo_encontrado_nivel_modalidad[0].campus_crmit_codigounico;

      //Obtener el nivel y modalidad para enviarlos
      //NIVEL
      var nivel_nodo_encontrado = this.readJsonService.buscar(
        "crmit_codigounico",
        id_nivel_solvis,
        JSON.parse(localStorage.getItem("jsonCarrerasCRM"))
      );  
      jQuery("#formApp").data("nivel",nivel_nodo_encontrado[0].crmit_name);  
      //MODALIDAD
      var modalidad_nodo_encontrado = this.readJsonService.buscar(
        "crmit_codigounico",
        id_modalidad_solvis,
        JSON.parse(localStorage.getItem("jsonModalidadCRM"))
      );  
      jQuery("#formApp").data("modalidad",modalidad_nodo_encontrado[0].crmit_name);
      //Obtener los valores de prioridad attemp, equipo
      console.log("ANTES DE OBTENER PRIORIDAD Y ATTEMPT SOLVIS:");
      console.log("NIVEL DE ESTUDIOS: ");
      console.log(id_nivel_solvis);

      var nivel_prior_att = jQuery("#formApp").data("nivel");
      var bl_prior_att = jQuery("#formApp").data("BL");
      var campus_prior_att = jQuery("#formApp").data("campusLargo");
      console.log("JSON SOLVIS PRIORIDAD Y ATTEMPT");
      console.log(JSON.parse(localStorage.getItem("jsonPrioridadCRM")));
      var prioridad_nodo_por_campus = this.readJsonService.buscar(
        "Campus",
        campus_prior_att,
        JSON.parse(localStorage.getItem("jsonPrioridadCRM"))
      ); 
      
      console.log("PRIORIDAD POR CAMPUS:");
      console.log(prioridad_nodo_por_campus);
      var prioridad_nodo_por_nivel = this.readJsonService.buscar(
        "BL",
        bl_prior_att,
        prioridad_nodo_por_campus
      ); 
      console.log("PRIORIDAD POR NIVEL:");
      console.log(prioridad_nodo_por_nivel[0]);

      /* Buscar id de ciclo por ciclo jsonCiclosSolvis */
      var id_ciclo_por_ciclo = this.readJsonService.buscar(
        "crmit_name",
        jQuery("#formApp").data("ciclo"),
        JSON.parse(localStorage.getItem("jsonCiclosSolvis"))
      ); 

      console.log("CICLO SOLVISSS");
      console.log(id_ciclo_por_ciclo[0].crmit_codigounico);

      var prioridad_nodo_por_ciclos = this.readJsonService.buscar(
        "Ciclo",
        id_ciclo_por_ciclo[0].nombreventas,
        prioridad_nodo_por_nivel
      ); 

      jQuery('#formApp').data("attemp",prioridad_nodo_por_ciclos[0].Attemp);
      jQuery('#formApp').data("prioridad",prioridad_nodo_por_ciclos[0].Prioridad);
      jQuery('#formApp').data("team",prioridad_nodo_por_ciclos[0].TEAM);
      //jQuery('#formApp').data("BL",prioridad_nodo_por_nivel[0].BL);

      //Asignacion de telefonos predictivos
      var predCel = jQuery("#formApp").data("celular").substring(0,2);
      var TelefonoCelularPredictivo = '9045' + jQuery("#formApp").data("celular");
      if(predCel == 55){
        TelefonoCelularPredictivo = '9044'+jQuery("#formApp").data("celular");
      }
      var TelefonoPredictivo = '901'+jQuery("#formApp").data("celular").substring(2,jQuery("#formApp").data("celular").length);
      if(predCel == 55){
        TelefonoPredictivo = '9'+jQuery("#formApp").data("celular").substring(2,jQuery("#formApp").data("celular").length);
      }

      jQuery('#formApp').data("telefonopredictivo",TelefonoCelularPredictivo);
      jQuery('#formApp').data("telefonopredictivo2",TelefonoPredictivo);
      jQuery("#formApp").data("nivelInteres",nivel_nodo_encontrado[0].crmit_codigounico);
      /* Nuevos de alfonso */
      jQuery("#formApp").data("GUIDNivelInteres",id_nivel_solvis);
      jQuery("#formApp").data("GUIDModalidad",id_modalidad_solvis);
      jQuery("#formApp").data("GUIDCampus",id_campus_codigo_unico);
      jQuery("#formApp").data("GUIDCarrera",id_carrera_codigo_unico);
      jQuery("#formApp").data("GUIDCiclo",id_ciclo_por_ciclo[0].crmit_codigounico);

      /* Envío de ciclo por código ventas */
      jQuery("#formApp").data("ciclo",id_ciclo_por_ciclo[0].crmit_name);
      /* Envío de ciclo por código ventas */

      /*Termina nuevos de alfonso*/
      jQuery("#formApp").data("cookie",this.formCookieService.getCookie("hubspotutk") || "");
      jQuery("#formApp").data("fuenteobtencion","WEB");
      jQuery("#formApp").data("cid",jQuery("#CID").val());
      //jQuery("#formApp").data("vid","");
      jQuery("#formApp").data("urlreferrer",window.location.href);
      jQuery("#formApp").data("GUIDUsuario","d6d4012d-8aaf-e711-8104-c4346bdc0341");
      let dataForm = JSON.parse( JSON.stringify( jQuery("#formApp").data() ) );
      jQuery(".div-btn-continuar").css("z-index","9999");
      jQuery
      .ajax({
        type: "POST",
        url: this.url_ajax_php,
        data: dataForm,
        // dataType: "JSON",
        success: function(res) {
          console.log("Datos Enviados");      
          console.log(res);    
        },
        error: function(xhr, textStatus, error){
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }
      });
      /*End Implementacion enviar datos BY SRP 17-01-2018*/
    } // Fin del else para la validacion del ciclo
  }

  /*Metodo para enviar a Impulsa BY SRP 17-01-2018*/
  sendFormularioImpulsa(evento = null) {
    // Si no esta la imagen destacada se asigna la imagen predeterminada
    var url_multimedia_thankyou = jQuery("#h_horizontal_url_imagen_destacada").val();
    console.log('CATEGORIA PARA THANK Impulsa: ' + jQuery("#formApp").data("categoria"));
    // Implementacion ajax de la imagen destacada
    jQuery(".img-header-thankyou").css({
      "background-image": "url(" + jQuery("#h_horizontal_url_imagen_destacada").val() + ")"
    });


    var ev = null;
    // Evento
    if (evento != null) {
      ev = evento.srcElement || evento.target;
    }
    // Validacion para saber si el evento viene de la caja de ciclo
    if (ev == null || typeof ev == "undefined" || ev == "") {
      jQuery("#formApp").data("ciclo", "");
    } else {
      jQuery("#formApp").data('ciclo', ev.attributes.value.nodeValue);
    }

    if (
      jQuery("#formApp").data("ciclo") == "" ||
      typeof jQuery("#formApp").data("ciclo") == "undefined"
    ) {
      console.log(
        "No ha seleccionado el ciclo: " +
          typeof jQuery("#formApp").data("ciclo")
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

      // Se registra el valor de la urlreferer
      this.formCookieService.appendCookieValue(
        "c_form_data",
        "urlreferrer",
        this.urlreferrer
      );

      let cookie_form_values = this.formCookieService.getCookieValues(
        "c_form_data"
      );

      // Preparamos los datos para la thank you page
      jQuery(".modal-header-formulario").hide("slow");
      jQuery(".modal-header-thankyou").show("slow");
      jQuery("#enviarTrd").hide();
      jQuery(".modal-body-form").hide("slow");
      jQuery(".modal-body-thankyou").show("slow");
      jQuery(".tercer-texto-thankyou").html(cookie_form_values["carrera"]);
      jQuery("#nombre-thankyou").html(cookie_form_values["nombre"]);

      /*Implementacion enviar datos BY SRP 28-01-2018*/
      jQuery("#txt-thanks").html("A través de UNITEC te Impulsa podrás trabajar para pagar tus estudios, en unos momentos un asesor te llamara para darte todo la información.");
      jQuery("#calcula-tu-beca").hide();
      /*End Implementacion enviar datos BY SRP 28-01-2018*/

      // Si no viene con evento
      console.log("EL EVENTO DESPUES DE CLICLEAR CICLO: ");
      console.log(ev);
      if (ev.id != "null" && ev.id != null && typeof ev.id != "undefined") {
        console.log("CICLO: " + ev.attributes.value.nodeValue);
        // Setear en la cookie el ciclo y en formApp
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "ciclo",
          ev.attributes.value.nodeValue
        );
      } else {
        console.log("El evento no esta definido para el ciclo");
      }

      /*Implementacion enviar datos BY SRP 17-01-2018*/
      // Convertir a JSON la Cookie
      let dataForm = JSON.parse( JSON.stringify( this.formCookieService.getCookieValues("c_form_data") ) );

      jQuery
      .ajax({
        type: "POST",
        url: "//" + document.domain + this.url_ajax_php,
        data: { theData: this.formCookieService.getCookieValues("c_form_data") },
        dataType: "JSON",
        success: function(res) {
          // Proceso tag manager
          if (typeof dataLayer != 'undefined') {dataLayer.push({'event': 'PASO2_COMPLETADO'});}

          if(res.tipo == 'dupli'){
              if (typeof dataLayer != 'undefined') {dataLayer.push({'event': 'FORMULARIO_DUPLICADO'});}
              dataLayer.push({
                  'url_value': 'formularioInformacion/frmDuplicado', // dato dinámico
                  'event': 'StepForm'// dato estático
              });
          }

          if(res.tipo == 'nuevo'){

              let clientId="";

               if (typeof dataLayer != 'undefined') {
                  dataLayer.push({'event': dataForm.banner});
                  ga(function(tracker) { clientId = tracker.get('clientId');});

                  dataLayer.push({
                  'leadId': clientId, // dato dinámico
                  'CDClientID':clientId,
                  'origenLead': 'frmTradicional', // dato dinámico
                  'isAlumn': dataForm.esAlumno, // dato dinámico
                  'ingress': dataForm.tipoRegistro, // dato dinámico
                  'state': dataForm.estado, // dato dinámico
                  'levelStudies': dataForm.nivelInteres, // dato dinámico
                  'Period': dataForm.ciclo, // dato dinámico
                  'carrera': dataForm.idCarrera, // dato dinámico
                  'campus': dataForm.campus, // dato dinámico
                  'date': new Date(), // dato dinámico
                  'event': 'leadGeneration'// dato estático
                  });

              }
              if (typeof dataLayer != 'undefined') {
                  dataLayer.push({'event': 'FORMULARIO_REGISTRO'});
              }
          }
          // End Proceso tag manager

          // Se redirige al PDF de Vacantes
          setTimeout(function(){ window.open("http://www.unitec.mx/folleto/impulsa.pdf"); }, 3000);
          // setTimeout(function(){ window.location.href = "http://www.unitec.mx/folleto/impulsa.pdf"; }, 3000);
          // End Se redirige al PDF de Vacantes
        },
        error: function(xhr, textStatus, error){
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }
      });
      /*End Implementacion enviar datos BY SRP 17-01-2018*/

    } // Fin del else para la validacion del ciclo
  }
  /*End Metodo para Enviar a Impulsa BY SRP 17-01-2018*/


  /*Metodo para enviar a Impulsa BY SRP 17-01-2018*/
  sendFormularioOrientacion(evento = null) {
    // Si no esta la imagen destacada se asigna la imagen predeterminada
    let url_multimedia_thankyou = jQuery("#h_horizontal_url_imagen_destacada").val();
    console.log("CATEGORIA PARA THANK Impulsa: " + jQuery("#formApp").data("categoria"));
    // Implementacion ajax de la imagen destacada
    $.ajax({
      type: "POST",
      url: "//" + document.domain + "/wp-admin/admin-ajax.php",
      data: {
        action: "getAttachmentUrlByID",
        page_id: jQuery("#formApp").data("categoria")
      },
      success: function(data) {
        // var obj = JSON.parse(data);
        // url_multimedia_thankyou = obj.img_url;
        // //console.log(url_multimedia_thankyou);
        // console.log(obj);
        // if (
        //   url_multimedia_thankyou == "" ||
        //   typeof url_multimedia_thankyou == "undefined" ||
        //   url_multimedia_thankyou == "undefined" ||
        //   url_multimedia_thankyou == null
        // ) {
        //   console.log("Producto sin imagen destacada o sin sku asignado");
        //   url_multimedia_thankyou = "//" + document.domain + "/assets/defaultImage.jpg";
        // }
        // console.log( "//" + document.domain + "/assets/defaultImage.jpg" );
        // //Asignar imagen predeterminada de Thank you page
        // try {
        //   jQuery(".img-header-thankyou").css({
        //     "background-image": "url(" + "//" + document.domain + "/assets/defaultImage.jpg" + ")"
        //   });
        // }catch(error) {
        //   jQuery(".img-header-thankyou").css({
        //     "background-image": "url(" + "//" + document.domain + "/assets/defaultImage.jpg" + ")"
        //   });
        // }
        try{
          jQuery(".img-header-thankyou").css({
            "background-image": "url(" + jQuery("#h_horizontal_url_imagen_destacada").val() + ")"
          });
        }catch(error){
          jQuery(".img-header-thankyou").css({
            "background-image": "url(" + jQuery("#h_horizontal_url_imagen_destacada").val() + ")"
          });
        }
      }
    });

    let ev = null;
    // Evento
    if (evento != null) {
      ev = evento.srcElement || evento.target;
    }
    // Validacion para saber si el evento viene de la caja de ciclo
    if (ev == null || typeof ev == "undefined" || ev == "") {
      jQuery("#formApp").data("ciclo", "");
    } else {
      jQuery("#formApp").data("ciclo", ev.attributes.value.nodeValue);
    }

    if (
      jQuery("#formApp").data("ciclo") == "" ||
      typeof jQuery("#formApp").data("ciclo") == "undefined"
    ) {
      console.log(
        "No ha seleccionado el ciclo: " +
          typeof jQuery("#formApp").data("ciclo")
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

      // Se registra el valor de la urlreferer
      this.formCookieService.appendCookieValue(
        "c_form_data",
        "urlreferrer",
        this.urlreferrer
      );

      let cookie_form_values = this.formCookieService.getCookieValues(
        "c_form_data"
      );

      // Preparamos los datos para la thank you page
      jQuery(".modal-header-formulario").hide("slow");
      jQuery(".modal-header-thankyou").show("slow");
      jQuery("#enviarTrd").hide();
      jQuery(".modal-body-form").hide("slow");
      jQuery(".modal-body-thankyou").show("slow");
      jQuery(".tercer-texto-thankyou").html(cookie_form_values["carrera"]);
      jQuery("#nombre-thankyou").html(cookie_form_values["nombre"]);

      /*Implementacion enviar datos BY SRP 28-01-2018*/
      jQuery("#txt-thanks").html("Descubre cuáles son tus aptitudes y qué profesiones se ajustan a tu perfil, espera unos momentos y comenzará el test.");
      jQuery("#calcula-tu-beca").hide();
      /*End Implementacion enviar datos BY SRP 28-01-2018*/

      // Si no viene con evento
      console.log("EL EVENTO DESPUES DE CLICLEAR CICLO: ");
      console.log(ev);
      if (ev.id != "null" && ev.id != null && typeof ev.id != "undefined") {
        console.log("CICLO: " + ev.attributes.value.nodeValue);
        // Setear en la cookie el ciclo y en formApp
        this.formCookieService.appendCookieValue(
          "c_form_data",
          "ciclo",
          ev.attributes.value.nodeValue
        );
      } else {
        console.log("El evento no esta definido para el ciclo");
      }

      /*Implementacion enviar datos BY SRP 17-01-2018*/
      // Convertir a JSON la Cookie
      let dataForm = JSON.parse( JSON.stringify( this.formCookieService.getCookieValues("c_form_data") ) );

      jQuery.ajax({
        type: "POST",
        url: "//" + document.domain + this.url_ajax_php,
        data: { theData: this.formCookieService.getCookieValues("c_form_data") },
        dataType: "JSON",
        success: function(res) {
            // Proceso tag manager
          if (typeof dataLayer != 'undefined') {dataLayer.push({'event': 'PASO2_COMPLETADO'});}

          if(res.tipo == 'dupli'){
              if (typeof dataLayer != 'undefined') {dataLayer.push({'event': 'FORMULARIO_DUPLICADO'});}
              dataLayer.push({
                  'url_value': 'formularioInformacion/frmDuplicado', // dato dinámico
                  'event': 'StepForm'// dato estático
              });
          }

          if(res.tipo == 'nuevo'){

              let clientId="";

               if (typeof dataLayer != 'undefined') {
                  dataLayer.push({'event': dataForm.banner});
                  ga(function(tracker) { clientId = tracker.get('clientId');});

                  dataLayer.push({
                  'leadId': clientId, // dato dinámico
                  'CDClientID':clientId,
                  'origenLead': 'frmTradicional', // dato dinámico
                  'isAlumn': dataForm.esAlumno, // dato dinámico
                  'ingress': dataForm.tipoRegistro, // dato dinámico
                  'state': dataForm.estado, // dato dinámico
                  'levelStudies': dataForm.nivelInteres, // dato dinámico
                  'Period': dataForm.ciclo, // dato dinámico
                  'carrera': dataForm.idCarrera, // dato dinámico
                  'campus': dataForm.campus, // dato dinámico
                  'date': new Date(), // dato dinámico
                  'event': 'leadGeneration'// dato estático
                  });

              }
              if (typeof dataLayer != 'undefined') {
                  dataLayer.push({'event': 'FORMULARIO_REGISTRO'});
              }
          }
          // End Proceso tag manager

          // Se redirige al proceso de Orientación pprofesional
          setTimeout(function() { window.location.href = window.location.href= res.urlcc; }, 3000);
          // End Se redirige al proceso de Orientación pprofesional
        },
        error: function(xhr, textStatus, error) {
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
        }

    })

      /*End Implementacion enviar datos BY SRP 17-01-2018*/

    } // Fin del else para la validacion del ciclo
  }
  /*End Metodo para Enviar a Impulsa BY SRP 17-01-2018*/






  sendFormularioExpuesto(formData, hiddenData) {
    const urlsFormularioTradicional = [
      '//local.unitec2017/wp-content/phpServeApp/backend0.php'
    ];

    const theData = [];

    theData.push(formData);
    theData.push(hiddenData);

    const response = this.send(theData, urlsFormularioTradicional);
    // return response
  }

  sendFormularioSearchGoogle(formData) {}
}
