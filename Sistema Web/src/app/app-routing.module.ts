import { VisualizarRutasComponent } from './pages/crear-rutas/visualizar-rutas/visualizar-rutas.component';
import { VisualizarHorariosComponent } from './pages/horarios/visualizar-horarios/visualizar-horarios.component';

import { ConductoresComponent } from './pages/conductores/conductores.component';
import { CrearRutasComponent } from './pages/crear-rutas/crear-rutas.component';
import { PersonalAdminComponent } from './pages/personal-admin/personal-admin.component';
import { HomeComponent } from './pages/home/home.component';
import { AdministrarRolComponent } from './pages/roles/administrar-rol/administrar-rol.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulosAdminComponent } from './pages/modulos-admin/modulos-admin.component';
import { RegistroPerAdmComponent } from './pages/registro-per-adm/registro-per-adm.component';
import { RolesComponent } from './pages/roles/roles.component';
import { RutasComponent } from './pages/rutas/rutas.component';
import { FormulariosComponent } from './pages/formularios/formularios.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { TrayectoriasComponent } from './pages/trayectorias/trayectorias.component';
import { ParadasComponent } from './pages/paradas/paradas.component';
import { HorariosComponent } from './pages/horarios/horarios.component';
import { BusesComponent } from './pages/buses/buses.component';
import { RegistrarConductorComponent } from './pages/conductores/registrar-conductor/registrar-conductor.component';
import { VisualizarConductorComponent } from './pages/conductores/visualizar-conductor/visualizar-conductor.component';
import { LoginComponent } from './login/login.component';
import { CargarImagenComponent } from './cargar-imagen/cargar-imagen.component';
import { VisualizarPersonalComponent } from './pages/personal-admin/visualizar-personal/visualizar-personal.component';
import { RegistrarBusesComponent } from './pages/buses/registrar-buses/registrar-buses.component';
import { VisualizarBusesComponent } from './pages/buses/visualizar-buses/visualizar-buses.component';
import { EnviarNotificacionComponent } from './pages/notificaciones/enviar-notificacion/enviar-notificacion.component';
import { VisualizarNotificacionComponent } from './pages/notificaciones/visualizar-notificacion/visualizar-notificacion.component';
import { RespuestaFormulariosComponent } from './pages/formularios/respuesta-formularios/respuesta-formularios.component';
import { VisualizarFormulariosComponent } from './pages/formularios/visualizar-formularios/visualizar-formularios.component';
import { CrearTrayectoriaComponent } from './pages/trayectorias/crear-trayectoria/crear-trayectoria.component';
import { CrearParadaComponent } from './pages/paradas/crear-parada/crear-parada.component';
import { VisualizarTrayectoriasComponent } from './pages/trayectorias/visualizar-trayectorias/visualizar-trayectorias.component';
import { CrearHorariosComponent } from './pages/horarios/crear-horarios/crear-horarios.component';
import { RegistrarrutasComponent } from './pages/crear-rutas/registrarrutas/registrarrutas.component';
import { NotFoundComponent } from './not-found/not-found.component'
import { LoginguardService } from './_service/loginguard.service';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ModificarPerfilComponent } from './pages/perfil/modificar-perfil/modificar-perfil.component';
import { EditarHorariosComponent } from './pages/horarios/editar-horarios/editar-horarios.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { DetalleComponent } from './pages/reportes/detalle/detalle.component';


const routes: Routes = [
  { path: 'imagen', component: CargarImagenComponent },

  { path: 'modulosAdmin', component: ModulosAdminComponent, canActivate: [LoginguardService] },

  {
    path: 'reportes', component: ReportesComponent, children: [
      { path: 'detalle', component: DetalleComponent }
    ], canActivate: [LoginguardService]
  },


  {
    path: 'perfil', component: PerfilComponent, children: [
      { path: 'modificarPerfil', component: ModificarPerfilComponent }
    ], canActivate: [LoginguardService]
  },

  {
    path: 'visualizarNotificacion', component: VisualizarNotificacionComponent,
    children: [
      { path: 'enviarNotificacion', component: EnviarNotificacionComponent }
    ], canActivate: [LoginguardService]
  },

  {
    path: 'visualizarFormulario', component: VisualizarFormulariosComponent, children: [
      { path: 'edicionFormulario/:id', component: RespuestaFormulariosComponent }
    ], canActivate: [LoginguardService]
  },

  {
    path: 'visualizarPersonal', component: VisualizarPersonalComponent, children: [
      { path: 'edicionPersonal/:uid', component: RegistroPerAdmComponent },
      { path: 'registroPerAdm', component: RegistroPerAdmComponent },

    ], canActivate: [LoginguardService]
  },

  { path: 'login', component: LoginComponent },

  {
    path: 'moduloRutas', component: RutasComponent, children: [
      {
        path: 'visualizarTrayectoria', component: VisualizarTrayectoriasComponent, children: [
          { path: 'crearTrayectoria', component: CrearTrayectoriaComponent }
        ]
      },

      {
        path: 'visualizarConductores', component: VisualizarConductorComponent, children: [
          { path: 'edicionConductores/:id', component: RegistrarConductorComponent },
          { path: 'registrarConductores', component: RegistrarConductorComponent }
        ]
      },

      {
        path: 'visualizarBuses', component: VisualizarBusesComponent, children: [
          { path: 'edicionBuses/:id', component: RegistrarBusesComponent },
          { path: 'registroBuses', component: RegistrarBusesComponent },
        ]
      },

      {
        path: 'visualizarHorarios', component: VisualizarHorariosComponent, children: [
          { path: 'edicionHorarios/:id', component: EditarHorariosComponent },
          { path: 'crearHorarios', component: CrearHorariosComponent },
        ]
      },

      {
        path: 'visualizarRutas', component: VisualizarRutasComponent, children: [
          { path: 'edicionRuta/:id', component: RegistrarrutasComponent },
          { path: 'registrarRutas', component: RegistrarrutasComponent }
        ]
      },


    ], canActivate: [LoginguardService]
  },




  { path: 'buses', component: BusesComponent, canActivate: [LoginguardService] },
  { path: 'crearParada', component: CrearParadaComponent, canActivate: [LoginguardService] },
  { path: 'horarios', component: HorariosComponent, canActivate: [LoginguardService] },
  { path: 'conductores', component: ConductoresComponent, canActivate: [LoginguardService] },
  { path: 'rutas', component: CrearRutasComponent, canActivate: [LoginguardService] },
  { path: 'trayectorias', component: TrayectoriasComponent, canActivate: [LoginguardService] },
  { path: 'roles', component: RolesComponent, canActivate: [LoginguardService] },
  { path: 'paradas', component: ParadasComponent, canActivate: [LoginguardService] },
  { path: 'personalAdmin', component: PersonalAdminComponent, canActivate: [LoginguardService] },
  { path: 'formularios', component: FormulariosComponent, canActivate: [LoginguardService] },
  { path: 'notificaciones', component: NotificacionesComponent, canActivate: [LoginguardService] },
  { path: 'administrarRol', component: AdministrarRolComponent, canActivate: [LoginguardService] },





  { path: 'home', component: HomeComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },

  { path: 'not-found', component: NotFoundComponent },
  {
    path: '**',
    redirectTo: 'not-found',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
