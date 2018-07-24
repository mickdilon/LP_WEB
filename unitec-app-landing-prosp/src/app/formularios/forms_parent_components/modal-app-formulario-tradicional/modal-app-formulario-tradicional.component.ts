import { Component, OnInit, Input } from "@angular/core";
import { GenericService } from "../../../services/generic.service";
//Servicio de cookie
import { formCookiesService } from "../../forms_services/formCookies.service";
import {ViewEncapsulation} from '@angular/core';

declare let jQuery;
declare let $;
declare let wistiaApi: any;

@Component({
  selector: "modal-app-formulario-tradicional",
  templateUrl: "./modal-app-formulario-tradicional.component.html",
  styleUrls: ["./modal-app-formulario-tradicional.component.scss"],
  providers: [formCookiesService],
  encapsulation: ViewEncapsulation.Emulated
})
export class ModalAppFormularioTradicionalComponent implements OnInit {
  titulo_modal_formulario: any = "Tu profesión";
  recurso_predeterminado: any = "//www.youtube.com/embed/ESLIW1la8LY";
  constructor(
    private genericService: GenericService,
    private formCookiesService: formCookiesService
  ) {
    //Al cargar el dom
    jQuery(document).ready(function() {
      var y;
      var x;
      //Deshabilidar el scroll al abrir el modal
      jQuery("#modal_frm_app").modal();
      jQuery("#modal_frm_app").on("shown.bs.modal", function(e) {
        //e.preventDefault();
        //var x=window.scrollX;
        //var y=window.scrollY;
        //window.onscroll=function(){window.scrollTo(x, y);};
        console.log(window.scrollY);
        x=window.scrollX;
        y=window.scrollY;
        $('body').css('overflow', 'hidden');
        //jQuery("body").css({ "overflow-y" : "hidden" });
        jQuery("html").css({ "position" : "fixed" });
        jQuery("body").css({ "position" : "fixed" });

        //window.onscroll=function(){window.scrollTo(x, y);};
        console.log("jeab - pos - open" + y);
      });

      jQuery("#modal_frm_app").on("hidden.bs.modal", function(e) {
        console.log("Aqui y: " + y);
        //window.onscroll=function(){};
        //jQuery("html").css({ "overflow-y" : "" });
        jQuery("body").css({ "overflow" : "" });
        
        jQuery("html").css({ "position" : "" });
        jQuery("body").css({ "position" : "" });
        console.log("jeab - pos closed" + y);
        window.scrollTo(x, y);
      });

      //Saltar paso 1 del formulario
      function saltarRegistro() {
        //Setear el primer titulo
        jQuery(".app-menu-title").html("Selecciona tu estado");
        //Preparar para el segundo paso o aplicacion (Se oculta todo lo del primer paso y se muestra lo del segundo paso)
        jQuery(".modal-header-formulario").hide("slow");
        jQuery(".frm-politicas").hide("slow");
        jQuery("#paso1").hide("slow");
        jQuery("#continuarTrd").hide("slow");
        jQuery("#paso2").show("slow");
        jQuery(".modal-header-app").show("slow");
        jQuery(".modal-body-form").show("slow");
        //Quitamos el margen para el formulario
        jQuery(".modal-body").css("margin-top", "0px");
        //Deshabilitar flecha izquierda después de llenar el formulario no es posible regresar
        jQuery(".app-left-arrow").css("visibility", "hidden");
        //Colocar el evento siguiente a la flecha derecha por el momento es seleccionar linea de negocio
        //Recibe evento selector y nombrepaso (linea, campus, producto, ciclo)
        //bindNavButtons("click", ".app-rigth-arrow", "linea");
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
      }
      //Binding a los botones de navegacion
      function bindNavButtons(evento, selector, avanza_a_seccion) {
        //Limpiar de eventos
        jQuery(selector).unbind(evento);
        //Validacion de los diferentes pasos
        switch (avanza_a_seccion) {
          case "linea":
            jQuery(selector).unbind();
            jQuery(selector).bind(evento, event =>
              seleccionarLineaNegocio(event)
            );
            break;
          default:
            break;
        }
      }
      function seleccionarLineaNegocio(event) {
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
        } else {
          console.log("Avanza a linea");
          //Ocultamos el selector actual
          jQuery(".col-estados").hide("slow");
          //Mostramos el siguiente selector
          jQuery(".col-lineas-negocio").show("slow");
        }
      }

      //metodo para calcular la velocidad de carga y autoplay de videos
      function autoPlayVideos(
        tipo_video,
        url_recurso_validar_descarga,
        kbps_para_autoplay
      ) {
        //Detectar la velocidad promedio del navegador yeah baby
        var startTime, endTime, fileSize;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            endTime = new Date().getTime();
            fileSize = xhr.responseText.length;
            var speed = fileSize * 8 / ((endTime - startTime) / 1000) / 1024;
            var speed_int = Math.floor(speed);
            console.log(speed_int + " Kbps\n");
            if (speed_int >= kbps_para_autoplay) {
              if (tipo_video == "youtube") {
                //En caso de que la descarga sea mayor a 700 autoreproducimos el video
                $(".ytp-cued-thumbnail-overlay-image").click();
                $("#iframeytform")[0].contentWindow.postMessage(
                  '{"event":"command","func":"' + "playVideo" + '","args":""}',
                  "*"
                );
              } else if (tipo_video == "wistia") {
                console.log("Autoplay al video de wistia");
                setTimeout(function() {
                  wistiaApi.play();
                }, 500);
              }
            } //Termina if de velocidad
          }
        };
        startTime = new Date().getTime();
        xhr.open("GET", url_recurso_validar_descarga, true);
        xhr.send();
      }

