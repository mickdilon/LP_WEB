import { Injectable } from '@angular/core';

declare var $:any;

@Injectable()
export class readJson{
    private miArray = [];
    public miJSON;

    constructor(){ }

    getJSONDimension( data, elemento)
    {
        let elementos =  elemento.split("|");
        let arreglo = data;
        let temparr = arreglo[ elementos[ 0 ] ];
        for( let i = 1; i < elementos.length ; i++ ) {
            temparr =  temparr[ elementos[ i ] ];
        }
        return temparr;
    }

    fillMyJSON( route ){

           $.ajax({
                type : 'GET',
                url : route,
                success : function( resultado ) {
                    //console.log("resultado");
                }
            }).done(function(resultado){
                //console.log("Hecho",resultado);
            });
    }

    getIndex(data, elem){
        for( let i = 0; i < data.length; i++ ){
            if( Object.keys(data[i]) == elem ){
                return i;
            }
        }
    }

    // retorna el arreglo idicando ruta especifica dividida en pipes
    getJSON( data, elemento, withIndex ){  

        let elementos =  elemento.split("|");
        let arreglo = data;

        let index, secondElemt;

        if( withIndex ){
                index = elementos.shift();
                secondElemt = elementos.shift();
        }else{ 
            secondElemt = elementos.shift();
            index = this.getIndex( arreglo, secondElemt );
        }

        let temparr = arreglo[ index ];
        temparr = temparr[ secondElemt ];

        for(let i = 0; i < elementos.length ; i++ ){
            temparr = temparr[ elementos[ i ] ];
        }

        return temparr;
    }

        //retorna en la data desde el primer padre del json los coinsidentes iguales a key => value
        buscar( key, value, jsonCarreras ){
            let resultadoBusqueda = [];
            for( let i in jsonCarreras ){
                if( this.getObjects( jsonCarreras[i], key, value ).length != 0 ){
                    resultadoBusqueda.push( jsonCarreras[i] )
                }
            }
            return resultadoBusqueda;
        }
    

        //Metodo que remueve duplicados
        removeDuplicates(arr, key) {
            var values = {};
            return arr.filter(function(item){
                var val = item[key];
                var exists = values[val];
                values[val] = true;
                return !exists;
            });
        }

        //Eliminar duplicados nueva
        removeDuplicatesN(originalArray, prop) {
            var newArray = [];
            var lookupObject  = {};
       
            for(var i in originalArray) {
               lookupObject[originalArray[i][prop]] = originalArray[i];
            }
       
            for(i in lookupObject) {
                newArray.push(lookupObject[i]);
            }
             return newArray;
        }




    //Retorna los coinsidentes entre key => value desde padre directo
             getObjects(obj, key, val) {
                var objects = [];
                for (var i in obj) {
                    if (!obj.hasOwnProperty(i)) continue;

                    if (typeof obj[i] == 'object') {
                        objects = objects.concat(this.getObjects(obj[i], key, val));    
                    } else 
                    //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
                    if (i == key && obj[i] == val || i == key && val == '') { //
                        objects.push(obj);
                    } else if (obj[i] == val && key == ''){
                        //only add if the object is not already in the array
                        if (objects.indexOf(obj) == -1){
                            objects.push(obj);
                        }
                    }
                }
                return objects;
            } 

