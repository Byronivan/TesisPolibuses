import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmpliarMapaPage } from './ampliar-mapa.page';

describe('AmpliarMapaPage', () => {
  let component: AmpliarMapaPage;
  let fixture: ComponentFixture<AmpliarMapaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmpliarMapaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmpliarMapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