      //Variables de inicializacion
      //Titulo del modal
      var titulo_modal_formulario: any = "Tu profesión";
      //Recurso predeterminado en caso de que no exista imagen destacada o video wistia/youtube
      //var recurso_predeterminado: any = "//www.youtube.com/embed/ESLIW1la8LY";
      var recurso_predeterminado;
      //Validacion para saber si el tipo recurso [wistia/youtube/imagen]
      var tipo_recurso = "";
      //Url del archivo que se necesita descargar para evaluar la velocidad de la conexion para saber si se autoreproduce
      var url_recurso_validar_descarga =
        "//unitecmx-universidadtecno.netdna-ssl.com/wp-content/themes/temaunitec/calculadora/js/min/bootstrap-slider.min.js";
      //El limite de kbps para iniciar la autoreproduccion del video
      var kbps_para_autoplay = 700;
      //Variable para validar si la cookie ya tiene valores
      var valores_cookie = "false";
      //Variable para saber en que paso ponemos al prospecto dependiendo los valores de la cookie [0 = se muestra todo, 1 = paso 1 completado, 2 = paso 2 completado]
      var paso_cookie_formulario = 0;
      //Variable donde se almacenan los valores de la cookie
      var arr_obj_cookie_values = "";
      //Si presionamos el boton chevron left cerramos el modal
      jQuery("#head_close_modal").on("click", function() {
        jQuery("#modal_frm_app").modal("hide");
      });

