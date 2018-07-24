import { Injectable } from '@angular/core';

declare let jQuery: any;

@Injectable()

export class GenericService {

    constructor() {}
    //Validar si una imagen existe
    checkImage( url )
    {
    }

    //Funcion que emula get de php
    getMethod(param = "") {
        console.log("param passed" + param);
        if ( param != "" ) {
            console.log("SI trae parametro " + param);
            return vars[param.toLowerCase()] ? vars[param.toLowerCase()] : null;    
        }
                var vars = {};
                window.location.href.replace( location.hash, '' ).replace(/[?&]+([^=&]+)=?([^&]*)?/gi,function ( m, key, value ):any { 
                        vars[key.toLowerCase()] = value !== undefined ? value : '';
                }
                );
                return vars;
    }

    //Ordena alfabeticamente
    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    //Listado de estados
    getEstados()
    {
     let estados =
      [
        {"name":"Aguascalientes","crm_name":"AGUASCALIENTES"},
        {"name":"Baja California","crm_name":"BAJA CALIFORNIA NOR"},
        {"name":"Baja California Sur","crm_name":"BAJA CALIFORNIA SUR"},
        {"name":"Campeche","crm_name":"CAMPECHE"},
        {"name":"Chiapas","crm_name":"CHIAPAS"},
        {"name":"Chihuahua","crm_name":"CHIHUAHUA"},
        {"name":"Ciudad de México","crm_name":"CIUDAD DE MEXICO"},
        {"name":"Coahuila","crm_name":"COAHUILA"},
        {"name":"Colima","crm_name":"COLIMA"},
        {"name":"Durango","crm_name":"DURANGO"},
        {"name":"Estado de México","crm_name":"ESTADO DE MEXICO"},
        {"name":"Guanajuato","crm_name":"GUANAJUATO"},
        {"name":"Guerrero","crm_name":"GUERRERO"},
        {"name":"Hidalgo","crm_name":"HIDALGO"},
        {"name":"Jalisco","crm_name":"JALISCO"},
        {"name":"Michoacán","crm_name":"MICHOACAN"},
        {"name":"Morelos","crm_name":"MORELOS"},
        {"name":"Nayarit","crm_name":"NAYARIT"},
        {"name":"Nuevo León","crm_name":"NUEVO LEON"},
        {"name":"Oaxaca","crm_name":"OAXACA"},
        {"name":"Puebla","crm_name":"PUEBLA"},
        {"name":"Querétaro","crm_name":"QUERETARO"},
        {"name":"Quintana Roo","crm_name":"QUINTANA ROO"},
        {"name":"San Luis Potosí","crm_name":"SAN LUIS POTOSI"},
        {"name":"Sinaloa","crm_name":"SINALOA"},
        {"name":"Sonora","crm_name":"SONORA"},
        {"name":"Tabasco","crm_name":"TABASCO"},
        {"name":"Tamaulipas","crm_name":"TAMAULIPAS"},
        {"name":"Tlaxcala","crm_name":"TLAXCALA"},
        {"name":"Veracruz","crm_name":"VERACRUZ"},
        {"name":"Yucatán","crm_name":"YUCATAN"},
        {"name":"Zacatecas","crm_name":"ZACATECAS"}
      ];
      return estados;
    }


    
}
