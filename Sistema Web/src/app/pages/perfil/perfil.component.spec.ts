import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from './../../material/material.module'
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfilComponent } from './perfil.component';



describe('PerfilComponent', () => {
    let component: PerfilComponent;
    let fixture: ComponentFixture<PerfilComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PerfilComponent],
            imports: [
                MaterialModule,
                FormsModule,
                AngularFireModule.initializeApp(environment.firebase),
                RouterTestingModule.withRoutes([]),
                AngularFireStorageModule,
                BrowserAnimationsModule,
                
            ],
                
            providers: [
                AngularFirestore,
                AngularFireAuth
            ]
        })
            .compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(PerfilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it('Debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

})