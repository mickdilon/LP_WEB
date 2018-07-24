/**
 * 10-05-2017: JEAB Servicio de validaciones de los formularios.
 * 
 */
/**Reglas de validaciones de dominios de correos */
/**
*   El formato de de email de hotmail valida lo siguiente en el nombre de usuario:
*   PERMITIDO:
*    - Caracteres permitidos de la A a la Z mayusculas o minusculas
*    - Numeros del 0 al 9 permitidos al final o dentro del nombre de usuario,
*    - Guion medio y guion bajo, dentro del usuario la cantidad que sea y consecutivos
*    - Puntos no consecutivos dentro del usuario.
*   NO PERMITIDO:
*    - Números del 0 al 9 al inicio
*    - Punto, guion medio y guion bajo al inicio
*    - Punto al final
*    - Caracteres espciales, incluyendo ñ y acentos
*/
/**
*   El formato de de email de gmail valida lo siguiente en ll nombre de usuario:
*   PERMITIDO:
*   - Caracteres permitidos de la A a la Z mayusculas o minusculas
*   - Numeros del 0 al 9 permitidos al final o dentro del nombre de usuario,
*   - Punto dentro del nombre de usuario.
*   NO PERMITIDO:
*   - Más de un punto consecutivo.
*   - Punto al inicio o al final.
*   - Numeros del 0 al 9 al inicio.
*   - Caracteres especiales incluyendo guion medio, guion bajo y eñe, acentos, etc., ni al inicio, intermedios o final.
*/
/**
El formato de email de yahoo valida lo siguiente en ll nombre de usuario:
*   - El usuario solo empieza con letras,
*   - acaba con letra o numero solamente,
*   - no acepta guion medio,
*   - no acepta guion bajo consecutivo entre letras solo 1 guion bajo, precedido o seguido por letrar o numeros, 
*   - no mas de un punto consecutivo,
*   - no puede llevar combinaciones consecutivas de "_" y ".",
*   - ningun caracter especial, incluidas  ñ y acentos.        
*/
//Si no es hotmail, outlook, live, gmail ni yahoo, aplicamos las validaciones que ya teniamos:
//caracteres permitidos de la A a la Z mayusculas o minusculas,
//numeros del 0 al 9 al final o dentro del nombre de usuario, no al inicio
//punto, guion medio y guion bajo, ni al inicio ni al final, solo dentro del usuario y sin más de 1 consecutivo
import { Injectable , Inject} from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AbstractControl } from '@angular/forms';
import { readJson } from '../../services/readJson.service';
import { getJson } from '../../services/getJson.service';
declare var $:any;
declare var jQuery:any;

@Injectable()
export class userValidations
{
   
    constructor(private getJson : getJson, @Inject(DOCUMENT) private document)
    {
        //LLamada a los Json
        getJson.getJsonBasura();
        getJson.getJsonBasuraEmail();
    }

