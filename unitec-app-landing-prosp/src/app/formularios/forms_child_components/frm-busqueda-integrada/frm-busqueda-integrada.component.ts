import { Component, Input, OnInit } from '@angular/core';
import { reglasInputsService } from '../../forms_services/reglasInputs.service';
//Servicio de reconocimiento por voz
import { NavegadorService } from '../../../services/navegador.service';

//Servicio de cookie
import { formCookiesService } from "../../forms_services/formCookies.service";
import { ViewEncapsulation } from '@angular/core';

declare var jQuery : any;
declare var $ : any;

@Component({
  selector: 'frm-busqueda-integrada',
  templateUrl: './frm-busqueda-integrada.component.html',
  styleUrls: ['./frm-busqueda-integrada.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ NavegadorService,
                formCookiesService
            ]
})

export class frmBusquedaIntegradaComponent
{ 
    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;

    inputComponent : string;
    speechData: string;
    whatsbrowser : string;

    titulo_buscador : string = "Búsqueda Integral";
    contenido_buscador : string = "Bienvenido al servicio de busqueda integrada, tendrás la oportunidad de conocer la literatura sin salir de casa" ;

    constructor(
        private regIn:reglasInputsService,
        private navegador : NavegadorService,
        private formCookiesService: formCookiesService
      )
      {
        this.whatsbrowser = navegador.whatsBrowser();
        console.log(this.whatsbrowser);
      }
      //Inicializacion del componente
      ngOnInit() { }
      //Reglas de los input no se permiten caracteres especiales y tampoco mas de 2 letras consecutivas
      //Este metodo es diferente a las validaciones simplemente se bloquea el input para no permitir la entrada
      reglasInputs(objInput, keyCode, key)
      {
        let serviceResponse = this.regIn.EvaluateTextP(objInput, keyCode, key);
        return serviceResponse;
      }   

    sanitize_search(cadena) {
        // Definimos los caracteres que queremos eliminar
        var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,\"\ ";
     
        // Los eliminamos todos
        for (var i = 0; i < specialChars.length; i++) {
            cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }   
     
        // Lo queremos devolver limpio en minusculas
        cadena = cadena.toLowerCase();
     
        // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
        cadena = cadena.replace(/ /g,"_");
     
        // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
        cadena = cadena.replace(/á/gi,"a");
        cadena = cadena.replace(/é/gi,"e");
        cadena = cadena.replace(/í/gi,"i");
        cadena = cadena.replace(/ó/gi,"o");
        cadena = cadena.replace(/ú/gi,"u");
        cadena = cadena.replace(/ñ/gi,"n");
        cadena = cadena.replace(/%3A/gi,":");
        cadena = cadena.replace(/%3a/gi,":");
        cadena = cadena.replace(/3a/gi,"");
        return cadena;
    }

    busqueda_integrada(event){
      let that = this;        
      let admitido : boolean = false;
      let matricula : string;      
      let busqueda : any = ( ( jQuery("#input-busqueda-integrada").val() ) != null || jQuery("#input-busqueda-integrada").val() != "" ) ? jQuery("#input-busqueda-integrada").val() : false;

      if( that.formCookiesService.checkCookie("c_matricula") ){
        matricula = JSON.stringify( that.formCookiesService.getCookieValues("c_matricula") );
        matricula = that.sanitize_search( matricula );
        admitido= true;
      }

      busqueda = that.sanitize_search( busqueda );
      console.log( "matricula: " + matricula + " Admitido: " + admitido );

      if ( admitido && busqueda ) {
        window.open('https://primo4.gsl.com.mx/pds?func=load-login&calling_system=primo&institute=52unitec_inst&user=' + matricula + '&password=' + matricula + '&url=https://unitec-primo.hosted.exlibrisgroup.com:443/primo_library/libweb/pdsLogin?targetURL=https://unitec-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=52UNITEC_INST&lang=es_ES&sortby=rank&from-new-ui=1&authenticationProfile=PDS&query=any,contains,' + busqueda + '&tab=unitec_tab&search_scope=unitec_scope&offset=0', '_blank');
        console.log( 'https://primo4.gsl.com.mx/pds?func=load-login&calling_system=primo&institute=52unitec_inst&user=' + matricula + '&password=' + matricula + '&url=https://unitec-primo.hosted.exlibrisgroup.com:443/primo_library/libweb/pdsLogin?targetURL=https://unitec-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=52UNITEC_INST&lang=es_ES&sortby=rank&from-new-ui=1&authenticationProfile=PDS&query=any,contains,' + busqueda + '&tab=unitec_tab&search_scope=unitec_scope&offset=0' );
      } else{
        alert("favor de llenar todos los campos para una mejor búsqueda");
        return false;
      }          
       
    }
}