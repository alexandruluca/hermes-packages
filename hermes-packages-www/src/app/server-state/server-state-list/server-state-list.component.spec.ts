import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerStateListComponent } from './server-state-list.component';

describe('ServerStateListComponent', () => {
  let component: ServerStateListComponent;
  let fixture: ComponentFixture<ServerStateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerStateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerStateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
