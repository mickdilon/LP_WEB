import { Injectable, OnDestroy } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
declare let jQuery : any;
declare let $ : any;

@Injectable()
export class AutocompleteService implements OnDestroy{
    private id : string;
    private url: string;
    
    private headers = new Headers({ 'Accept': 'application/jsonp', 'Content-Type' : 'application/jsonp','Access-Control-Allow-Origin' : '*' });
    private options = new RequestOptions({ headers: this.headers });

    private suggestions : any = [];
    private suggest : any = [];
    private response : any = [];

    private asyncresp : any;

    constructor( 
        private http : Http 
    ){}

    ngOnDestroy(){
        this.suggestions = null;
    }

    callAutocomplete( id, url ){
        this.id = id;
        this.url = url; //"//clients1.google.com/complete/searchhl=en&client=partner&source=gcsc&partnerid=002268575599804991473:n-g-9uohyde&ds=cse&nocache="
        let that = this;

        jQuery( id ).typeahead({
            hint: false,
            minLength: 1,
            classNames : { 
                sugerencia :  'typeahead-hint' , 
                seleccionable :  'typeahead-menu', 
                input: 'typeahead-input',
                hint: 'typeahead-hint' ,
                menu: 'typeahead-menu',
                open: 'typeahead-open'
            } 
        } , {
            name: 'carreras',
            source: function( request, syncresp, asyncresp ){
                that.asyncresp = asyncresp;
                let urlautocomplete = url + Math.random().toString() + "&q=" + request;
                //Aqui se define que subscripcion hara el typeahead mediante el id pasado
                //if( id == ".inputGCS" || id == "#gcsextrangero" ){
                    $.ajax(urlautocomplete, 
                        {
                            dataType: 'jsonp', 
                            timeout: 500,     
                            success: function (data,status,xhr) {
                                this.suggest = [];   
                                console.log("OK");
                                //console.log(data);
                                for( let item = 0; item < data[1].length; item++){
                                    this.suggest.push( data[1][item][0] );
                                }
                                console.log(this.suggest);
                                that.asyncresp(this.suggest);
                            
                            },
                            error: function (jqXhr, textStatus, errorMessage) { 
                                console.log("Error");
                                console.log(jqXhr);
                                console.log(textStatus);
                                console.log(errorMessage);
                        
                            }
                        });
                //}
                return this.asyncresp;
            }, 
            limit: 10
        });
    }
}
