import { Component, Input, ElementRef } from '@angular/core';
import {reglasInputsService} from '../../forms_services/reglasInputs.service';
import { readJson } from '../../../services/readJson.service';
declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'frm-estudio-interes',
  templateUrl: './frm-estudio-interes.component.html',
  styleUrls: ['./frm-estudio-interes.component.scss']
})

export class frmEstudioInteresComponent
{

    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;
    //Parametrización de titulos para la eleccion de linea de negocio
    preguntaEstudioInteres : string = '¿Qué te interesa estudiar?';
    preguntaModalidad : string = '¿En qué modalidad?';
    preguntaCarrera : string = '¿Qué licenciatura?';
    preguntaCampus : string = '¿En qué campus?';
    resultadoPreguntas : string = 'Quiero estudiar:';
    //Resultados de la eleccion de la linea de negocio
    carreraResultado : string;
    modalidadResultado : string;
    campusResultado : string;
    //Cambio de texto dependiendo las opciones elegidas
    textoCambio : string;
    textoCambiarNivel : string = 'Cambiar nivel';
    textoCambiarCarrera : string = 'Cambiar carrera';
    textoCambiarModalidad : string = 'Cambiar modalidad';
    textoCambiarSeleccion : string = 'Cambiar selección';
    preguntaCiclo : string = '¿Cuando quieres entrar?';
    //Lineas de negocio
    lineasNegocio = [
       {'id': 'PREPARATORIA', 'name': 'Preparatoria'},
       {'id': 'LICENCIATURA', 'name': 'Licenciatura'},
       {'id': 'INGENIERIA', 'name': 'Ingeniería'},
       {'id': 'SALUD', 'name': 'Lic. en Salud'},
       {'id': 'POSGRADO', 'name': 'Posgrado'},
     ];


