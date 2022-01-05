import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarmacroeconomicasComponent } from './varmacroeconomicas.component';

describe('VarmacroeconomicasComponent', () => {
  let component: VarmacroeconomicasComponent;
  let fixture: ComponentFixture<VarmacroeconomicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarmacroeconomicasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VarmacroeconomicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