      //Validacion para saber si existe la cookie y si existe ya no se muestra el formulario se manda a la thank you page JEAB
      //Si ya existe la cookie no se muestra el formulario se abre la página thankyou o la página personalizada
      //La cookie debe tener todos los valores del formulario lleno por completo
      if (formCookiesService.checkCookie("c_form_data") == true) {
        //Obtener todos los valores de la cookie
        arr_obj_cookie_values = formCookiesService.getCookieValues(
          "c_form_data"
        );
        //Validamos los valores de la cookie para ver si ya no le pedimos los datos de contacto
        if (
          arr_obj_cookie_values["nombre"] != "" &&
          typeof arr_obj_cookie_values["nombre"] != "undefined" &&
          (arr_obj_cookie_values["apaterno"] != "" &&
            typeof arr_obj_cookie_values["apaterno"] != "undefined") &&
          (arr_obj_cookie_values["amaterno"] != "" &&
            typeof arr_obj_cookie_values["amaterno"] != "undefined") &&
          (arr_obj_cookie_values["celular"] != "" &&
            typeof arr_obj_cookie_values["celular"] != "undefined") &&
          (arr_obj_cookie_values["email"] != "" &&
            typeof arr_obj_cookie_values["email"] != "undefined") &&
          (arr_obj_cookie_values["tipoRegistro"] != "" &&
            typeof arr_obj_cookie_values["tipoRegistro"] != "undefined")
        ) {
          //Formulario de registro completado
          paso_cookie_formulario = 1;
          valores_cookie = "true";
        }
        //Validamos si tiene los valores necesarios para pasarlo hasta la thankyou page
        if (
          arr_obj_cookie_values["campus"] != "" &&
          typeof arr_obj_cookie_values["campus"] != "undefined" &&
          (arr_obj_cookie_values["carrera"] != "" &&
            typeof arr_obj_cookie_values["carrera"] != "undefined") &&
          (arr_obj_cookie_values["categoria"] != "" &&
            typeof arr_obj_cookie_values["categoria"] != "undefined") &&
          (arr_obj_cookie_values["ciclo"] != "" &&
            typeof arr_obj_cookie_values["ciclo"] != "undefined") &&
          (arr_obj_cookie_values["estado"] != "" &&
            typeof arr_obj_cookie_values["estado"] != "undefined") &&
          (arr_obj_cookie_values["idCarrera"] != "" &&
            typeof arr_obj_cookie_values["idCarrera"] != "undefined") &&
          (arr_obj_cookie_values["linea"] != "" &&
            typeof arr_obj_cookie_values["linea"] != "undefined") &&
          (arr_obj_cookie_values["modalidad"] != "" &&
            typeof arr_obj_cookie_values["modalidad"] != "undefined") &&
          (arr_obj_cookie_values["nivelInteres"] != "" &&
            typeof arr_obj_cookie_values["nivelInteres"] != "undefined") &&
          (arr_obj_cookie_values["subnivelinteres"] != "" &&
            typeof arr_obj_cookie_values["subnivelinteres"] != "undefined") &&
          (arr_obj_cookie_values["tipoRegistro"] != "" &&
            typeof arr_obj_cookie_values["tipoRegistro"] != "undefined")
        ) {
          //Seleccion de carrera/campus/modalidad completado
          paso_cookie_formulario = 2;
          valores_cookie = "true";
        }
      }
      //Modificación para landing page JEAB
      valores_cookie = "false";
      //Si existe la cookie validamos a que paso del formulario lo saltamos
      if (valores_cookie == "true") {
        //Como tiene valores en la cookie validamos de que paso tiene los valores de la cookie completos
        //En este caso saltamos el registro por que ya tenemos los datos
        if (paso_cookie_formulario == 1) {
          jQuery(".modal-header-app").hide();
          jQuery(".modal-header-formulario").hide();
          jQuery(".modal-body-form").hide();
          saltarRegistro();
          //En este caso ya tiene registro y la interaccion completa lo saltamos ala thank you page
        } else if (paso_cookie_formulario == 2) {
          //Al mostrar el modal ocultamos los pasos que no corresponden
          //Y llenamos los datos de la thkyp con la cookie
          jQuery("#modal_frm_app").on("show.bs.modal", function(e) {
            //Ocultar en caso de que ya exista
            jQuery(".modal-header-app").hide();
            jQuery(".modal-header-formulario").hide();
            jQuery(".modal-body-form").hide();
            //Llenar los campos de la thankyou page con los valores de la cookie
            jQuery(".tercer-texto-thankyou").html(
              formCookiesService.getCookieByKey("c_form_data", "carrera")
            );
            jQuery("#nombre-thankyou").html(
              formCookiesService.getCookieByKey("c_form_data", "nombre")
            );
            //Mostrar la thankyou page
            jQuery(".modal-header-thankyou").show();
            jQuery(".modal-body-thankyou").show();
            jQuery(".img-header-thankyou").css({
              "background-image": "url(" + jQuery("#h_horizontal_url_imagen_destacada").val() + ")"
            });
          });
        }

        //Si no existe seguimos el flujo normal
      } else {
        //Obtenemos la url del recurso para formulario del input hidden url_multimedia_formulario
        var url_multimedia_formulario = "jpgdd";
        if (
          url_multimedia_formulario == "" ||
          typeof url_multimedia_formulario == "undefined"
        ) {
          //Si no tiene video de youtube o wistia obtenemos la imagen destacada
          url_multimedia_formulario = jQuery("#h_horizontal_url_imagen_destacada").val();
          //Si no existe la imagen destacada cargamos el recurso predeterminado
          if (
            url_multimedia_formulario == "" ||
            typeof url_multimedia_formulario == "undefined"
          ) {
            url_multimedia_formulario = recurso_predeterminado;
          }
        }

        //HTML para el recurso youtube
        var youtube_div =
          '\
            <div id="yt-container" class="hs-responsive-embed-youtube">\
              <iframe id="iframeytform" width="560" height="315" src="' +
          url_multimedia_formulario +
          '?enablejsapi=1&version=3&playerapiid=ytplayer&mute=1" frameborder="0" allowfullscreen="true" allowscriptaccess="always">\
              </iframe>\
            </div>';
        //Html del header del modal en caso de tener contenido multimedia
        var header_multimedia_div =
          '\
            <div class="container titulo-logo">\
              <div class="row">\
                <div class="col-2 logo-formulario">\
                \
                </div>\
                <div class="col-10 titulo-formulario">\
                  <h1>' +
          "Tu profesión" +
          "</h1>\
                </div>\
                </div>\
            </div>";
        //Html para el recurso wistia
        var wistia_div =
          '\
            <div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;">\
              <div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;">\
                <iframe src="' +
          url_multimedia_formulario +
          '" title="Wistia video player" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%">\
                </iframe>\
              </div>\
            </div>';
        //Validamos si es imagen video de youtube o video de wistia
        /*if (url_multimedia_formulario.indexOf("youtube") != -1) {
          tipo_recurso = "youtube";
        } else if (url_multimedia_formulario.indexOf("wistia") != -1) {
          tipo_recurso = "wistia";
        } else*/ if (url_multimedia_formulario.indexOf("jpg") != -1 || url_multimedia_formulario.indexOf("png") != -1 || url_multimedia_formulario.indexOf("jpge") != -1 || url_multimedia_formulario.indexOf("gif") != -1) {
          tipo_recurso = "imagen";
        }

        //Validamos el tipo de recurso para cargar el html dependiendo de eso
        console.log("Tipo recurso" + tipo_recurso);
        if (tipo_recurso == "youtube") {
          console.log("Recurso YT");
          jQuery(".contenedor-header-p").addClass("margin-padding-video");
          jQuery(".contenedor-header-p").html(youtube_div);
          jQuery(".modal-body-form").prepend(header_multimedia_div);
          jQuery(".modal-body-form").addClass("margen-para-video");
          jQuery(".modal-header-formulario").addClass(
            "modal-header-formulario-ytv"
          );
          //Detectar si se abrio el modal y si es video y con que red para
          //Autoreproducir segun los parametros
          jQuery("#modal_frm_app").on("show.bs.modal", function(e) {
            autoPlayVideos(
              tipo_recurso,
              url_recurso_validar_descarga,
              kbps_para_autoplay
            );
            console.log("Se abrio el modal para youtube");
          });
          //Al ocultar el modal
          jQuery("#modal_frm_app").on("hide.bs.modal", function(e) {
            console.log("Se cerro el modal youtube");
            $("#iframeytform")[0].contentWindow.postMessage(
              '{"event":"command","func":"' + "stopVideo" + '","args":""}',
              "*"
            );
          });
          console.log("Recurso youtube");
        } else if (tipo_recurso == "wistia") {
          console.log("Recurso wistia");
          jQuery(".contenedor-header-p").addClass("margin-padding-video");
          jQuery(".contenedor-header-p").html(wistia_div);
          jQuery(".modal-body-form").prepend(header_multimedia_div);
          //Añadir clases para ajustar el header
          jQuery(".modal-header-formulario").addClass("header-wistia");
          jQuery(".modal-header-formulario").addClass(
            "modal-header-formulario-ytv"
          );
          //Al abrir el modal
          jQuery("#modal_frm_app").on("show.bs.modal", function(e) {
            jQuery(".contenedor-header-p").html(wistia_div);
            autoPlayVideos(
              tipo_recurso,
              url_recurso_validar_descarga,
              kbps_para_autoplay
            );
            console.log("Se abrio el modal wistia");
          });

          //Al ocultar el modal
          jQuery("#modal_frm_app").on("hide.bs.modal", function(e) {
            console.log("Se cerro el modal wistia");
            $(".wistia_embed")
              .empty()
              .remove();
          });
        } else if (tipo_recurso == "imagen" && navigator.userAgent.indexOf("Mob") != -1) {
          console.log("Recurso imagen");
          //alert("Imagen");
          //Asignar la clase para corregir posicion horizontal en caso de ser imagen
          jQuery(".modal-header-formulario").addClass("modal-header-form-img-h");
          jQuery(".img-header-formulario").css({
            "background-image": "url(" + url_multimedia_formulario + ")"
          });
        }
      }
    }); //Fin de document ready
  } //Fin del constructor

  //Hook ngOnInite
  ngOnInit() {}
  //link para abrir el boton de calculadora
  calculadora() {
    window.open("//www.unitec.mx/calcula-tu-beca/", "_blank");
  }
} //Fin de clase
