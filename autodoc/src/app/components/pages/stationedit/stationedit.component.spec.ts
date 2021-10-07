import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationeditComponent } from './stationedit.component';

describe('StationeditComponent', () => {
  let component: StationeditComponent;
  let fixture: ComponentFixture<StationeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
