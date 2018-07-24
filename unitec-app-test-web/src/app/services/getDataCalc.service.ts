import { Injectable } from '@angular/core';
//Importamos el servicio de readJson JEAB 14-03-2018
import { readJson } from "./readJson.service";

declare let jQuery: any;
declare let $: any;

@Injectable()

export class GetDataCalcService 
{

    constructor(private readJsonService:readJson) {}

    getCarreras(linea, campus = "") {
        let keySearch = "lineaweb";
        let arrayCarrerasPorLinea = [];
        let objJsonCarreras = JSON.parse(localStorage.getItem("jsonCarreras"));
        arrayCarrerasPorLinea = this.readJsonService.buscar(
          keySearch,
          linea,
          objJsonCarreras
        );
      
        return arrayCarrerasPorLinea
      }
    
      getCarrerasBien(categorias){
        let objJsonCarreras = JSON.parse(localStorage.getItem("jsonLinksCategorias"));
        let categoriasno= new Array();
        Object.entries(categorias).forEach(function (key, value) {
          categoriasno.push(key[1]['Grupo_carreras']);
        });
        //console.log(categoriasno);
         let nombres=new Array();
         Object.entries(objJsonCarreras).forEach(function (key, value) {
           console.log(key[1]['IdCategoria']);
           if (categoriasno.includes(key[1]['IdCategoria'])) {
             nombres.push(key[1]);
            } 
         });
        return nombres;
      }

}
