import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

import { FirestoreSettingsToken, AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

/*componentes -- pages */
import { ModulosAdminComponent } from './pages/modulos-admin/modulos-admin.component';
import { RegistroPerAdmComponent } from './pages/registro-per-adm/registro-per-adm.component';
import { RelojComponent } from './pages/reloj/reloj.component';
import { RelojService } from './_service/reloj.service';
import { RolesComponent } from './pages/roles/roles.component';
import { AdministrarRolComponent } from './pages/roles/administrar-rol/administrar-rol.component';
import { HomeComponent } from './pages/home/home.component';
import { PersonalAdminComponent } from './pages/personal-admin/personal-admin.component';
import { RutasComponent } from './pages/rutas/rutas.component';
import { FormulariosComponent } from './pages/formularios/formularios.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { ConductoresComponent } from './pages/conductores/conductores.component';
import { BusesComponent } from './pages/buses/buses.component';
import { TrayectoriasComponent } from './pages/trayectorias/trayectorias.component';
import { ParadasComponent } from './pages/paradas/paradas.component';
import { HorariosComponent } from './pages/horarios/horarios.component';
import { CrearRutasComponent } from './pages/crear-rutas/crear-rutas.component';
import { RegistrarConductorComponent } from './pages/conductores/registrar-conductor/registrar-conductor.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { VisualizarConductorComponent } from './pages/conductores/visualizar-conductor/visualizar-conductor.component';
import { DialogoConductorComponent } from './pages/conductores/visualizar-conductor/dialogo-conductor/dialogo-conductor.component';
import { LoginComponent } from './login/login.component';
import { CargarImagenComponent } from './cargar-imagen/cargar-imagen.component';
import { DialogoPersonalComponent } from './pages/personal-admin/visualizar-personal/dialogo-personal/dialogo-personal.component';
import { VisualizarPersonalComponent } from './pages/personal-admin/visualizar-personal/visualizar-personal.component';
import { RegistrarBusesComponent } from './pages/buses/registrar-buses/registrar-buses.component';
import { VisualizarBusesComponent } from './pages/buses/visualizar-buses/visualizar-buses.component';
import { DialogoBusesComponent } from './pages/buses/visualizar-buses/dialogo-buses/dialogo-buses.component';
import { EnviarNotificacionComponent } from './pages/notificaciones/enviar-notificacion/enviar-notificacion.component';
import { VisualizarNotificacionComponent } from './pages/notificaciones/visualizar-notificacion/visualizar-notificacion.component';
import { DialogoNotificacionComponent } from './pages/notificaciones/visualizar-notificacion/dialogo-notificacion/dialogo-notificacion.component';
import { VisualizarFormulariosComponent } from './pages/formularios/visualizar-formularios/visualizar-formularios.component';
import { RespuestaFormulariosComponent } from './pages/formularios/respuesta-formularios/respuesta-formularios.component';
import { CrearTrayectoriaComponent } from './pages/trayectorias/crear-trayectoria/crear-trayectoria.component';
import { AgmCoreModule } from '@agm/core';
import { CrearParadaComponent } from './pages/paradas/crear-parada/crear-parada.component';
import { VisualizarTrayectoriasComponent } from './pages/trayectorias/visualizar-trayectorias/visualizar-trayectorias.component';
import { VerTrayectoriasComponent } from './pages/trayectorias/visualizar-trayectorias/ver-trayectorias/ver-trayectorias.component';
import { CrearHorariosComponent } from './pages/horarios/crear-horarios/crear-horarios.component';
import { VisualizarHorariosComponent } from './pages/horarios/visualizar-horarios/visualizar-horarios.component';
import { DialogoHorariosComponent } from './pages/horarios/visualizar-horarios/dialogo-horarios/dialogo-horarios.component';
import { PruebaHorariosComponent } from './pages/prueba-horarios/prueba-horarios.component';
import { RegistrarrutasComponent } from './pages/crear-rutas/registrarrutas/registrarrutas.component';
import { VisualizarRutasComponent } from './pages/crear-rutas/visualizar-rutas/visualizar-rutas.component';
import { DialogoRutasComponent } from './pages/crear-rutas/visualizar-rutas/dialogo-rutas/dialogo-rutas.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { LoginguardService } from './_service/loginguard.service';
import { VerFormularioCompletoComponent } from './pages/formularios/ver-formulario-completo/ver-formulario-completo.component';
import { DialogoHorariosNComponent } from './pages/horarios/visualizar-horarios/dialogo-horarios-n/dialogo-horarios-n.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ModificarPerfilComponent } from './pages/perfil/modificar-perfil/modificar-perfil.component';
import { EditarHorariosComponent } from './pages/horarios/editar-horarios/editar-horarios.component';
import { InformacionRutasComponent } from './pages/rutas/informacion-rutas/informacion-rutas.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { DetalleComponent } from './pages/reportes/detalle/detalle.component';



@NgModule({
  declarations: [
    AppComponent,
    ModulosAdminComponent,
    RegistroPerAdmComponent,
    RelojComponent,
    RolesComponent,
    AdministrarRolComponent,
    HomeComponent,
    PersonalAdminComponent,
    RutasComponent,
    FormulariosComponent,
    NotificacionesComponent,
    ConductoresComponent,
    BusesComponent,
    TrayectoriasComponent,
    ParadasComponent,
    HorariosComponent,
    CrearRutasComponent,
    RegistrarConductorComponent,
    VisualizarConductorComponent,
    DialogoConductorComponent,
    LoginComponent,
    CargarImagenComponent,
    DialogoPersonalComponent,
    VisualizarPersonalComponent,
    RegistrarBusesComponent,
    VisualizarBusesComponent,
    DialogoBusesComponent,
    EnviarNotificacionComponent,
    VisualizarNotificacionComponent,
    DialogoNotificacionComponent,
    VisualizarFormulariosComponent,
    RespuestaFormulariosComponent,
    CrearTrayectoriaComponent,
    CrearParadaComponent,
    VisualizarTrayectoriasComponent,
    VerTrayectoriasComponent,
    CrearHorariosComponent,
    VisualizarHorariosComponent,
    DialogoHorariosComponent,
    PruebaHorariosComponent,
    RegistrarrutasComponent,
    VisualizarRutasComponent,
    DialogoRutasComponent,
    NotFoundComponent,
    VerFormularioCompletoComponent,
    DialogoHorariosNComponent,
    PerfilComponent,
    ModificarPerfilComponent,
    EditarHorariosComponent,
    InformacionRutasComponent,
    ReportesComponent,
    DetalleComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDB6zVNvecWni2kPf8LEdIq9edAjdIWpZs',
      libraries: ['places', 'directions']
    })

  ],
  entryComponents: [
    DialogoConductorComponent,
    DialogoPersonalComponent,
    DialogoBusesComponent,
    DialogoNotificacionComponent,
    VerTrayectoriasComponent,
    DialogoHorariosComponent,
    DialogoHorariosNComponent,
    DialogoRutasComponent,
    VerFormularioCompletoComponent,
    InformacionRutasComponent
    
  ],
  providers: [
    RelojService,
    AngularFirestore,
    { provide: FirestoreSettingsToken, useValue: {} },
    LoginguardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
