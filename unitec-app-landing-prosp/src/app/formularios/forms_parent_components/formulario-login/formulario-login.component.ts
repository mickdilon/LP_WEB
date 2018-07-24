import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { userValidations } from '../../forms_services/validaciones.service';
import { Animaciones} from '../../../utilities/animaciones';
import { getJson } from '../../../services/getJson.service';
import { sendService } from '../../forms_services/send.service';
import { OnInit } from "@angular/core";

//Servicio de cookie
import { formCookiesService } from "../../forms_services/formCookies.service";
import {ViewEncapsulation} from '@angular/core';

declare var jQuery : any;
declare var $ :any;

@Component({
  selector: 'app-formulario-login',
  templateUrl: './formulario-login.component.html',
  styleUrls: ['./formulario-login.component.scss'],
  providers : [ userValidations, 
                sendService,
                formCookiesService
              ],
  encapsulation: ViewEncapsulation.Emulated
})
export class FormularioLoginComponent implements OnInit{
    //Variables de inicializacion
    titulo : string = 'Ingresa a Biblioteca';
    dominio_Correo : string = "@my.unitec.edu.mx";
    email : string;
    alumno : string = "Soy Alumno"
    profesor : string = "Soy Profesor"
    opc : string;

    //Id de los botones del formulario
    btn_ingresar : string = "btnIngresar";
    btn_cerrar : string = "btnCerrarSession";
    btn_login : string = "btnLogin";
    btn_alumno : string = "alumno";
    btn_profesor : string = "profesor";

    c_nombre :string = "";
    c_perfil :string = "";
    c_matricula :string = "";

    formularioLogin : FormGroup;
    formularioPadre : FormGroup;
    //Errores del flujo de la aplicacion
    error_usuario = "Por favor ingrese su correo electronico";
    error_password = "Por favor ingrese su contraseña"
    //Variable para almacenar el arreglo para la pre carga del formulario
    preload : any;

    primerPaso : string = 'faseUno';
    checkError : any;

    //Variable para emular GET
    // $_GET: any;

    constructor(private formBuilder : FormBuilder,
        private userValidations : userValidations,
        private sendService : sendService,
        private getJsonService: getJson,
        private animaciones : Animaciones,
        private formCookiesService: formCookiesService
    ) {
            let that = this;
            //Invocamos el metodo getJsonCarreras para obtener las carreras y ponerlas en localstorage
            this.getJsonService.getJsonCarreras();

            //Inicializacion del formulario
            this.formularioLogin = formBuilder.group({
                faseUno : formBuilder.group({
                    //Inicializacion de campos con datos reales para realizar pruebas
                    frm_radio_perfil_AlumnoMaestro : ['', Validators.compose([
                                        userValidations.validaRadioPerfilBV
                                ])
                    ],
                    frm_mail_login     : [ '', Validators.compose([
                                        userValidations.validaCampoVacio
                                ])
                    ],
                    frm_ncuenta : [ '', Validators.compose([ 
                                        userValidations.validaNumeroDeCuenta
                                ])
                    ],
                    frm_aviso_de_privacidad : [ '', userValidations.validaAviso ]
                })
            });

            // ximena.badillo
            // 15214288


            //Al cargar el DOM
            jQuery(document).ready(function() {
                //Comprobación de Cookies Activas
                console.log( "Estas son las cookies activas: " + document.cookie );
                //Asignamos la img destacada que almacena el input hidden h_horizontal_url_imagen_destacada
                $("#img-form-biblioteca").attr('src', $("#h_horizontal_url_imagen_destacada").val() );

                if( $("#h_horizontal_url_imagen_destacada").val() == "" || $("#h_horizontal_url_imagen_destacada").val() == null){
                    $("#img-form-biblioteca").attr('src', $("#h_url_imagen_destacada").val() );
                }              
                
                if (formCookiesService.checkCookie("c_matricula") == true) {
                    console.log("La cookie existe Contenido Unlocked");
                    jQuery("#" + that.btn_cerrar).removeClass("d-none");
                    jQuery(".content-busqueda-integrada").removeClass("d-none");
                    
                    //Obtenemos las variables de LocalStorage para inyectar URLs
                    $("#biblioteca_ebrary").attr( 'href', localStorage.getItem("biblioteca_ebrary") );
                    $("#biblioteca_libri").attr( 'href', localStorage.getItem("biblioteca_libri") );
                    $("#biblioteca_pearson").attr( 'href', localStorage.getItem("biblioteca_pearson") );

                    //$(".content-busqueda-integrada").html( localStorage.getItem("biblioteca-buscador") );

                } else{
                    jQuery("#" + that.btn_login).removeClass("d-none");
                    console.log("La cookie no existe Contenido Locked");
                    
                    jQuery(".url-library").click(function(){
                        jQuery("#modal_frm_biblioteca").modal();
                    });

                    jQuery("#btn-close").click(function(){
                        $("#modal_frm_biblioteca").modal('hide');
                    });
                }

            });
        }

