import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveUsersModalComponent } from './activeusers.component';

describe('ActiveUsersModalComponent', () => {
  let component: ActiveUsersModalComponent;
  let fixture: ComponentFixture<ActiveUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveUsersModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActiveUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
