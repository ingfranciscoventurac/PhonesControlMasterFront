import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddplaylistmodalComponent } from './addplaylistmodal.component';

describe('AddplaylistmodalComponent', () => {
  let component: AddplaylistmodalComponent;
  let fixture: ComponentFixture<AddplaylistmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddplaylistmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddplaylistmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
