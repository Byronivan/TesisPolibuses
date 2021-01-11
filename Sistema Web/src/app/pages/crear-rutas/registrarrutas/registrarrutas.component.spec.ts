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
import { RegistrarrutasComponent } from './registrarrutas.component';


describe('RegistrarrutasComponent', () => {
    let component: RegistrarrutasComponent;
    let fixture: ComponentFixture<RegistrarrutasComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistrarrutasComponent],
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
        fixture = TestBed.createComponent(RegistrarrutasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });
    
    it('Debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Debería validar que se ingrese un nombre porque es un campo requerido', () => {
        let nombre = component.form.controls['nombre']
        let errors = {};
        errors = nombre.errors || {};

        nombre.setValue("Ruta de prueba 1");
        errors = nombre.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Debería validar que se ingrese una descripcion porque es un campo requerido', () => {
        let descripcion = component.form.controls['descripcion']
        let errors = {};
        errors = descripcion.errors || {};

        descripcion.setValue("La ruta cubre la zona sur de Quito");
        errors = descripcion.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Debería validar que se elija un horario porque es un campo requerido', () => {
        let horarios = component.form.controls['horarios']
        let errors = {};
        errors = horarios.errors || {};

        horarios.setValue("Trayectoria 001");
        errors = horarios.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Debería validar que se elija un bus porque es un campo requerido', () => {
        let bus = component.form.controls['bus']
        let errors = {};
        errors = bus.errors || {};

        bus.setValue("PBJE-1123");
        errors = bus.errors || {};
        expect(errors['required']).toBeFalsy();
    })


    it('Debería validar que se elija una zona porque es un campo requerido', () => {
        let zona = component.form.controls['zona']
        let errors = {};
        errors = zona.errors || {};

        zona.setValue("SUR");
        errors = zona.errors || {};
        expect(errors['required']).toBeFalsy();
    })
})