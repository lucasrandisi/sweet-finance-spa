import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnatecnicoComponent } from './anatecnico.component';

describe('AnatecnicoComponent', () => {
  let component: AnatecnicoComponent;
  let fixture: ComponentFixture<AnatecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnatecnicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnatecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