    //Validacion de nombres / apellidos
    validaNombres( abstractControl : AbstractControl)
    {

        let jsonReader = new readJson();
        let jsonBasura = jQuery("#data_json_basura").data();
        let patron = /^[a-zA-Záíúéóñ\s]*$/;
        let arrBasuraComplete = [];
       //Esta vacio el nombre
        if(abstractControl.value === ""){ 
            return { 
                fieldError : true,
                customErrorMessage: 'No puede estar vacío el campo' 
            }
        //Validamos en el json basura la parte uno del correo
        }else if(abstractControl.value.length <= 2 || abstractControl.value.length > 30){ 
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese más de dos letras y menos de 30' 
            }
        //Validamos que no existen caracteres especiales en el nombre de usuario
        }else if(abstractControl.value.search(patron) == -1) {
            return { 
                fieldError : true,
                customErrorMessage: 'Solo se aceptan letras' 
            }
        //Validamos nombres basura
        }else if(Object.keys(jsonBasura).length != 0) {
            
            for(var i = 0; i < Object.keys(jsonBasura).length ;i++){
                var arrRes = jsonBasura[i];
                arrBasuraComplete.push(arrRes);
                 
            }
            for(i = 0; i < Object.keys(jsonBasura).length ; i++){
                //console.log(arrBasuraComplete[i]);
                if(abstractControl.value.search(arrBasuraComplete[i]) !== -1){
                    return { 
                        fieldError : true,
                        customErrorMessage: 'Nombre inválido' 
                    }
                }
            }

        }
        return null;  
    }
    //Nombres basura con observable
    nombresBasuraObs( abstractControl : AbstractControl)
    {
        
        if(document.readyState == "complete") 
        {
            var input_data_json_basura = (<HTMLInputElement>document.getElementById("data_json_basura"));
            if(input_data_json_basura.value) {
                if(typeof document.getElementById("data_json_basura").dataset.json != 'undefined'){
                    let jsonReader = new readJson();
                    let jsonBasura = input_data_json_basura.dataset.json;
                    if(jsonReader.getKeys(JSON.parse(jsonBasura), abstractControl.value).length > 0 ){
                        return { noBasura : true }
                    }else {
                        return null;
                    }
                }
            }
        }
        return null;
    }

    //Contiene todas las validaciones del formulario unitec 2016 adecuadas a Angular
    validaEmail(abstractControl : AbstractControl)
    {

        if ( jQuery("#frm_celular").val() != '' && jQuery("#frm_celular").length == 10 ){
            jQuery("#ok_mail").val("true");
            return null;
        }
        //Flag que cambiara cuando sea valido
        let emailValid = false;
        let customErrorMessage;
        let arrEmail = abstractControl.value.split('@');
        let lenUser = arrEmail[0].length;
        let jsonReader = new readJson();
        let jsonBasura = jQuery("#data_json_basura_email").data();
        try {
            var arrDominio = arrEmail[1].split('.');
            var arrLargo = arrDominio.length;
        }catch(err) {}

        //Esta vacio el correo
        if(arrEmail[0] === ""){ 
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese su correo' 
            }
        //Validamos en el json basura la parte uno del correo
        }else if(jQuery("#data_json_basura_email").val() == 1 && jsonReader.getKeys(jsonBasura, arrEmail[0]).length > 0 ) {
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Correo inválido' 
            }
         //Validar arroba
        }else if(arrEmail.length <= 1){
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese el correo completo' 
            }
        //Validamos en el json basura la parte 2 del correo
        }else if(jQuery("#data_json_basura_email").val() == 1 && jsonReader.getKeys(jsonBasura, arrEmail[1]).length > 0) {
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Correo inválido' 
            }
        //Longitud del nombre de usuario es muy largo o muy corto el nombre
        }else if(lenUser <= 2 || lenUser > 20){ 
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Longitud de correo invalida' 
            }
        //Validamos que no existen caracteres especiales en el nombre de usuario
        }else if(arrEmail[0].search(/[^a-zA-Z0-9_.-]/)!=-1){ 
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Caracter inválido encontrado' 
            }
        //Validamos que no existen caracteres especiales en el dominio 
        }else if(arrEmail[1].search(/[^a-zA-Z0-9_.-]/)!=-1){ 
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Caracter inválido encontrado' 
            }
         //Validacion de dominios MS   
        }else if(arrEmail[1].search(/(hotmail|outlook|live)/i)!= -1 && (arrEmail[0][lenUser-1].search(/\./)!=-1 || arrEmail[0][0].search(/(-|_|\.|[0-9])/)!=-1 || arrEmail[0].search(/\.{2}/g) != -1) ){
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Correo inválido' 
            }
        //Validacion de dominios gmail    
        }else if(arrEmail[1].search(/gmail/i)!= -1 && (arrEmail[0][lenUser-1].search(/[^a-zA-Z0-9]/)!=-1 || arrEmail[0][0].search(/(-|_|\.|[0-9])/)!=-1 || arrEmail[0].search(/\.{2}/g) != -1 || arrEmail[0].search(/(-|_)/g) != -1)){
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Correo inválido' 
            } 
         //Validacion de dominios yahoo     
        }else if(arrEmail[1].search(/yahoo/i)!= -1 && (arrEmail[0][lenUser-1].search(/[^a-zA-Z0-9]/)!=-1 || arrEmail[0][0].search(/(_|\.|[0-9])/)!=-1 || arrEmail[0].search(/(\.|_){2}/g) != -1 || arrEmail[0].search(/-/g)!=-1 ) ){
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Correo inválido' 
            } 
        //Validacion de dominios restantes       
        }else if(arrEmail[1].search(/(^hotmail|outlook|gmail|live|yahoo)/i) == -1 && ( arrEmail[0][lenUser-1].search(/(-|_|\.)/)!=-1 || arrEmail[0][0].search(/(-|_|\.|[0-9])/)!=-1 || arrEmail[0].search(/(-|_|\.){2}/g) != -1)){
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Correo inválido' 
            }
         //Validacion de dominios por ejemplo debe tener @mail.com por ejemplo 
        }else if (arrLargo < 2){
            jQuery("#ok_mail").val("false");
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese el correo completo' 
            }
        } else {
            var arrDominio = arrEmail[1].split('.');
            var arrLargo = arrDominio.length;

            // Hay emails que tienen dominio  y subdominio, por ejemplo fcastill@mail.unitec.mx,
            // entonces verificamos desde el primer elemento al penultimo, ya que el ultimo el es
            // el nombre de dominio superior y requerimos otras validaciones
            for (var x = 0; x <= arrLargo-2; x++) {
                //esta vacio el nombre del dominio o subdominio?
                if (arrDominio[x]===""){
                    jQuery("#ok_mail").val("false");
                    return { 
                        errorEmail : true,
                        customErrorMessage: 'Correo inválido' 
                    }
                //es muy largo o muy corto el nombre del dominio?
                }else if(arrDominio[x].length > 36 || arrDominio[x].length < 2){
                    jQuery("#ok_mail").val("false");
                    return { 
                        errorEmail : true,
                        customErrorMessage: 'Correo inválido' 
                    }
                } 
                //Validación de correo basura en el dominio
                if(Object.keys(jsonBasura).length != 0) {
                    for(var i = 0; i < Object.keys(jsonBasura).length; i++){
                        if(arrDominio[x].indexOf(jsonBasura[i]) != -1){
                            jQuery("#ok_mail").val("false");
                            return { 
                                fieldError : true,
                                customErrorMessage: 'Correo inválido' 
                            }
                        }
                    } 
                }

            }
            // Validamos el nombre del dominio superior
            // esta vacio
            if(arrDominio[arrLargo-1]===""){
                jQuery("#ok_mail").val("false");
                return { 
                    fieldError : true,
                    customErrorMessage: 'Correo inválido' 
                }
            }else if(arrDominio[arrLargo-1].length >= 4 || arrDominio[arrLargo-1].length <= 1){
                jQuery("#ok_mail").val("false");
                return { 
                    fieldError : true,
                    customErrorMessage: 'Correo inválido' 
                }
            }
        }//Else de validaciones principales
        jQuery("#ok_mail").val("true");
        return null;
    }//Termina validacionesEmail
    //Validación para el campo estado
    validaEstado(abstractControl : AbstractControl)
    {
        if(abstractControl.value == '' || abstractControl.value == null) {
            return { 
                fieldError : true,
                customErrorMessage: 'Seleccione un estado' 
            }
        }
        return null;
    }
    //Validación para el campo ciclo
    validaCicloByPass(abstractControl : AbstractControl)
    {
        return null;
    }
    //Valida estado bypass por integracion con mdbootstrap
    validaEstadoByPass(abstractControl : AbstractControl)
    {   
        return null;
        
    }
    validaCampoByPass(abstractControl : AbstractControl)
    {
        console.log("Valida campo");
        return null;
    }
    //Valida un campo vacio
    validaCampoVacio(abstractControl : AbstractControl)
    {
        if(abstractControl.value == '' || abstractControl.value == null) {
            return { 
                fieldError : true,
                customErrorMessage: 'Este campo no puede estar vacío' 
            }
        }
        return null;
    }
    //Validaciones de celular
    validaCelular(abstractControl : AbstractControl)
    {
        if ( jQuery("#frm_celular").val() == "" && jQuery("#ok_mail").val() == "true" ){
            return null;
        }
        //Telefonos basura
        var arrTelefonosBasura=[
            "1010101001",
            "0000000000",
            "1234567890",
            "5556543727",	
            "5556581111",	
            "5552074077",	
            "5552074083",	
            "5556842142",	
            "5556849112",	
            "5556258646",	
            "5553951111",	
            "5555575759",	
            "5552009000",	
            "5551308000",	
            "5551308646",	
            "5555540612",	
            "5556543210",	
            "5553532763",	
            "5553532823",	
            "5556832222",	
            "5552295600",	
            "5556842124",	
            "5552410245",	
            "5552305100",	
            "5557703548",	
            "5557871540",	
            "5555606988",	
            "5555650521",	
            "5555651039",	
            "5553731122",	
            "5555653638"	
        ];
        var telefono_basura = arrTelefonosBasura.indexOf(abstractControl.value);
        if(abstractControl.value == ""){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número de celular' 
            }
        
        }else if(abstractControl.value.length < 10){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese los 10 digitos de su celular' 
            } 
        }else if(telefono_basura !== -1) {
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número de celular valido' 
            }
        }else if(abstractControl.value.search(/[^0-9]/g) != -1){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número de celular valido' 
            }
        }else if( abstractControl.value.search(/(\d)\1\1\1\1/g) != -1){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número de celular valido' 
            }
        }else if(abstractControl.value.charAt(0) == 0){

            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número de celular valido' 
            }

        }else if(
                jQuery("#frm_estado").val() =='CIUDAD DE MEXICO' && 
                abstractControl.value.charAt(0)!="5" && 
                abstractControl.value.charAt(1)!="5") {

            return { 
                fieldError : true,
                customErrorMessage: 'El número ingresado no corresponde a la CIUDAD DE MÉXICO' 
            }

        }
        return null;

    }//Termina valida celular
    //Comienza valida tel casa

    validaTelCasa(abstractControl : AbstractControl)
    {

        //abstractControl.markAsTouched();
        if ( jQuery("#ok_mail").val() == "true" ){
            //alert("true");
            return null;
        }
        //Telefonos basura
        var arrTelefonosBasura=[
            "1010101001",
            "0000000000",
            "1234567890",
            "5556543727",	
            "5556581111",	
            "5552074077",	
            "5552074083",	
            "5556842142",	
            "5556849112",	
            "5556258646",	
            "5553951111",	
            "5555575759",	
            "5552009000",	
            "5551308000",	
            "5551308646",	
            "5555540612",	
            "5556543210",	
            "5553532763",	
            "5553532823",	
            "5556832222",	
            "5552295600",	
            "5556842124",	
            "5552410245",	
            "5552305100",	
            "5557703548",	
            "5557871540",	
            "5555606988",	
            "5555650521",	
            "5555651039",	
            "5553731122",	
            "5555653638"	
        ];
        var telefono_basura = arrTelefonosBasura.indexOf(abstractControl.value);
        if(abstractControl.value == ""){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número de telefono fijo' 
            }
        
        }else if(abstractControl.value.length < 10){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese su telefono fijo con lada (10 digitos)' 
            } 
        }else if(telefono_basura !== -1) {
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número fijo valido' 
            }
        }else if(abstractControl.value.search(/[^0-9]/g) != -1){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número fijo valido' 
            }
        }else if( abstractControl.value.search(/(\d)\1\1\1\1/g) != -1){
            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número fijo valido' 
            }
        }else if(abstractControl.value.charAt(0) == 0){

            return { 
                fieldError : true,
                customErrorMessage: 'Ingrese un número fijo valido' 
            }

        }else if(
                jQuery("#frm_estado").val() =='CIUDAD DE MEXICO' && 
                abstractControl.value.charAt(0)!="5" && 
                abstractControl.value.charAt(1)!="5") {

            return { 
                fieldError : true,
                customErrorMessage: 'El número ingresado no corresponde a la CIUDAD DE MÉXICO' 
            }

        }
        return null;

    }

    //termina valida tel casa
    validaNumeroDeCuenta( abstractControl : AbstractControl ){
        if( !/^([0-9])*$/.test(abstractControl.value) ){
            return {
                fieldError : true,
                customErrorMessage: 'Debes escribir un número de cuenta en este campo'    
            }
        }
        if( abstractControl.value == "" || abstractControl.value == null ){
            return {
                fieldError : true,
                customErrorMessage: 'Este campo no puede estar vacio...'    
            }
        }
    }
    
    //Valida contraseñas
    validaContrasena( abstractControl : AbstractControl ){
        if( abstractControl.value.length > 10 ){
            return {
                fieldError : true,
                customErrorMessage: 'Ingrese una contraseña menor a 10 digitos'    
            }
        }
        if( abstractControl.value.length < 6 ){
            return {
                fieldError : true,
                customErrorMessage: 'Ingrese una contraseña de al menos 6 digitos'    
            }
        }
        if( abstractControl.value == "" || abstractControl.value == null ){
            return {
                fieldError : true,
                customErrorMessage: 'Ingrese la contraseña'    
            }
        }
    }
    validaConfirmaContrasena( abstractControl : AbstractControl ){
        //console.log(document.getElementById("frm_contra1"));
        if( abstractControl.value != jQuery("#frm_contra1").val()){
            return {
                fieldError : true,
                customErrorMessage: 'Las contraseñas no coinciden'    
            }
        }
        if( abstractControl.value == "" || abstractControl.value == null ){
            return {
                fieldError : true,
                customErrorMessage: 'Confirme la contraseña'    
            }
        }
    }





    validaRadioPerfilBV( abstractControl : AbstractControl ){
        if( ! abstractControl.value){
            return {
                fieldError : true,
                customErrorMessage: 'Debes seleccionar tu perfil'    
            }
        }
    }

    validaAviso( abstractControl : AbstractControl ){
        if( ! abstractControl.value ){
            return{
                fieldError : true,
                customErrorMessage: 'Acepta las politicas de privacidad.'
            }
        }
    }

    removeAcentos(str) { 
        for (var i=0;i<str.length;i++){ 
        //Sustituye "á é í ó ú" 
        if (str.charAt(i)=="á") str = str.replace(/á/,"A"); 
        if (str.charAt(i)=="é") str = str.replace(/é/,"E"); 
        if (str.charAt(i)=="í") str = str.replace(/í/,"I"); 
        if (str.charAt(i)=="ó") str = str.replace(/ó/,"O"); 
        if (str.charAt(i)=="ú") str = str.replace(/ú/,"U"); 
        } 
        return str; 
    } 
}