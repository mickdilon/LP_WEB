import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'modal-formulario-tradicional',
  templateUrl: './modal-formulario-tradicional.component.html',
  styleUrls: ['./modal-formulario-tradicional.component.scss']
})

export class ModalFormularioTradicionalComponent implements OnInit {
  titulo_modal_formulario = "Solicita más información";
  constructor() { } ngOnInit() { }
}
