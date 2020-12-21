import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RespuestasFormPage } from './respuestas-form.page';

describe('RespuestasFormPage', () => {
  let component: RespuestasFormPage;
  let fixture: ComponentFixture<RespuestasFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestasFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RespuestasFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
