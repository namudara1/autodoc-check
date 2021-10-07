import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulebookComponent } from './schedulebook.component';

describe('SchedulebookComponent', () => {
  let component: SchedulebookComponent;
  let fixture: ComponentFixture<SchedulebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulebookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