    ngOnInit(){}
    
    enviar(){
        //Si el formulario es invalido entra aqui.
        if( this.formularioLogin.controls.faseUno.valid == false ){
            let myControl = this.formularioLogin.controls.faseUno["controls"];
            for( let control in myControl ){
                myControl[control].markAsDirty();
            }
            console.log("Este formulario es invalido...")
            return false;
        }

        //Si el formulario es valido entra aqui.
        else{
            let that = this;

                that.email = this.formularioLogin.get("faseUno.frm_mail_login").value
                jQuery.ajax({
                    url : "//" + document.domain + "/wp-content/themes/temaunitec/assets/html/ServidorPHP/main.php",
                    method : "POST",
                    data: {
                        route :   "BibliotecaVirtual", //Define el origen html para redirecionar a clase php
                        seccion : "login",             //Define el origen de la seccion para llamar el metodo de la clase
                        origen:   "pearson",           //yes, no, pearson, ceng, mcg
                        correo : that.email + that.dominio_Correo,
                        perfil:   this.formularioLogin.get("faseUno.frm_radio_perfil_AlumnoMaestro").value,
                        cuenta:   this.formularioLogin.get("faseUno.frm_ncuenta").value,
                        usuario : that.email
                    },
                    dataType: "json",
                    beforeSend : function(){
                        jQuery('#preload-library').html("<img src='//" + document.domain + "/assets/loading.svg' class='img-fluid m-auto' style='width:100%; max-width:45px;'><br /><div style='font-size:.8rem;'>Cargando.. Por favor espere</div>");                      
                    },
                    success: function( data ){
                        console.log( data["respuesta"] );
                        if( data["respuesta"] == 1 ) {
                            console.log(document.cookie);
                            console.log( data );
                            
                            localStorage.setItem( "biblioteca_libri",   data["biblioteca_libri"] );
                            localStorage.setItem( "biblioteca_pearson", data["biblioteca_pearson"] );
                            localStorage.setItem( "biblioteca_cengage", data["biblioteca_cengage"] );
                            localStorage.setItem( "biblioteca_ebrary",  data["biblioteca_ebrary"] );

                            //localStorage.setItem( "biblioteca-buscador",  "'" + data["biblioteca_buscador"] + "'" );
    
                            //Obtenemos los valores del formulario del usuario para dar de alta las cookies
                            //Se dan de alta las Cookies del sitio
                            console.log( "c_nombre: " + data["nombre"] + " c_perfil: " + data["perfil"] + " c_matricula: " + data["cuenta"] );
    
                            that.c_nombre = data["nombre"];
                            that.c_perfil = data["perfil"];
                            that.c_matricula = data["cuenta"];
    
    
                            that.formCookiesService.appendCookieValue('c_nombre', that.c_nombre, '');
                            that.formCookiesService.appendCookieValue('c_perfil', that.c_perfil, '');
                            that.formCookiesService.appendCookieValue('c_matricula', that.c_matricula, '');
                            
                            //Redireccion para Carga de Contenido Bloqueado
                            location.reload();
                        } else{
                            console.log("Usuario no Valido");
                        }
                    },
                    error: function( err ){
                        console.log( err );
                    }
                });
        }
    }

    cerrarSession(){
        //Se dan de baja las cookies del usuario de la biblioteca virtual
        this.formCookiesService.removeCookie('c_matricula');
        this.formCookiesService.removeCookie('c_nombre');
        this.formCookiesService.removeCookie('c_perfil');

        //Se eliminan variables de Local Storage
        localStorage.removeItem("biblioteca_libri");
        localStorage.removeItem("biblioteca_pearson");
        localStorage.removeItem("biblioteca_cengage");
        localStorage.removeItem("biblioteca_ebrary");

        //Se remueven la url asignadas
        jQuery("a#libri").removeAttr("href");
        jQuery("a#ceng").removeAttr("href");
        jQuery("a#mcg").removeAttr("href");
        jQuery("a#pearson").removeAttr("href");

        this.titulo = "Ingresar.";

        //Redireccion a la página de Home
        location.reload();
    }
    
}