import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

declare var $:any;
declare var jQuery:any;
declare function unescape(s:string): string;

@Injectable()
export class formCookiesService
{
    cookies: any;
    constructor(private cookieService: CookieService ) {
        this.cookies = cookieService;
    }
    //1 hora
    duracion_form_cookie = Date.now() + 3600 * 1000;
    path_form_cookie = '/';

    //Recibe el nombre de la cookie, clave y valor y añade el valor de la cookie y si ya existe lo reemplaza
    appendCookieValue(nombre_cookie, clave, valor)
    {
        //console.log("Entro al metodo cookie");
        var objCookie;
        //this.cookies.setObject(nombre_cookie, {bar: 'asasr'}); 
        //Obtener la cookie para ver si es null o no tiene valores
        //console.log(this.cookies.getObject(nombre_cookie));
        objCookie = this.cookies.get(nombre_cookie);
        if(objCookie == "" || objCookie == "null" || typeof objCookie == "undefined" || objCookie == null ) {
            //Si no existe la cookie se crea con el valor correspondiente y la configuracion global
            var jsontext = '{"' + clave + '":"' + valor + '"}';
            //var contact = JSON.parse(jsontext);
            var contact = jsontext;
            this.cookies.set(nombre_cookie, contact, this.duracion_form_cookie, this.path_form_cookie);
            //console.log("después de setear");
            //console.log(JSON.parse(this.cookies.get(nombre_cookie)));
            //console.log(this.cookies.getObject(nombre_cookie));
        }else {
            //console.log("Entro a la validacion por que ya existe");
            //Si ya existe la cookie o tiene valores se debe agregar un valor mas
            var cookie_value = this.cookies.get(nombre_cookie);
            //console.log("Obtener la cookie cuando ya exite");
            //console.log(cookie_value);

            var cadena_cookie = "";
            var arrLength = Object.keys(JSON.parse(cookie_value)).length;
            //console.log("Tamaño de la cookie: " + arrLength);
            var valida_reemplazo = false;
            var tmpLen = 0;
            jQuery.each(JSON.parse(cookie_value), function(index, value) {
                tmpLen ++;
                //Armar la cadena para la nueva cookie
                //Se valida si la clave de la cookie ya existe para substituir el valor
                if(index != "" || index != "null" || typeof index != "undefined" || index != null ) {
                    //Validamos si la clave del valor de la cookie es igual al valor pasado como
                    //parametro al metodo y lo reemplazamos
                    if( tmpLen != arrLength ) {
                        //Si es el mismo valor para la cookie se reemplaza
                        if(index == clave) {
                            value = valor;
                            valida_reemplazo = true;
                        }
                        cadena_cookie += '"' + index + '":"' + value + '",';
                    }else {
                        //Si es el mismo valor para la cookie se reemplaza
                        if(index == clave) {
                            value = valor;
                            valida_reemplazo = true;
                        }
                        //Si es el ultimo elemento y ademas no fue reemplazado el valor
                        //concatenamos el nuevo valor
                        if(valida_reemplazo == true) {
                            cadena_cookie += '"' + index + '":"' + value + '"';
                        }else {
                            cadena_cookie += '"' + index + '":"' + value + '",';
                            cadena_cookie += '"' + clave + '":"' + valor + '"';
                        }
                        
                    }
                    
                }
            });
            var contactb = "{"+cadena_cookie+"}";
            cadena_cookie = "";
            this.cookies.set(nombre_cookie, contactb, this.duracion_form_cookie, this.path_form_cookie);

        }
        //console.log("la cookie al final del metodo");
        //console.log(JSON.parse(contactb));
    }

    //Obtiene el valor de la cookie
    getCookieValues(nombre_cookie)
    {
        return JSON.parse(this.cookies.get(nombre_cookie));
    }

    //Se realiza una modificacion debido a que el metodo delete no elimina la cookies al finalizar 
    //la sesión, la manera para eliminarlas es manualmente mediamte javascript asignado una fecha pasada
    // **Update Done By SRP day: 12-12-2017 **

    //Eliminar la cookie
    removeCookie(nombre_cookie)
    {
        // console.log("La cookie es:"+ nombre_cookie);
        // let cookieActiva = this.cookies.delete(nombre_cookie);
        // console.log("La cookie despues del metodo delete: " + cookieActiva);
        let cookieActivaAlt = document.cookie = nombre_cookie + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        console.log("La cookie ahora con javascript: " + cookieActivaAlt);
    }
    //Obtener el valor de una cookie por clave
    getCookieByKey(nombre_cookie, key)
    {
        var objCookie;
        var response = false;
        objCookie = this.cookies.get(nombre_cookie);
        if(objCookie == "" || objCookie == "null" || typeof objCookie == "undefined" || objCookie == null ) {
            //No existe la cookie retornamos false
            response = false;
        }else {
            //Si existe la cookie validamos si existe la clave y retornamos el valor
            var cookie_value = this.cookies.get(nombre_cookie);
            var cadena_cookie = "";
            var arrLength = Object.keys(JSON.parse(cookie_value)).length;
            var valida_reemplazo = false;
            var tmpLen = 0;
            jQuery.each(JSON.parse(cookie_value), function(index, value) {
                tmpLen ++;
                if(index != "" || index != "null" || typeof index != "undefined" || index != null ) {
                    //Si es el mismo valor para la cookie se reemplaza
                    if(index == key) {
                        response = value;
                        return;
                    }
                }
            });

        }//Termina else de la validacion de cookie
        return response;
    }//Termina el metodo getcookieByKey


    //Obtener cookie simple
   getCookie(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    }


    //Validar si una cookie existe
    checkCookie(nombre_cookie) 
    {
        var objCookie;
        objCookie = this.cookies.get(nombre_cookie);
        if(objCookie == "" || objCookie == "null" || typeof objCookie == "undefined" || objCookie == null ) {
        
            return false;

        }else {
            return true;
        }
    }

    //Obtener el valor de una cookie dentro de una URL
    getUrlParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

}//Termina el servicio