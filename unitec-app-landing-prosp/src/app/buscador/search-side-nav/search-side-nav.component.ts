import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { AutocompleteService } from '../../services/autocomplete.service';
import { NavegadorService } from '../../services/navegador.service';

    declare let jQuery : any;

@Component({
    selector: 'search-side-nav',
    templateUrl: './search-side-nav.component.html',
    styleUrls: ['./search-side-nav.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    providers: [ AutocompleteService, NavegadorService ]
})
export class SearchSideNavComponent implements OnInit {

    whatsbrowser : string;
    
    constructor(
        private autocomplete : AutocompleteService,
        private navegador : NavegadorService
    ) {
        this.whatsbrowser = navegador.whatsBrowser();
    }
    ngOnInit() {
        let that = this;
        this.autocomplete.callAutocomplete( '#gcsextrangero', "//clients1.google.com/complete/search?hl=en&client=partner&source=gcsc&partnerid=002268575599804991473:n-g-9uohyde&ds=cse&nocache=" );
    }
}