    //Retorna arreglo con el total de elemetos que sean igual a key
    getValues(obj, key) {
        let objects = [];
        for (let i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getValues(obj[i], key));
            } else if (i == key) {
                objects.push(obj[i]);
            }
        }
        return objects;
    }

    //Retorna arreglo con el total de elemetos que sean igual a val
    getKeys(obj, val) {
        let objects = [];
        for (let i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getKeys(obj[i], val));
            } else if (obj[i] == val) {
                objects.push(i);
            }
        }
        return objects;
    }

    /**
    * getNodosJSON
    *
    * @param      {obj}     JSON Object
    * @return     {Array}   Arreglo con los Nodos Encontrados en el JSON.
    */
    getNodosJSON(obj){
        let searchNodos = [];
        for(let x = 0; x < obj.length; x++) {                   
            searchNodos = Object.keys(obj[x]);                   
        }
        return searchNodos;
    }

    removeDuplas(arreglo) {
        var n = {},r=[];
        for(var i = 0; i < arreglo.length; i++) {
            if (!n[arreglo[i]]) {
                n[arreglo[i]] = true; 
                r.push(arreglo[i]); 
            }
        }
        return r;
    }    
  
    /**
     * generaArray.
     *
     * @param      {arreglo Multidimensional}            arreglo Multidimensional
     * @return     {arreglo}                             arreglo
     * @descripcion {Genera un array Dimensional de un Multidimensional Para CAMPUS}
     */
    generaArray(arreglo){
        let temp = "";
        let temp2 = "";
        let Campus = [];

        for (let i = 0; i <= arreglo.length - 1; i++) {
            temp += arreglo[i] + ",";
        }

        temp2 = temp.substring(0, (temp.length)-1);
        Campus = temp2.split(',');
        return Campus;
    }

    /**
     * getValuesJSON. (Funciona igual que buscar)
     *
     * @param      {obj}  obj     JSON Object
     * @param      {key}  key     indice a buscar
     * @return     {Array}        The values json.
     * @return     unique({Array})       JSON -> Array sin valores duplicados.
     * @descripcion {Devuelve JSON del key a buscar o el Arreglo dependiendo del Dato Contenido}
     * @Ejemplo Buscar todos los campus contenidos en el JSON
     */
    getValuesJSON(obj, key) {
        let arrValues = [];
        for(let x = 0; x < obj.length; x++) {
            if (obj[x][key]!= null) {
                arrValues.push(obj[x][key]);
            }                    
        }                
        return arrValues;
    }

    /**
     *getValuesCampus.
     *Total de Parametros 4
     *
     * @param      {obj}  JSON Object
     * @param      {val}  Parametros a Buscar: lineaweb|campus|QRO
     * @return     {Array} Array values.
     * @descripcion {obtener info de un array contenido en un JSON}
     */
    getValuesCampus(obj, val) {
        let arrCampus = [];
        let arrLinea = [];                
        let lineas = [];
        let parametros = val.split("|");
        /*JSON.stringify(obj);*/

        for(let x = 0; x < obj.length; x++) {
            arrLinea.push(obj[x][parametros[0]]);
            arrCampus.push(obj[x][parametros[1]].toString()); //Convertir el arreglo en string                                       
        }

        for (let i = 0; i < arrCampus.length; i++) {
            if(arrCampus[i].indexOf(parametros[2]) != -1) {
                lineas.push(arrLinea[i]);
            }
        }
        return lineas;                
    }

    /**
     * getJSONxNivel.
     *
     * @param      {obj}            JSON Object
     * @param      {key}            Parametros a Buscar Por Niveles o Nodos GASTRO|costoMateria
     * @return     {JSON Object}    JSON Filtrado
     * @descripcion {Filtra JSON dependiendo el nivel DESEADO Ejemplo 'Nivel1' | 'Nivel2' }
     */
    getJSONxNivel(obj, key) {
        let nivel = [];
        let nivel2 = [];

        let searchNodos = [];
        let parametros = "";

        if (key.indexOf("|") == -1) {
            parametros = key.split("|");
            /*Se obtiene JSON Completo 1er Nivel*/
            for(let x = 0; x < obj.length; x++) {
                if (obj[x][parametros[0]]!= null) {
                    /*Se obtienen los nodos del Primer Nivel*/
                    searchNodos = Object.keys(obj[x][parametros[0]]);
                    nivel.push(obj[x][parametros[0]]);
                }                    
            }
        } else{
            parametros = key.split("|");
            nivel = this.getJSONxNivel(obj, parametros[0]);
            /*alert(JSON.stringify(nivel));*/
            nivel2 = this.getJSONxNivel(nivel, parametros[1]);

            if (nivel2.length == 0) {
                nivel2 = this.getJSONxNivel(nivel, "TODOS");
            }
            /*alert(JSON.stringify(nivel2));*/
            nivel = nivel2;
        }              
        return nivel;
    }

    /**
     * getBeca.
     *
     * @param      {obj}    JSON Object Completo
     * @param      {key}    Parametros a Buscar: NUTRI|MAR|8.1
     * @return     {value}  Valor Beca.
     * * @descripcion {Obtener la Beca de una carrera y promedio especifico}
     */
    getBeca(obj, key) {
        let arrNivel1 = [];
        let arrNivel2 = [];
        let arrNivel3 = [];

        let parametros = key.split("|");
        let searchNodos = [];
        let rangos = [];
        let beca = "";
        let result = "";
        let promedio = "";
        let tempPromedio;

        tempPromedio =  this.getJSONxNivel( this.getJSONxNivel(obj, parametros[0] + "|" + parametros[1]), "r1" );
        promedio = tempPromedio[0]['promedio'];               
        parametros[2] = (parametros[2].length > 0) ? parametros[2]: promedio[0];                

        /*Se obtiene JSON Completo 1er Nivel*/
        for(let x = 0; x < obj.length; x++) {
            if (obj[x][parametros[0]]!= null) {
                /*Se obtienen los nodos del Primer Nivel*/
                searchNodos = Object.keys(obj[x][parametros[0]]);
                arrNivel1.push(obj[x][parametros[0]]);
            }                    
        }  

        parametros[1] = (searchNodos.indexOf(parametros[1])!= -1) ? parametros[1]: "TODOS";

        /*Se obtiene JSON Completo 2do Nivel apartir del Primero*/
        for(let x = 0; x < arrNivel1.length; x++) {
            if (arrNivel1[x][parametros[1]]!= null) {
                rangos = Object.keys(arrNivel1[x][parametros[1]]);
                arrNivel2.push(arrNivel1[x][parametros[1]]);
            }                    
        }                               
        
        //obtiene Beca
        for(let x = 0; x < arrNivel2.length; x++) {
            for (let i = 0; i < rangos.length; i++) {
                if (arrNivel2[x][rangos[i]]!= null) {
                    beca = arrNivel2[x][rangos[i]]['promedio'];
                    if (beca[0] <= parametros[2] && ( beca[1] >= parametros[2] || beca[1] <= parametros[2] ) ) {
                        result = arrNivel2[x][rangos[i]]['beca'];                                
                    }                                                   
                }
            }                                        
        }
        return result;
    }

    /**
     * getCostoxMateria.
     * 
     * @param     {jsonCompleto}        obj Nativo
     * @param      {duracionCarrera}      'POSONCUAT|duracion'
     * @param      {searchCampus}        "POSONCUAT|costoMateria"
     * @param      {obj}                  Object JSON
     * @param      {ccampus}              Nombre del campus
     * @param      {nBeca}                % Beca a aplicar
     * @param      {nMaterias}            Número de materias x default 6
     * @return     {JSON}                 Object JSON
     * @descripcion {Obtiene el descuento x # de materias y tipo de pago}
     */
    //Se arega un nuevo parametro objActual
    getCostoxMateria(jsonCompleto, duracionCarrera, searchCampus, obj, campus, nBeca, nMaterias) {
        let nodos:any = [];
        let costosTemp:any = {};
        let costos:any = {};
        let precioLista:any = {};
        let beca = nBeca / 100;
        let costosMaterias = [];
        let costoCompuesto:any;
        let noMateriasTemp;
        let temp = "";
        let duracion:any = {};
        let temCampus = "";
        let ccampus:any;

        //Obtener Todos Los Precios De INGENIERIA               ING|costosMaterias
        let JsonPrimero:any = this.getJSONxNivel( jsonCompleto, searchCampus);        
        //En caso de que la carrera no exista en el campus obtener Campus default
        let posiblesCampus = this.getValuesJSON( JsonPrimero, "1pago" );
        let nodosCarrera:any = this.getNodosJSON( posiblesCampus );
        
        //Buscar si la carrera se imparte en ese Campus 
        ccampus = ( nodosCarrera.indexOf(campus) !== -1 ) ? campus : nodosCarrera[0];
        //Obtener Nodos de la carrera 1pago, 4pagos.. etc       
        nodos = this.getNodosJSON( JsonPrimero );
        temp = duracionCarrera.split("|");
        duracion =  this.getJSONxNivel( this.getJSONxNivel(jsonCompleto, temp[0]), temp[1]);
        noMateriasTemp = this.generaArray( this.getValues(duracion, 'materias') );
        nMaterias = (nMaterias == "" || nMaterias == noMateriasTemp[0] || nMaterias == noMateriasTemp[1]) ? noMateriasTemp[0] : nMaterias;        
        
        for (var i = 0; i < nodos.length; i++) {
            //Obtener Precios Por Campus y por el numero de nodos que lo conforman
            costoCompuesto = this.getJSONxNivel( JsonPrimero , nodos[i]+"|"+ccampus );
            costosMaterias = this.getValuesJSON(obj, nodos[i]);
            //Verificar si es costo Compuesto
            let verificaCostoCompuesto = this.getNodosJSON(costoCompuesto);
                        
            if ( verificaCostoCompuesto.length === 2) {
                var costoUno:any = this.getValues(costoCompuesto, 'uno');
                var costoDos:any = this.getValues(costoCompuesto, 'dos');
                var costoMateriasCampus:any = this.getValues(costosMaterias, ccampus);                

                costosTemp[nodos[i]] = ( ( nMaterias * ( costoUno - ( costoUno * beca ) ) ).toFixed(2) + "|" + ( ( nMaterias ) * ( costoDos - ( costoDos * beca ) ) ).toFixed(2) ).toString();
                precioLista[nodos[i]] = costoUno + "|" + costoDos;

            } else {
                costosTemp[nodos[i]] = ( ( nMaterias * ( costoCompuesto - ( costoCompuesto * beca ) ) ).toFixed(2) ).toString() ;
                precioLista[nodos[i]] = costoCompuesto.toString();
            }
        }

        costos['campus'] = ccampus;
        costos['duracion'] = duracion;
        costos['precioLista'] = precioLista;
        costos['precioBeca'] = costosTemp;
        
        return costos;
    }
    
}


    /*document.getElementById("resultadoGlobal").innerHTML = 
    ( getJSON( miJSON, "PREPA|TODOS|r1", false ) );*/

    // this.buscar("lineaWeb", "INGENIERIA" );

    //Solo retorna el objeto desde el padre directo...
    //console.log( getObjects( miJSON, 'nombre', 'Arturo' ) );

    //Retorna el total de elementos key indicado en todo el JSON 
    //console.log( getValues( miJSON, 'nombre' ) );

    //Retorna todos los elementos con el valor indicado en todo el JSON
    //console.log( getKeys( miJSON, 'Arturo' ) );

    //console.log( this.miArray );