    constructor(private regIn:reglasInputsService, 
                private readJsonService:readJson, 
                private elRef:ElementRef
                )
    {

    }
    //Inicializacion del componente
    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_estudio_interes';
      jQuery("#secCarreras").hide();
      jQuery("#secModalidades").hide();
      jQuery("#secEstudio").hide();
      
    }
    getProductosDeLinea(evento, linea)
    {
        jQuery("#secCarreras").html("");
        this.resetEstudioValidation();
        //Se carga el id de la linea de negocio
        jQuery("#formApp").data("linea", linea);
        //Traemos las carreras de la linea de negocio
        let objCarreras = this.getCarreras(linea);
        //console.log("Carreras del json: ");
        let arrCarreras = [];
        for(var i = 0; i < objCarreras.length; i ++) {
            let iddiv = "div_carrera" + i;
            jQuery("#secCarreras").append('<div class="division-div" id="' + iddiv + '" #div_carrera style="padding-bottom: 10px;cursor:pointer;" value="' 
                                + objCarreras[i][0].Grupo_carreras 
                                + '" ' 
                                + '>' 
                                + objCarreras[i][0].Grupo_carreras 
                                + '</div>');
            //Seteamos el listener  
            let one = i;
            this.elRef.nativeElement.querySelector('#div_carrera' + one).addEventListener('click', 
                                (event) => this.getModalidades(event));
        }
        //Ocultamos la linea de interés
        jQuery("#secLineas").hide(320);
        //Se asigna pregunta de carrera dependiendo la linea seleccionada
        this.asignaPreguntaInteres(linea);
        jQuery(".titulo-interes").html(this.preguntaCarrera);
        //Texto para regresar a cambiar nivel de estudio
        this.textoCambio = this.textoCambiarNivel;
        jQuery(".texto-cambio").show();
        jQuery(".titulo-interes").removeClass("col-12");
        jQuery(".titulo-interes").addClass("col-6");
        /*this.elRef.nativeElement.querySelector('.texto-cambio').addEventListener('click', 
                                (event) => this.cambiarLineaNegocio(event));*/
        jQuery(".texto-cambio").unbind("click");
        jQuery(".texto-cambio").bind("click",(event) => this.cambiarLineaNegocio(event));
        jQuery(".texto-cambio").html(this.textoCambiarNivel);        
        //Mostramos las carreras
        jQuery("#secCarreras").show(320);
        //Si solo existe una carrera para la linea pasamos al siguiente nivel que es elegir modalidad
        if(objCarreras.length == 1) {
            jQuery("#div_carrera0").click();
        }
        //Setear revalidacion de estudios previos
        this.setRevalidaEstudios();
    }  
    //Trae las carreras del json de carreras
    getCarreras(linea, campus = "")
    {
        //jQuery("#select_lineas").html("");
        let keySearch = 'lineaweb';
        let arrayCarrerasPorLinea = [];
        let objJsonCarreras = JSON.parse(localStorage.getItem('jsonCarreras'));
        arrayCarrerasPorLinea = this.readJsonService.buscar(keySearch, linea, objJsonCarreras);
        //Construimos el arreglo para la vista
        //Closure para ordenar
        var filter:any;
        var compare = function (filter) {
            return function (a, b) {
                var a = a[filter],
                b = b[filter];
                if (a < b) {
                    return -1;
                }else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            };
        };
        //Seteamos el filtro y ordenamos por grupo_carreras
        filter = compare("Grupo_carreras");
        //Eliminar duplicados
        arrayCarrerasPorLinea = this.readJsonService.removeDuplicates(arrayCarrerasPorLinea,"Grupo_carreras");
        //Ordernar por nombre
        arrayCarrerasPorLinea.sort(filter);
        //Formamos el arreglo para el nuevo div
        let carrerasParaSelect = [];
        for(var i in arrayCarrerasPorLinea) { 
            carrerasParaSelect[i] =[{
                'carrera' : arrayCarrerasPorLinea[i].nombre,
                'Grupo_carreras' : arrayCarrerasPorLinea[i].Grupo_carreras,
                'IdDynamics' : arrayCarrerasPorLinea[i].IdDynamics
            }];
        }
        return carrerasParaSelect;

    }
    //Trae las modalidades disponibles para la carrera seleccionada
    getModalidades(evento)
    {
        jQuery("#secModalidades").html("");
        this.resetEstudioValidation();
        //console.log(evento);
        let keySearch = 'Grupo_carreras';
        let ev = evento.srcElement || evento.target; 
        let grupoCarrera = ev.attributes.value.nodeValue;
        jQuery("#formApp").data("categoria", grupoCarrera);
        let arrayModalidadesGrupo = [];
        let objJsonCarreras = JSON.parse(localStorage.getItem('jsonCarreras'));
        arrayModalidadesGrupo = this.readJsonService.buscar(keySearch, grupoCarrera, objJsonCarreras);
        //Formamos el arreglo para el nuevo div de modalidades
        let modalidadesParaSelect = [];
        let id;
        let value;
        for(var i in arrayModalidadesGrupo) {

            //Ajustar modalidades por id
            switch( parseInt(arrayModalidadesGrupo[i].modalidad) ) {
                case 1:
                    id   = arrayModalidadesGrupo[i].IdDynamics;
                    value = 'Presencial';
                    break;
                case 2:
                    id   = arrayModalidadesGrupo[i].IdDynamics;
                    value = 'Ejecutiva';
                    break;
                case 3:
                    id   = arrayModalidadesGrupo[i].IdDynamics;
                    value = 'En Línea';
                    break;
                case 4:
                    id   = arrayModalidadesGrupo[i].IdDynamics;
                    value = 'Flexible';
                    break;
                case 5:
                    id   = arrayModalidadesGrupo[i].IdDynamics;
                    value = 'Híbrida';
                    break;
                default:
                    id   = arrayModalidadesGrupo[i].IdDynamics;
                    value = 'Presencial';
            }

            let iddiv = "div_modalidad" + i;
            jQuery("#secModalidades").append('<div class="division-div" id="' + iddiv + '" #div_modalidad style="padding-bottom: 10px;cursor:pointer;" value="' 
                                + id 
                                + '" ' 
                                + '>' 
                                + value
                                + '</div>');
            //Seteamos el listener  
            let one = i;
            this.elRef.nativeElement.querySelector('#div_modalidad' + one).addEventListener('click', 
                                (event) => this.getCampus(event));
            //jQuery("#secModalidades").removeClass("ocultar");
        }
        //Ocultamos la linea de interés
        jQuery("#secCarreras").hide(320);
        jQuery(".titulo-interes").html(this.preguntaModalidad);
        this.textoCambio = this.textoCambiarCarrera;
        jQuery(".texto-cambio").unbind("click");
        jQuery(".texto-cambio").bind("click",(event) => this.cambiarCarrera(event));
        jQuery(".texto-cambio").html(this.textoCambiarCarrera);
        //Mostramos las carreras
        jQuery("#secModalidades").show(320);
        /** Si solo hay una modalidad pasamos automaticamente al siguiente nivel (Seleccionar campus)*/
        if(arrayModalidadesGrupo.length == 1) {
            jQuery("#div_modalidad0").click();
        }
    }
    //Resetea el div para cambiar la linea de negocio
    cambiarLineaNegocio(evento)
    {
        console.log("CAMBIAR NIVEL");
        //Ocultamos el ciclo
        jQuery("#ciclo").hide(320);
        jQuery(".titulo-interes").removeClass("col-6");
        jQuery(".titulo-interes").addClass("col-12");
        jQuery("#formApp").removeData("linea");
        jQuery("#formApp").removeData("categoria");
        jQuery("#formApp").removeData("modalidad");
        jQuery("#formApp").removeData("campus");
        //jQuery(".texto-cambio").addClass("LINEA");
        jQuery("#secCarreras").hide();
        jQuery("#secModalidades").hide();
        jQuery("#secEstudio").hide();
        jQuery(".texto-cambio").hide();
        jQuery(".titulo-interes").html(this.preguntaEstudioInteres);
        //Mejorar el metodo de reseteo (Fase 1)
        jQuery('#select_lineas').children('option').first().prop('selected', true);
        jQuery('#select_lineas').children('option').first().prop('selected', false);
        jQuery("#secLineas").show(320);
                //Setear revalidacion de estudios previos
        this.setRevalidaEstudios(0);
    } 
    //Resetea el div para cambiar carrera
    cambiarCarrera(evento)
    {
        console.log("CAMBIAR CARRERA");
        jQuery("#formApp").removeData("categoria");
        jQuery( ".texto-cambio").html(this.textoCambiarNivel);
        jQuery(".texto-cambio").unbind("click");
        jQuery(".texto-cambio").bind("click",(event) => this.cambiarLineaNegocio(event));
        jQuery(".texto-cambio").show();
        jQuery(".titulo-interes").html(this.preguntaCarrera);
        jQuery("div#secLineas").hide(320);
        jQuery("div#secModalidades").hide(320);
        jQuery("div#secCarreras").show(320);

    }
    //Resetea los div para cambiar modalidades
    cambiarModalidad(evento)
    {
        console.log("CAMBIAR MODALIDAD");
        jQuery("#formApp").removeData("modalidad");
        jQuery( ".texto-cambio").html(this.textoCambiarCarrera);
        jQuery(".texto-cambio").unbind("click");
        jQuery(".texto-cambio").bind("click",(event) => this.cambiarCarrera(event));
        jQuery(".texto-cambio").show();
        jQuery(".titulo-interes").html(this.preguntaModalidad);
        jQuery("div#secCampus").hide(320);
        jQuery("div#secCarreras").hide(320);
        jQuery("div#secLineas").hide(320);
        jQuery("div#secModalidades").show(320);
    }
    //Metodo para traer los campos
    getCampus(evento)
    {
        let ev = evento.srcElement || evento.target; 
        jQuery("#secCampus").html("");
        this.resetEstudioValidation();
        let keySearch = 'IdDynamics';
        let IdDynamics = ev.attributes.value.nodeValue;
        let arrayCampusIdDynamics = [];
        let objJsonCarreras = JSON.parse(localStorage.getItem('jsonCarreras'));
        arrayCampusIdDynamics = this.readJsonService.buscar(keySearch, IdDynamics, objJsonCarreras);
        let arrayNombresCortos = arrayCampusIdDynamics[0].campus[0].split(",");
        let campus;
        //Asignación de variables a formApp data
        jQuery("#formApp").data("carrera", arrayCampusIdDynamics[0].nombre);
        jQuery("#formApp").data("idCarrera", IdDynamics);
        jQuery("#formApp").data("subnivelinteres", arrayCampusIdDynamics[0].interes);
        jQuery("#formApp").data("nivelInteres", this.getNivelInteres(arrayCampusIdDynamics[0].linea));
        jQuery("#formApp").data("modalidad", arrayCampusIdDynamics[0].modalidad);
        //console.log(arrayCampusIdDynamics);
        for(var i in arrayNombresCortos) {

            campus = this.campusNombreLargo(arrayNombresCortos[i]);
            let iddiv = "div_campus" + i;
            jQuery("#secCampus").append('<div class="division-div" id="' + iddiv + '" #div_campus style="padding-bottom: 10px;cursor:pointer;" value="' 
                                + arrayNombresCortos[i] 
                                + '" ' 
                                + '>' 
                                + campus
                                + '</div>');
            //Seteamos el listener  
            let one = i;
            this.elRef.nativeElement.querySelector('#div_campus' + one).addEventListener('click', 
                                (event) => this.setResult(event));

        }
        //Ocultamos la linea de interés
        jQuery("#secModalidades").hide(320);
        jQuery(".titulo-interes").html(this.preguntaCampus);
        this.textoCambio = this.textoCambiarModalidad;
        jQuery(".texto-cambio").unbind("click");
        jQuery(".texto-cambio").bind("click",(event) => this.cambiarModalidad(event));
        jQuery(".texto-cambio").html(this.textoCambiarModalidad);
        //Mostramos las carreras
        jQuery("#secCampus").show(320);
       //Si solo existe una campus pasamos al siguiente nivel
        if(arrayNombresCortos.length == 1) {
            jQuery("#div_campus0").click();
        }


    }
    //calcula el nivelInteres dependiendo la linea
    getNivelInteres(linea)
    {
        let value;
        switch(linea){
          case 'PREPARATORIA': 
            value = "P";
            break;
          case 'LICENCIATURA': 
            value = "U";
            break;
          case 'INGENIERIA':
            value = "U";
            break;
          case 'SALUD':
            value = "U";
            break;
           case 'POSGRADO':
            value = "G";
            break;
          default:
            value = "U";
            break;
        }
        return value;
    }
    //Metodo para convertir la modalidad
    getNombreModalidad(modalidad)
    {
        let value;
        switch(modalidad){
          case '1': 
            value = "Presencial";
            break;
          case '2': 
            value = "Ejecutiva";
            break;
          case '3':
            value = "En linea";
            break;
          default:
            value = "Presencial";
            break;
        }
        return value;
    }

    setResult(evento)
    {
        this.resetEstudioValidation();
        //Fin de la seleccion de la linea de negocio
        let ev = evento.srcElement || evento.target; 
        let campus = ev.attributes.value.nodeValue;
        jQuery(".titulo-interes").html(this.resultadoPreguntas);
        jQuery("#secCampus").hide(320);
        jQuery("#formApp").data("campus", campus);
        jQuery("#formApp").data("campusLargo", this.campusNombreLargo(campus));
        this.carreraResultado = jQuery("#formApp").data("categoria");
        this.modalidadResultado = this.getNombreModalidad(jQuery("#formApp").data("modalidad"));
        this.campusResultado = jQuery("#formApp").data("campusLargo");
        jQuery(".texto-cambio").unbind("click");
        jQuery(".texto-cambio").bind("click",(event) => this.cambiarLineaNegocio(event));
        jQuery(".texto-cambio").html(this.textoCambiarSeleccion);
        jQuery("#secEstudio").show(320);
        //Cuando se eligieron todas las posibles variables mostramos el select de ciclo
        this.construyeInputciclos();
        jQuery("#ciclo").show(320);

    }
    setRevalidaEstudios(reset = 1)
    {
        if( reset == 0 ) {
            jQuery('.frm-revalidacion-label').html("Me interesa revalidar estudios previos"); 
        }else {
            var split = jQuery("#formApp").data("linea").toLowerCase().split(' ');
            //iterate through each of the "words" and capitalize them
            for (var i = 0, len = split.length; i < len; i++) {
                split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1);
            }
            var myLabel= split.join(' ');
            jQuery('.frm-revalidacion-label').html("Me interesa revalidar estudios de " + myLabel);
        }

    }

    //Despues de tener todas las variables construimos el input del ciclo (carrera,campus,et)
    construyeInputciclos()
    {


        //Configuración de ciclos
        var config_ciclos = [
            {
                'ciclo' : {'valor':'17-3','texto':'Me interesa el ciclo de agosto'},
                'subNivelInteres' : ['4'],
                'idCarreras' : ['258'],
                'excluirCarreras' : [''],
                'excluirsubNivel' : [''],
                'excluirCampus' : ['']
            },
            {
                'ciclo' : {'valor':'18-1','texto':'Me interesa el ciclo de septiembre'},
                'subNivelInteres' : ['2','3','4','5','6','7'],
                'idCarreras' : ['192','193','195','196','197','35','258'],
                'excluirCarreras' : [''],
                'excluirsubNivel' : [''],
                'excluirCampus' : ['']
            },
            {
                'ciclo' : {'valor':'18-2','texto':'Me interesa el ciclo de febrero'},
                'subNivelInteres' : ['2','3','5','6','7'],
                'idCarreras' : ['192','193','195','196','197','35'],
                'excluirCarreras' : ['258'],
                'excluirsubNivel' : [''],
                'excluirCampus' : ['']
            }
        ];

        var ciclos_input : any = []; 
        for (let objCiclo of config_ciclos) {
            //console.log(objCiclo.ciclo["valor"]);
            //Si la carrera seleccionada esta en el array de ciclos entonces es valido el ciclo
            //console.log(objCiclo.idCarreras.indexOf(jQuery("#formApp").data("idCarrera")));
            if( (objCiclo.idCarreras.indexOf( jQuery("#formApp").data("idCarrera") ) !== -1 ||
                objCiclo.subNivelInteres.indexOf( jQuery("#formApp").data("subnivelinteres") ) !== -1) &&
                objCiclo.excluirCarreras.indexOf( jQuery("#formApp").data("idCarrera") ) == -1 &&
                objCiclo.excluirsubNivel.indexOf( jQuery("#formApp").data("idCarrera") ) == -1 &&
                objCiclo.excluirCampus.indexOf( jQuery("#formApp").data("idCarrera") ) == -1
                
               ) {
                
                ciclos_input.push( { "id" : objCiclo.ciclo["valor"], "texto" : objCiclo.ciclo["texto"] } );
                
            }
        }
        console.log("Los ciclos para los que aplica");
        console.log(ciclos_input);
        jQuery('.mdb-select').material_select('destroy');
        jQuery('#frm_ciclo').html("<option value='' selected>" + this.preguntaCiclo + "</option>")
        jQuery.each(ciclos_input, function (i, item) {
            jQuery('#frm_ciclo').append( jQuery('<option>', { 
                value: item.id,
                text : item.texto 
            }));
            jQuery(".frm-select-ciclo").children("ul").append('<li class=""><span>' + item.texto + '</span></li>');
        });
        jQuery('.mdb-select').material_select();
        
    }//Termina metodo construye input ciclos

    resetEstudioValidation()
    {
        //Reseteamos la validacion en caso de error
        jQuery(".frm-estudio-interes").removeClass("muestra-error");
        jQuery(".frm-estudio-interes").addClass("oculta-error");  
    }
    //Campus nombre largo
    campusNombreLargo(campus)
    {
        let value;
        switch(campus){
          case 'ATZ': 
            value = "Atizapán";
            break;
          case 'CUI': 
            value = "Cuitláhuac";
            break;
          case 'ECA':
            value = "Ecatepec";
            break;
          case 'MAR':
            value = "Marina";
            break;
          case 'SUR':
            value = "Sur";
            break;
          case 'LEO':
            value = "León";
            break;
          case 'TOL':
            value = "Toluca";
            break;
          case 'ONL':
            value = "En Línea";
            break;
          case 'GDL':
            value = "Guadalajara";
            break;
          case 'QRO':
            value = "Querétaro";
            break;
        }
        return value;
    }
    //Asigna texto de pregunta dependiendo el interés
    asignaPreguntaInteres(interes)
    {
        switch(interes) {
            case "LICENCIATURA" :
                this.preguntaCarrera = "¿Qué licenciatura?";
                break;
            case "INGENIERIA" :
                this.preguntaCarrera = "¿Qué ingeniería?";
                break;
            case "POSGRADO" :
                this.preguntaCarrera = "¿Qué posgrado?";
                break;
            default :
                this.preguntaCarrera = "¿Qué licenciatura?";
                break;
        }
        return this.preguntaCarrera;
    }

}//Fin de la clase
