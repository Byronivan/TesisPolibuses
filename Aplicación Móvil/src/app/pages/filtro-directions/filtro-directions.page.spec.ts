import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltroDirectionsPage } from './filtro-directions.page';

describe('FiltroDirectionsPage', () => {
  let component: FiltroDirectionsPage;
  let fixture: ComponentFixture<FiltroDirectionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroDirectionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroDirectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
