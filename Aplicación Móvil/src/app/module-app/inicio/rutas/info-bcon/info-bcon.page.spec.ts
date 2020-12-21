import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoBconPage } from './info-bcon.page';

describe('InfoBconPage', () => {
  let component: InfoBconPage;
  let fixture: ComponentFixture<InfoBconPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBconPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoBconPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
