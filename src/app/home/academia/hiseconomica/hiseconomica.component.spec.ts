import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiseconomicaComponent } from './hiseconomica.component';

describe('HiseconomicaComponent', () => {
  let component: HiseconomicaComponent;
  let fixture: ComponentFixture<HiseconomicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiseconomicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiseconomicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
