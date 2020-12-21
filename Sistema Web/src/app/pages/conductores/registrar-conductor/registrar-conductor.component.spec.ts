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
import { RegistrarConductorComponent } from './registrar-conductor.component';


describe('RegistrarConductorComponent', () => {
    let component: RegistrarConductorComponent;
    let fixture: ComponentFixture<RegistrarConductorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistrarConductorComponent],
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
        fixture = TestBed.createComponent(RegistrarConductorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });
    
    it('Debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Deberia validar que el nombre no contenga numeros', () => {
        let nombre = component.form.controls['nombre']
        let errors = {};
        errors = nombre.errors || {};

        nombre.setValue("Lizbeth");
        errors = nombre.errors || {};
        expect(errors['pattern']).toBeFalsy();
        expect(errors['required']).toBeFalsy();
    })

    it('Deberia validar que el apellido no contenga numeros y es requerido', () => {
        let apellido = component.form.controls['apellido']
        let errors = {};
        errors = apellido.errors || {};

        apellido.setValue("Borja");
        errors = apellido.errors || {};
        expect(errors['pattern']).toBeFalsy();
        expect(errors['required']).toBeFalsy();
    })

    it('Deberia validar que la cedula no contenga letras', () => {
        let cedula = component.form.controls['cedula']
        let errors = {};
        errors = cedula.errors || {};

        cedula.setValue("123456789");
        errors = cedula.errors || {};
        expect(errors['pattern']).toBeFalsy();
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
        expect(errors['maxlength']).toBeFalsy();
    })

    it('Debería validar que el email es requerido y válido', () => {
        let email = component.form.controls['email']
        let errors = {};
        errors = email.errors || {};

        email.setValue("pruebaConductor@epn.edu.ec");
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['email']).toBeFalsy();
    })

    it('Debería validar que el celular no contenga letras y sea válido', () => {
        let celular = component.form.controls['celular']
        let errors = {};
        errors = celular.errors || {};

        celular.setValue("0923456789");
        errors = celular.errors || {};
        expect(errors['pattern']).toBeFalsy();
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeFalsy();
        expect(errors['maxlength']).toBeFalsy();
    })


})