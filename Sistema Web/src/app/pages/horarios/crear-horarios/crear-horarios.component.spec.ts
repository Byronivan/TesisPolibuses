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
import { CrearHorariosComponent } from './crear-horarios.component';


describe('CrearHorariosComponent', () => {
    let component: CrearHorariosComponent;
    let fixture: ComponentFixture<CrearHorariosComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrearHorariosComponent],
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
        fixture = TestBed.createComponent(CrearHorariosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });
    
    it('Debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Deberia validar la hora de origen de la mañana sea requerido', () => {
        let horaOM = component.form.controls['horaOM']
        let errors = {};
        errors = horaOM.errors || {};

        horaOM.setValue("12:01");
        errors = horaOM.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Deberia validar la hora de origen de la noche sea requerido', () => {
        let horaON = component.form.controls['horaON']
        let errors = {};
        errors = horaON.errors || {};

        horaON.setValue("20:01");
        errors = horaON.errors || {};
        expect(errors['required']).toBeFalsy();
    })
    
    it('Deberia validar la hora de destino de la mañana sea requerido', () => {
        let horaDM = component.form.controls['horaDM']
        let errors = {};
        errors = horaDM.errors || {};

        horaDM.setValue("06:01");
        errors = horaDM.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Debería validar la hora de destino de la noche sea requerido', () => {
        let horaDN = component.form.controls['horaDN']
        let errors = {};
        errors = horaDN.errors || {};

        horaDN.setValue("21:01");
        errors = horaDN.errors || {};
        expect(errors['required']).toBeFalsy();
    })

    it('Debería validar que las horas de las paradas no sean null', () => {
        let paradas = component.array
        paradas.push('12:30','13:12')
        expect(paradas.length).toBeGreaterThan(0)
    })
})