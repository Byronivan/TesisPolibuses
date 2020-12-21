import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from './../../../material/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EnviarNotificacionComponent } from './enviar-notificacion.component';

describe('EnviarNotificacionComponent', () => {
    let component: EnviarNotificacionComponent;
    let fixture: ComponentFixture<EnviarNotificacionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EnviarNotificacionComponent],
            imports: [
                MaterialModule,
                FormsModule,
                AngularFireModule.initializeApp(environment.firebase),
                RouterTestingModule.withRoutes([]),
                AngularFireStorageModule,
                BrowserAnimationsModule,
                ReactiveFormsModule
            ],
                
            providers: [
                AngularFirestore,
                AngularFireAuth
            ]
        })
            .compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(EnviarNotificacionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });
    
    it('Debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Debería validar que se ingrese un fecha porque es un campo requerido', () => {
        let fecha = component.form.controls['fecha']
        let errors = {};
        errors = fecha.errors || {};

        fecha.setValue('21/11/2020');
        errors = fecha.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Debería validar que se ingrese el asunto porque es un campo requerido', () => {
        let asunto = component.form.controls['asunto']
        let errors = {};
        errors = asunto.errors || {};

        asunto.setValue("El servicio se suspenderá");
        errors = asunto.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Debería validar que se ingrese la descripción porque es un campo requerido', () => {
        let descripcion = component.form.controls['descripcion']
        let errors = {};
        errors = descripcion.errors || {};

        descripcion.setValue("El día 06 de diciembre no habrá transporte.");
        errors = descripcion.errors || {};
        expect(errors['required']).toBeFalsy();
    })
   
})