import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtistModalComponent } from './addartistmodal.component';

describe('AddArtistModalComponent', () => {
  let component: AddArtistModalComponent;
  let fixture: ComponentFixture<AddArtistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArtistModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddArtistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
