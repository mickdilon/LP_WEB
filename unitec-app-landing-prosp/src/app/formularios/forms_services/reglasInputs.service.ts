import { Injectable } from '@angular/core';

declare var $:any;
declare var jQuery:any;

@Injectable()
export class reglasInputsService
{

    numVecestexto(codigo = "", campoid = "", key = "")
    {
        var arrayValorInput = jQuery('#'+campoid).val().split("");
        var tamArrayValorInput = jQuery('#'+campoid).val().length;
        var flagRepetido = false;
        if(tamArrayValorInput > 0) {
            //console.log(tamArrayValorInput);
            for(let i = 0; i < arrayValorInput.length; i ++) {
                //console.log("Valor: " + arrayValorInput[i]);
                if(
                    (arrayValorInput[i] == arrayValorInput[i + 1]) &&
                    (arrayValorInput[i + 1] == key) ) {
                    return false;
                }
            }
        }
        if(jQuery('#'+campoid).val().length==0){ 

            var keyAnt=codigo;
            var vecesText=0;
            return true;

        }else if(keyAnt == codigo){
            if(vecesText>=1){ 
                return false;               
            }else if(vecesText!=1){ 

                keyAnt = codigo; 
                vecesText = vecesText+1;
                return true;

            }
        }else{
            
            if (keyAnt!=codigo){ 
                keyAnt=codigo; 
                vecesText=0;
                return true;
            }
        }
    }


    EvaluateTextP(obj, keycode , key = "")
    {
        var validoT= false; 
        var opc = true;
        var tecla = keycode;
        validoT = this.numVecestexto(tecla,obj.id, key);
        if (tecla == 8 ){
            return true;
            }
        else if (tecla == 13 && obj.value.length > 0){
            var espacio = true;
            return;
            }

        else if(validoT ==true){    
        if(tecla == 32 && espacio== true){
            espacio = false;
            return true;
        }

        else if (espacio= false && tecla ==32 ){
            return false;
        }      
         
        if((tecla!=32) && !((tecla > 8 && tecla < 33) || (tecla < 65 && tecla > 31) || (tecla > 90 && tecla < 97) || tecla > 122)){
            espacio= true;
        }

        // if ((tecla > 8 && tecla < 33) || (tecla < 65 && tecla > 31) || (tecla > 90 && tecla < 97) || tecla > 122 ){
        //     return  false;
        // }

        if ((tecla > 8 && tecla < 32) || (tecla > 32 && tecla < 65) || (tecla > 90 && tecla < 97) || tecla > 122 ){
            return  false;
        }

        return true;
        }
        else return false;
    }  
    sinEspacios(e)
    {
        var tecla = e.keyCode;
        if(tecla==13) {
        e.preventDefault();
        }
        if (tecla ==32 ){return false;} 
        if (tecla !=32 ){return true;}
    }
    esNumero(keycode){
    var tecla = keycode;
        if(tecla > 31 && (tecla < 48 || tecla > 57 )){
            return  false;
        }
    }
}//Termina el servicio