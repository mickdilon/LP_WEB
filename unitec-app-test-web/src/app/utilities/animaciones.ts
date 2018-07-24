import { Injectable } from '@angular/core';

declare var $ : any;
declare var jQuery : any;

@Injectable()
export class Animaciones{

    myToggle( selector ){
        jQuery( selector ).toggle( 'slow' );
    }
    
}