import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionStyleComponent } from './option-style.component';

describe('OptionStyleComponent', () => {
  let component: OptionStyleComponent;
  let fixture: ComponentFixture<OptionStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
