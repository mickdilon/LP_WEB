import { Component, OnInit, ViewEncapsulation, OnDestroy, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { userValidations } from '../../formularios/forms_services/validaciones.service';

import { sendService } from '../../formularios/forms_services/send.service';
import { WebspeachService } from '../../services/webspeach.service';
import { AutocompleteService } from '../../services/autocomplete.service';
import { NavegadorService } from '../../services/navegador.service';
import { Animaciones} from '../../utilities/animaciones';

import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare let jQuery : any;

@Component({
  selector: 'formularioGCS',
  templateUrl: './formularioGCS.component.html',
  styleUrls: ['./formularioGCS.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers : [ userValidations, sendService, WebspeachService, AutocompleteService, NavegadorService ]
})

export class FormularioGCSComponent implements OnInit, OnDestroy{
    private headers = new Headers({ 'Accept': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    @Input() gcsExtrangero : string;

    titulo = 'Buscador general...';
    formGCS : FormGroup;
    formularioPadre : FormGroup;
    mensajError : boolean = false;
    elemVacio : boolean = false;
    whatsbrowser : string = null;
    tolerancia = 25;

    dataPageMap = '';
    categoria = '';

    itemsSearchResult : any;

    resultGCS : any;
    //En esta variable se almacena lo que web speach reconoce de la voz
    speechData: string;
    showSearchButton: boolean;

    primerPaso : string = 'faseUno';

    filtros = [
                { "id" : "",              "valor" : "TODO",          "class" : "class='active'" },
                { "id" : "Licenciaturas", "valor" : "LICENCIATURAS", "class" : "" },
                { "id" : "Ingenierias",   "valor" : "INGENIERIAS",   "class" : "" }
              ]

    constructor(private formBuilder : FormBuilder,
                private userValidations : userValidations,
                private sendService : sendService,
                private speechRecognitionService: WebspeachService,
                private http : Http,
                private autocomplete : AutocompleteService,
                private navegador : NavegadorService,
                private animaciones : Animaciones
                )
    {
        this.whatsbrowser = navegador.whatsBrowser();
        this.showSearchButton = true;
        this.speechData = "";
        let that = this;

        this.formGCS = formBuilder.group({
            faseUno : formBuilder.group({
                frm_GCS    : ''
            })
        });

        jQuery(document).ready(function(){
            jQuery('#buscador').on('shown.bs.modal', function (e) {
                jQuery('#tabs-buscador').ready(function(){
                    that.viewTabsAndControls( jQuery("#tabs-buscador"), 0 );
                    jQuery(".GCSCintillo").hide();
                })
            })
            jQuery( "#gcsextrangero" ).change( function(){
                let valor = jQuery(this).val();
                if( valor === "" ){
                    return;
                }
                jQuery(".typeahead-menu").hide();
                that.setField( valor );
                jQuery("#gcsextrangero").attr( "value", "" );
                jQuery( "#buscador" ).modal( "show" );
                that.makeRequets();
                return;
            });
            jQuery("#micExtrangero").click(function(){
                that.mic();
                jQuery( "#buscador" ).modal( "show" );
                return;
            });
        });
    }

    ngOnInit(){ 
        let that = this;
        jQuery(document).ready(function() {
            //Esta funcion manipula la seleccion de los tab de filtro
            jQuery('.GCSNav span').click(function() {
                jQuery(this).addClass('active').siblings().removeClass('active');
                that.categoria = jQuery(this).attr("id");
                that.makeRequets();
            });

            jQuery('.param-filter-gcs').click(function() {
                that.categoria = jQuery(this).attr("id");
                that.dataPageMap = jQuery(this).attr("dataPageMap");
                that.makeRequets();
            });

            //Llamada a autocomplete service.
            //that.autocomplete.callAutocomplete( '.inputGCS', "//www.googleapis.com/customsearch/v1?q=x&cx=002268575599804991473:n-g-9uohyde&ds&key=AIzaSyDaXorUVaC5oa53KwL4hnmx7NQDG82zC4g&dateRestrict=5&num=5&top=5" );
            that.autocomplete.callAutocomplete( '.inputGCS', "//clients1.google.com/complete/search?hl=en&output=toolbar&client=partner&source=gcsc&partnerid=002268575599804991473:n-g-9uohyde&ds=cse&nocache" );
            
            //Funcion implementada para cuando se selecciona desde autocomplete...
            jQuery('.inputGCS').bind( 'typeahead:selected', function(obj, datum , name ){
                that.setField( datum );
                that.makeRequets();
                jQuery(".inputGCS").blur();
            });
            jQuery('#micExtrangero').bind('typeahead:selected', function(obj, datum, name) {
                that.setField( datum );
                that.makeRequets();
                jQuery(".inputGCS").blur();
            });
        });
        return;
    }

    ngOnDestroy(){
        this.speechRecognitionService.DestroySpeechObject();
        this.resultGCS.unsubscribe();
        return;
    }

    activateSpeechSearch(): void {
        this.showSearchButton = true;

        this.speechRecognitionService.record()
            .subscribe(
            //listener
            (value) => {
                this.speechData = value;
                jQuery(".typeahead-menu").hide(500);
                this.desactivaMicro();
                this.setField( value );
                this.makeRequets();
                return;
            },
            (err) => {
                if (err.error == "no-speech") {
                    this.activateSpeechSearch();
                }
                return;
            },
            () => {
                this.showSearchButton = false;
                return;
            });
    }

    obsSearchWithGoogle( value ){        
        //variables para query string...
        let cx  = "&cx=002268575599804991473:n-g-9uohyde&ds";
        let key = "&key=AIzaSyDaXorUVaC5oa53KwL4hnmx7NQDG82zC4g";
        let q   = "q=" + value;
        let dateRestrict = "";
        let num = "";
        let top = "";

        let urlGoogleCustomSearch = "";

        let theCategory = this.categoria;
        let filtroCategoria = ""
        
        if( !( theCategory == "" ) && !( theCategory == null ) ){
            filtroCategoria = "+more:pagemap:document-" + this.dataPageMap + ":" + theCategory;
        }else{
            this.dataPageMap = null;
        }

        let urlGoogleCustomSearchMockfull  = "//www.calidadacademica.mx/wp-content/themes/temaunitec/assets/html/bannerSearch/mockupFull.json";
        let urlGoogleCustomSearchMockEmpty = "//www.calidadacademica.mx/wp-content/themes/temaunitec/assets/html/bannerSearch/mockupEmpty.json";
        
        if( value == "top" ){
            q="q=x", dateRestrict = "&dateRestrict=5", num = "&num=5", top = "&top=5"; filtroCategoria="";
        }

        urlGoogleCustomSearch = urlGoogleCustomSearchMockfull;
        //urlGoogleCustomSearch = urlGoogleCustomSearchMockEmpty;

        urlGoogleCustomSearch = "//www.googleapis.com/customsearch/v1?" + q + cx + key + dateRestrict + num + filtroCategoria + top;
        console.log(urlGoogleCustomSearch);
        if( value == "" || value == null ){
            jQuery("#preloadBuscador").hide();
            jQuery(".GCSCintillo").hide();
            this.setItemsSearchResult("vacio");
            jQuery(".msgGCS").hide();
            return;
        }else{
            this.resultGCS = this.http.get( urlGoogleCustomSearch, this.options )
            .map((res:any) => res.json() )
            .catch((error: any) => {
                return Observable.throw( error.statusText );
            });

            let response;
            this.resultGCS.subscribe(
                res => {
                    //alert("respuesta");
                    console.log("SUCCESS OBSERVABLE");
                    response = res;
                    jQuery("#preloadBuscador").hide();
                    if( Object.keys( response ).indexOf( "items" ) >= 0 ){
                        if ( this.mensajError == true ){
                            jQuery(".GCSCintillo").hide(500);
                            this.mensajError = false;
                        } else if ( this.elemVacio == true ){
                            jQuery( ".tabs-buscador li" ).first().addClass('active').siblings().removeClass('active');
                            this.categoria = "";
                            jQuery(".msgGCS").show(500);
                            jQuery(".GCSCintillo").hide(500);
                            this.elemVacio = false;
                        } else {
                            jQuery(".GCSCintillo").show();
                            jQuery(".msgGCS").hide(500);
                        }
                        this.setItemsSearchResult( response["items"], value );
                        jQuery(".inputGCS").focus();
                        return;
                    } else {
                        this.elemVacio = true;
                        this.obsSearchWithGoogle( "top" );
                        return;
                    }
                },
                err => {
                    //alert("error");
                    console.log("NOT SUCCESS OBSERVABLE");
                    console.log(err);
                    this.elemVacio = true;
                    jQuery("#preloadBuscador").hide();
                    jQuery("#preloadBuscador").html("En mantenimiento, intente más tarde.");
                    jQuery("#preloadBuscador").show();
                    //this.obsSearchWithGoogle( "top" );
                    return;
                }
            );
        }//Termina else de resultado vacio
    }

    setField( valor ){
        this.formGCS.setValue({  
            'faseUno' : {
                'frm_GCS' : valor
            } 
        });
        return;
    }

    makeRequets() {
        let value = this.formGCS.get("faseUno.frm_GCS").value;
        if( value != "" && value != null ){
            this.obsSearchWithGoogle( value );
            jQuery("#preloadBuscador").show(500);
            jQuery(".typeahead-menu").hide(500);
        }
    }

    //Esta funcion manipula el front del microfono y lo activa
    mic(){
        if( jQuery("#micGCS").attr("class").indexOf("active") > -1 ){
            this.desactivaMicro();
            if( this.formGCS.get("faseUno.frm_GCS").value == "" ){
                jQuery("#GCSCintillo").hide(500);
            }
        }else{
            this.activaMicro();
        }
        return; 
    }

    activaMicro(){
        jQuery("#micGCS").addClass("active");
        jQuery(".BuscadorGCS:first-child div").hide(500);
        jQuery(".speachMic").parent().show(500);
        jQuery(".mdlc").hide(500);
        this.setItemsSearchResult("vacio");
        this.activateSpeechSearch();
        return;
    }

    desactivaMicro(){
        jQuery("#micGCS").removeClass("active");
        jQuery(".BuscadorGCS:first-child div").show();
        jQuery(".speachMic").parent().hide(500);
        jQuery(".mdlc").show(500);
        jQuery(".typeahead-menu").hide();
        jQuery(".GCSCintillo").hide();
        jQuery(".msgGCS").hide();
        jQuery("#preloadBuscador").hide();
        this.speechRecognitionService.DestroySpeechObject();
        this.setItemsSearchResult("vacio");
        return;
    }

    //Esta funcion devuelve los resultados de la busqueda
    setItemsSearchResult( data, value_input = "" ){
        this.itemsSearchResult = data;
        
        let resultados = "";

        if( data !== "vacio" ){
            for( let item = 0; item < data.length; item++){
                resultados += 
                    '<header>' +
                        '<a href="' + data[item]['link'] + '" class="titulo">' + data[item]["htmlTitle"] +'</a><br>' +
                        '<a href="' + data[item]['link'] + '" class="link">' + data[item]["link"] + '</a>' +
                    '</header>' +
                    '<section>' + data[item]["htmlSnippet"] +'</section>'
            }
        }
        console.log("value input: " + value_input);
        if(value_input != "top") {
            jQuery(".inputGCS").val(value_input);
        }
        jQuery(".GCSresultItem").html( resultados );
    }

    //Esta funcion manipula los eventos del teclado 
    keyDownFunction(event) { // Enter
        if( event.keyCode == 13 ){
            this.makeRequets();
            jQuery(".typeahead-menu").hide(500);
        }
    }

    viewTabsAndControls( element, pos ){
        var posicion = pos;
        var maxScrollLeft = element[0]["scrollWidth"] - element[0]["clientWidth"];
        if( maxScrollLeft === 0){
            element.parent().siblings("i").css({ "display": "none" });
        }else if( posicion < this.tolerancia ){
            element.animate({ scrollLeft: 0 });
            element.parent().siblings( ".rightTabNav" ).css({ "display" : "block" });
            element.parent().siblings( ".leftTabNav"  ).css({ "display" : "none" });
        } else if ( posicion >= maxScrollLeft - this.tolerancia ){
            element.parent().siblings( ".rightTabNav" ).css({ "display" : "none" });
            element.parent().siblings( ".leftTabNav"  ).css({ "display" : "block" });
        }else{  
            element.parent().siblings("i").css({ "display": "block" });
        }
    }
}