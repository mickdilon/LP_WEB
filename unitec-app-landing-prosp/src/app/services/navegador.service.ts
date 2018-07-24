import { Injectable } from '@angular/core';

declare let jQuery: any;

@Injectable()

export class NavegadorService {

    constructor() {}

    whatsBrowser(){
        if( ( /chrom(e|ium)/.test( navigator.userAgent.toLowerCase() ) ) ){
            return('Chrome');
        }else{
            return ( "no definido" )
        }
    }
}