import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingsModalComponent } from './devicesettingsmodal.component';

describe('DeviceSettingsModalComponent', () => {
  let component: DeviceSettingsModalComponent;
  let fixture: ComponentFixture<DeviceSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceSettingsModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeviceSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
