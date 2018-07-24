/**
 * 9-05-2017: JEAB - Servicio que consume archivos Json en los diferentes constructores.
 * 
 */
import { Injectable, Inject } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { DOCUMENT } from "@angular/platform-browser";
import "rxjs/add/operator/toPromise";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { AbstractControl } from "@angular/forms";
declare var $: any;
declare var jQuery: any;

@Injectable()
export class getJson {
  private headers = new Headers({ Accept: "application/json" });
  private options = new RequestOptions({ headers: this.headers });
  private protocol = "https:";
  private urlJsonBasura = "/lp_web/recursos/json_basura.min.json";
  private urlJsonBasuraEmail = "/lp_web/recursos/json_basuraEmail.min.json";
  private urlJsonCarreras = "/lp_web/recursos/json_calc_carreras.min.json";
  //Se agrega nueva url para obtener los links y nombre de las categorias de las carreras
  private urlJsonLinksCategorias = "/lp_web/recursos/json_calc_linkPaginas.min.json";
  //Se agregan variables para calculadora
  //Costos
  private urlJsonCalcCostos = "/lp_web/recursos/json_calc_costos.min.json";
  //Becas
  private urlJsonCalcBecas = "/lp_web/recursos/json_calc_becas.min.json";
  //JQuery
  private $: any;
  private urlProvisional = "/formularios/jsons/";

  //Constructor
  constructor(private http: Http, @Inject(DOCUMENT) private document) {}

  /** 
   * Metodos para los json de formularios
   * **/

  //Para las llamdas ajax https en produccion no se debe colocar el dominio, solo la ruta relativa
  //Funcion para obtener el json de carreras
  getJsonCarreras() {
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//" + document.domain + this.urlJsonCarreras,
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonCarreras", JSON.stringify(resultado));
        console.log("Done: Resultado unitec: ");
        console.log(resultado);
      });
  }
  /**
   * 
   * 
   * 
   * Aqui empiezan los json de solvis
   * 
   * 
   * 
   * 
   */
  getJsonCarrerasJsonCRM() {
    console.log("DENTRO DE GETJSONCRM");
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//app.devmx.com.mx/assets/nivel_estudios.json",
        // url: this.urlProvisional + "nivel_estudios.json",
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonCarrerasCRM", JSON.stringify(resultado));
        console.log("Done: Resultado solvis: ");
        console.log(resultado);
      });
  }

  getJsonProductosJsonCRM() {
    console.log("DENTRO DE getJsonProductosJsonCRM");
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//app.devmx.com.mx/assets/campus_nivel.json",
        // url: this.urlProvisional + "campus_nivel.json",
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonProductosCRM", JSON.stringify(resultado));
        console.log("Done: Resultado solvis: ");
        console.log(resultado);
      });
  }


  getJsonDetalleProductosCRM() {
    console.log("DENTRO DE getJsonProductosJsonCRM");
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//app.devmx.com.mx/assets/carrera.json",
        // url: this.urlProvisional + "carrera.json",
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonDetalleProductosCRM", JSON.stringify(resultado));
      });
  }

  getJsonModalidadesCRM() {
    console.log("DENTRO DE getJsonModalidadesCRM");
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//app.devmx.com.mx/assets/modalidad.json",
        // url: this.urlProvisional + "modalidad.json",
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonModalidadCRM", JSON.stringify(resultado));
      });
  }

  getJsonCampusCRM() {
    console.log("DENTRO DE getJsonCampusCRM");
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//app.devmx.com.mx/assets/campuss.json",
        // url: this.urlProvisional + "campuss.json",
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonCampusCRM", JSON.stringify(resultado));
      });
  }
  //Obtener el json de prioridad attemp equipo
  getPrioridadAttemp() {
    console.log("DENTRO DE getPrioridadAttemp");
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//app.devmx.com.mx/assets/fuente_negocio/WEB_Calculado.json",
        // url: this.urlProvisional + "web-calculado.json",
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonPrioridadCRM", JSON.stringify(resultado));
      });
  }

//Obtener los json de ciclo

getCiclosSolvis() {
  console.log("DENTRO DE getCiclosSolvis");
  jQuery
    .ajax({
      type: "GET",
      //url: this.urlJsonCarreras,
      url: "//app.devmx.com.mx/assets/ciclo.json",
      // url: this.urlProvisional + "ciclo.json",
      "Content-Type": "application/json",
      dataType: "json",
      success: function(resultado) {}
    })
    .done(function(resultado) {
      localStorage.setItem("jsonCiclosSolvis", JSON.stringify(resultado));
    });
}

  /**
   * 
   * 
   * 
   * Aqui terminan los json de solvis
   * 
   * 
   * 
   * 
   */


  //Funcion para obtener el json de links y categorias
  getJsonLinksCategorias() {
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonLinksCategorias,
        url: "//" + document.domain + this.urlJsonLinksCategorias,
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonLinksCategorias", JSON.stringify(resultado));
      });
  }

  //Funcion para traer el Json de basura con jquery ajax
  getJsonBasura() {
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonBasura,
        url: "//" + document.domain + this.urlJsonBasura,
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        jQuery("#data_json_basura").val(1);
        jQuery("#data_json_basura").data(JSON.parse(JSON.stringify(resultado)));
        //console.log($("#data_json_basura").data());
      });
  }
  //Funcion para traer el Json de email basura con jquery ajax
  getJsonBasuraEmail() {
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonBasuraEmail,
        url: "//" + document.domain + this.urlJsonBasuraEmail,
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        jQuery("#data_json_basura_email").val(1);
        jQuery("#data_json_basura_email").data(
          JSON.parse(JSON.stringify(resultado))
        );
        //console.log($("#data_json_basura").data());
      });
  }
  //Funcion para traer el Json de basura con observable
  getBasuraObs() {
    let response;
    let subscriptionBasuraJson = this.http
      .get( "//" + document.domain + this.urlJsonBasura, this.options)
      .map((res: any) => res.json())
      .catch((error: any) => {
        return Observable.throw(error.statusText);
      });
    subscriptionBasuraJson.subscribe(
      res => {
        response = res;
      },
      error => {
        console.log(error);
      },
      () => {
        console.log("done");
        if (this.document.readyState == "complete") {
          this.document.getElementById("data_json_basura").value = true;
          this.document.getElementById(
            "data_json_basura"
          ).dataset.json = JSON.stringify(response);
          //this.document.body.data = JSON.parse(JSON.stringify(res));
        }
      }
    );
  }
  /** 
   * Metodos para los json de calculadora
   * **/

  //Obtener los costos de calculadora
  getJsonCalcCostos()
  {
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//" + document.domain + this.urlJsonCalcCostos,
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonCostos", JSON.stringify(resultado));
      }); 
  }
  //Obtener las becas
  getJsonBecasCalc()
  {
    jQuery
      .ajax({
        type: "GET",
        //url: this.urlJsonCarreras,
        url: "//" + document.domain + this.urlJsonCalcBecas,
        "Content-Type": "application/json",
        dataType: "json",
        success: function(resultado) {}
      })
      .done(function(resultado) {
        localStorage.setItem("jsonBecas", JSON.stringify(resultado));
      }); 
  }


}
