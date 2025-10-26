import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { TracksService } from '../../core/services/tracks.service';
import { DevicesService } from '../../core/services/devices.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddplaylistmodalComponent } from '../../core/components/addplaylistmodal/addplaylistmodal.component';
import { AddArtistModalComponent } from '../../core/components/addartistmodal/addartistmodal.component';
import { DeviceSettingsModalComponent } from '../../core/components/modals/devices/devicesettingsmodal/devicesettingsmodal.component';
import { ActiveUsersModalComponent } from '../../core/components/activeusersmodal/activeusers.component';

@Component({
  selector: 'app-devices',
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesComponent implements OnInit {

  selectedDevices: string[] = [];
  devices: any = undefined;
  deviceSettingsOpened: any;
  permissions: any;
  constructor(private route: ActivatedRoute, private router: Router, public tracksService: TracksService, public devicesService: DevicesService) { }

  ngOnInit(): void {
    const permissions = localStorage.getItem("permissions") ?? "";
    this.permissions = JSON.parse(permissions);

    if (this.permissions.p5) {
      this.devicesService.getDevicesAdmin();
    } else {
      this.devicesService.getDevices();
    }
  }

  allSelected: boolean = false;
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  openPlaylistModal(): void {

    const dialogRef = this.dialog.open(AddplaylistmodalComponent, {
      data: { devicesList: this.selectedDevices },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }

  toggleCheckbox(index: number) {
    const checkbox = document.getElementById(`chk-${index}`) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true })); // <-- triggers Angular binding
    }
  }

  toggleUnassignedCheckbox(index: number) {
    const checkbox = document.getElementById(`chk-${index}`) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true })); // <-- triggers Angular binding
    }
  }

  openDeviceSettings(deviceId: number | string, currentName: string, ownerId: number) {
    const dialogRef = this.dialog.open(DeviceSettingsModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { deviceId: deviceId, currentName: currentName, ownerId: ownerId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }

  openNoAssignedDevices(deviceId: number | string, currentName: string) {
    const dialogRef = this.dialog.open(ActiveUsersModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { devicesList: [deviceId], multi: false },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
    });
  }

  openAssignSeveralDevices() {
    const dialogRef = this.dialog.open(ActiveUsersModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { devicesList: this.selectedDevices, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
    });
  }

  openArtistModal(): void {
    const dialogRef = this.dialog.open(AddArtistModalComponent, {
      data: { devicesList: this.selectedDevices },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }

  onCheckboxChange(event: any, value: string) {
    if (event.target.checked) {
      this.deviceSettingsOpened = value;
      this.selectedDevices.push(value);
    } else {
      // Remove value if unchecked
      this.selectedDevices = this.selectedDevices.filter(v => v !== value);
    }
    console.log(this.selectedDevices);
  }


  toggleSelectAll(): void {
    this.devicesService.devices$.subscribe(devices => {
      if (!devices || devices.length === 0) return;

      if (this.allSelected) {
        // Uncheck all
        this.selectedDevices = [];
        this.allSelected = false;
      } else {
        // Select all
        this.selectedDevices = devices.map((d: any) => d.deviceId);
        this.allSelected = true;
      }

      console.log('Current selected devices:', this.selectedDevices);
    }).unsubscribe(); // prevent memory leaks
  }


}
