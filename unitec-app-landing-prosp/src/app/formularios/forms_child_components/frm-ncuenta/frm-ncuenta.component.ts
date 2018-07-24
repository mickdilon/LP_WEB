import { Component, Input } from '@angular/core';
import {reglasInputsService} from '../../forms_services/reglasInputs.service';

@Component({
    selector: 'frm-ncuenta',
    templateUrl: './frm-ncuenta.component.html',
    styleUrls: ['./frm-ncuenta.component.scss']
})
export class FrmNcuentaComponent {
    @Input() formularioPadre;
    @Input() asterisk : boolean;
    @Input() fase : string;
    inputComponent : string;

    constructor() { }

    ngOnInit()
    {
      this.inputComponent = this.fase + '.frm_ncuenta';
    }
}