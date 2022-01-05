import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbceconomiaComponent } from './abceconomia.component';

describe('AbceconomiaComponent', () => {
  let component: AbceconomiaComponent;
  let fixture: ComponentFixture<AbceconomiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbceconomiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbceconomiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
