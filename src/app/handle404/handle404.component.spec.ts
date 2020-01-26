import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Handle404Component } from './handle404.component';

describe('Handle404Component', () => {
  let component: Handle404Component;
  let fixture: ComponentFixture<Handle404Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Handle404Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Handle404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
