// Componentes del core de angular y utils
import { BrowserModule           } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule     } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
// Modulo para cookies
import { CookieService } from 'ngx-cookie-service';
// Componentes padre de formularios
import { formularioTradicionalComponent } from './formularios/forms_parent_components/formulario-tradicional/formulario-tradicional.component';
// import { formularioTradicionalOSComponent } from './formularios/forms_parent_components/formulario-tradicional-OS/formulario-tradicional-OS.component';
import { CommonModule } from '@angular/common';

// Componentes hijo del formulario
import { frmNombreComponent   } from './formularios/forms_child_components/frm-nombre/frm-nombre.component';
import { frmApaternoComponent } from './formularios/forms_child_components/frm-apaterno/frm-apaterno.component';
import { frmAmaternoComponent } from './formularios/forms_child_components/frm-amaterno/frm-amaterno.component';
import { frmMailComponent     } from './formularios/forms_child_components/frm-mail/frm-mail.component';
import { frmMailLoginComponent } from './formularios/forms_child_components/frm-mail-login/frm-mail-login.component'
import { frmEstadoComponent   } from './formularios/forms_child_components/frm-estado/frm-estado.component';
import { frmEstadoExpuestoComponent   } from './formularios/forms_child_components/frm-estado-expuesto/frm-estado-expuesto.component';
import { frmBusquedaIntegradaComponent } from './formularios/forms_child_components/frm-busqueda-integrada/frm-busqueda-integrada.component';

// import { frmProductosExpuestosComponent } from './formularios/forms_child_components/frm-productos-expuestos/frm-productos-expuestos.component';
import { frmLineasNegocioAppComponent   } from './formularios/forms_child_components/frm-lineas-negocio-app/frm-lineas-negocio-app.component';
import { frmCelularComponent  } from './formularios/forms_child_components/frm-celular/frm-celular.component';
import { frmTelCasaComponent } from './formularios/forms_child_components/frm-tel-casa/frm-tel-casa.component';
import { frmContra1  } from './formularios/forms_child_components/frm-contra1/frm-contra1.component';
import { frmContra2 } from './formularios/forms_child_components/frm-contra2/frm-contra2.component';



import { frmEstudioInteresComponent } from './formularios/forms_child_components/frm-estudio-interes/frm-estudio-interes.component';
import { frmPoliticasCondiciones } from './formularios/forms_child_components/frm-politicas-condiciones/frm-politicas-condiciones.component';
import { frmCicloComponent } from './formularios/forms_child_components/frm-ciclo/frm-ciclo.component';
import { frmRevalidacionComponent } from './formularios/forms_child_components/frm-revalidacion/frm-revalidacion.component';
import { frmProblemasCuenta } from './formularios/forms_child_components/frm-problemas-cuenta/frm-problemas-cuenta.component';
// Servicio de validaciones
import { userValidations } from './formularios/forms_services/validaciones.service';
// Servicio para leer los Json
import { readJson } from './services/readJson.service';
// Servicio para traer los Json
import { getJson } from './services/getJson.service';
// Servicio WebSpeach
import { WebspeachService } from './services/webspeach.service';
// Servicio de envío de los formularios
import { sendService } from './formularios/forms_services/send.service';
// Servicio de las reglas de los input
import { reglasInputsService } from './formularios/forms_services/reglasInputs.service';
// Servicio para autocomplete
import { AutocompleteService } from './services/autocomplete.service';
// Servicio de metodos genericos
import { GenericService } from './services/generic.service';
// Servicio para manipulacion de las cookies en el formulario
import {formCookiesService} from './formularios/forms_services/formCookies.service';

