import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopinforComponent } from './popinfor.component';

describe('PopinforComponent', () => {
  let component: PopinforComponent;
  let fixture: ComponentFixture<PopinforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopinforComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopinforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
