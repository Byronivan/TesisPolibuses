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
import { RegistrarBusesComponent } from './registrar-buses.component';


describe('RegistrarBusesComponent', () => {
    let component: RegistrarBusesComponent;
    let fixture: ComponentFixture<RegistrarBusesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistrarBusesComponent],
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
        fixture = TestBed.createComponent(RegistrarBusesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });
    
    it('Debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Deberia validar que el número de bus no contenga letras', () => {
        let numero = component.form.controls['numero']
        let errors = {};
        errors = numero.errors || {};

        numero.setValue("12345");
        errors = numero.errors || {};
        expect(errors['pattern']).toBeFalsy();
        expect(errors['required']).toBeFalsy();
    })

    it('Deberia validar que la capacidad del bus no contenga letras', () => {
        let capacidad = component.form.controls['capacidad']
        let errors = {};
        errors = capacidad.errors || {};

        capacidad.setValue("45");
        errors = capacidad.errors || {};
        expect(errors['pattern']).toBeFalsy();
        expect(errors['required']).toBeFalsy();
    })

    it('Deberia validar que la placa del bus sea requerida', () => {
        let placa = component.form.controls['placa']
        let errors = {};
        errors = placa.errors || {};

        placa.setValue("PBKJ-123");
        errors = placa.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Deberia validar que el conductor sea requerido', async () => {
        let capacidad = await component.form.controls['conductor']
        let errors = {};
        errors = capacidad.errors || {};

        capacidad.setValue("Conductor 1");
        errors = capacidad.errors || {};
        expect(errors['required']).toBeFalsy();
    })



    
})