// Componente modal
// Servico que proporcionara animaciones.
import { Animaciones } from './utilities/animaciones';
import { ModalComponent } from './utilities/modal/modal.component';
import { ModalFormularioTradicionalComponent } from './formularios/forms_parent_components/modal-formulario-tradicional/modal-formulario-tradicional.component';
import { ModalAppFormularioTradicionalComponent } from './formularios/forms_parent_components/modal-app-formulario-tradicional/modal-app-formulario-tradicional.component';
// import { MentionModule } from 'angular2-mentions/mention';
import { nextOnEnterDirective } from './directives/nextOnenter.directive';
import { FormularioGCSComponent } from './buscador/formularioGCS/formularioGCS.component';
import { FormularioLoginComponent } from './formularios/forms_parent_components/formulario-login/formulario-login.component';
import { FrmNcuentaComponent } from './formularios/forms_child_components/frm-ncuenta/frm-ncuenta.component';
import { FrmRadioPerfilAlumnoMaestroComponent } from './formularios/forms_child_components/frm-radio-perfil-alumno-maestro/frm-radio-perfil-alumno-maestro.component';
import { FrmAvisoDePrivacidadComponent } from './formularios/forms_child_components/frm-aviso-de-privacidad/frm-aviso-de-privacidad.component';
// import {TypewriterModule} from 'ng2-typewriter';
import { MiniSimuladorComponent } from './mini-simulador/mini-simulador.component';
import { SearchSideNavComponent } from './buscador/search-side-nav/search-side-nav.component';

@NgModule({
  declarations: [
    formularioTradicionalComponent,
    // formularioTradicionalOSComponent,
    frmNombreComponent,
    frmApaternoComponent,
    frmAmaternoComponent,
    frmMailComponent,
    frmMailLoginComponent,
    frmEstadoComponent,
    frmEstadoExpuestoComponent,
    // frmProductosExpuestosComponent,
    frmLineasNegocioAppComponent,
    frmCelularComponent,
    frmTelCasaComponent,
    frmContra1,
    frmContra2,
    frmEstudioInteresComponent,
    frmPoliticasCondiciones,
    frmProblemasCuenta,
    frmCicloComponent,
    frmRevalidacionComponent,
    frmBusquedaIntegradaComponent,
    ModalComponent,
    ModalFormularioTradicionalComponent,
    ModalAppFormularioTradicionalComponent,
    nextOnEnterDirective,
    FormularioGCSComponent,
    FormularioLoginComponent,
    FrmNcuentaComponent,
    FrmRadioPerfilAlumnoMaestroComponent,
    FrmAvisoDePrivacidadComponent,
    MiniSimuladorComponent,
    SearchSideNavComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    CommonModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ReactiveFormsModule, CookieService, userValidations, readJson, getJson, sendService, Animaciones, reglasInputsService, WebspeachService, AutocompleteService, GenericService, formCookiesService ],
  entryComponents: [ FormularioLoginComponent, FormularioGCSComponent, formularioTradicionalComponent, ModalComponent, ModalFormularioTradicionalComponent, ModalAppFormularioTradicionalComponent, SearchSideNavComponent ]
})
// Clase para construir la funcionalidad del modulo
export class AppModule {
    // Carga condicional de componentes padre
    ngDoBootstrap( ref: ApplicationRef ) {
      // Configuracion para hacer funcionar en producion el elemento buscadorGCS
      if (location.href.indexOf( 'buscador' ) !== -1 ) {
        ref.bootstrap( FormularioGCSComponent );
      } else if (location.href.indexOf( 'biblioteca-virtual' ) !== -1 ) {
      // Carga el componente Login para ingresar a la biblioteca Virtual
        ref.bootstrap( FormularioLoginComponent );
        ref.bootstrap( ModalComponent );
        ref.bootstrap( ModalFormularioTradicionalComponent );
        ref.bootstrap( ModalAppFormularioTradicionalComponent );
        // ref.bootstrap( SearchSideNavComponent );
      } else {
      // Formulario
        ref.bootstrap( ModalComponent );
        ref.bootstrap( ModalFormularioTradicionalComponent );
        ref.bootstrap( ModalAppFormularioTradicionalComponent );
        // ref.bootstrap( SearchSideNavComponent );
      }
    }
}
