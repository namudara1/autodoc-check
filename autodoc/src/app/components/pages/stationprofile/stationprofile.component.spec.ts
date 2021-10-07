import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationprofileComponent } from './stationprofile.component';

describe('StationprofileComponent', () => {
  let component: StationprofileComponent;
  let fixture: ComponentFixture<StationprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
