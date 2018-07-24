import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as _ from "lodash";

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

@Injectable()
export class WebspeachService {
    speechRecognition: any;

    constructor(private zone: NgZone) {
    }

    record(): Observable<string> {
        return Observable.create(observer => {
            const { webkitSpeechRecognition }: IWindow = <IWindow>window;
            this.speechRecognition = new webkitSpeechRecognition();
            //this.speechRecognition = SpeechRecognition;
            this.speechRecognition.continuous = true;
            //this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'es';
            this.speechRecognition.maxAlternatives = 1;
            //Mejoras JEAB 19-09-2017
            //this.speechRecognition.interimResults = true;
            this.speechRecognition.continuous = false;

            this.speechRecognition.onresult = speech => {
                let term: string = "";
                if (speech.results) {
                    var result = speech.results[speech.resultIndex];
                    var transcript = result[0].transcript;
                    if (result.isFinal) {
                        if (result[0].confidence < 0.3) {
                            console.log("Resultado no conocido - Intenta de nuevo");
                        }
                        else {
                            term = _.trim(transcript);
                            //console.log("¿Dijiste algo? -> " + term + " , Si no, entonces di otra cosa...");
                        }
                    }else {
                        console.log("Not is final");
                    }
                }
                this.zone.run(() => {
                    observer.next(term);
                });
            };

            this.speechRecognition.onerror = error => {
                observer.error(error);
            };

            this.speechRecognition.onend = () => {
                observer.complete();
            };
            /*this.speechRecognition.onaudioend = () => {
                console.log("Termino");
                this.speechRecognition.start();
            };*/
            this.speechRecognition.start();
            console.log("habla - estoy preparado para escribir !!!");
        });
    }

    DestroySpeechObject() {
        if (this.speechRecognition)
            this.speechRecognition.stop();
    }
}
