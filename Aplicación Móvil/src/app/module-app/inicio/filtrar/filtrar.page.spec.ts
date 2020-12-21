import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltrarPage } from './filtrar.page';

describe('FiltrarPage', () => {
  let component: FiltrarPage;
  let fixture: ComponentFixture<FiltrarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
