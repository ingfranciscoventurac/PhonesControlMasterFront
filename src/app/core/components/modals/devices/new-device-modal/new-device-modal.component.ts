import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DevicesService } from '../../../../services/devices.service';
import { MessageService } from '../../../../services/message.service';
import { LicenseGroupService } from '../../../../services/licenseGroup.service';
import { LicenseTypeService } from '../../../../services/licenseType.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LicensesService } from '../../../../services/licenses.service';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'NewDeviceModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './new-device-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDeviceModalComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  private fb = inject(UntypedFormBuilder);
  private licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly devices = model(this.data.devicesList);
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  newDeviceForm!: UntypedFormGroup;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.newDeviceForm = this.fb.group({
      id: [{ value: "", disabled: false }, Validators.required],
      name: [{ value: "", disabled: false }, Validators.required],
      ip: [{ value: "", disabled: false }],
      port: [{ value: "", disabled: false }],
    });



  }

  closeModal(): void {
    this.dialogRef.close();
  }



  saveNewDevice() {
    if (this.newDeviceForm.invalid) {
      return;
    }


    this.newDeviceForm = this.fb.group({
      userId: [{ value: this.userInfo.id, disabled: false }, Validators.required],
      id: [{ value: "", disabled: false }, Validators.required],
      name: [{ value: "", disabled: false }, Validators.required],
      ip: [{ value: "", disabled: false }],
      port: [{ value: "", disabled: false }],
    });


    const newDevice = {
      "userId": this.userInfo.id,
      "id": this.newDeviceForm.get("id")?.value,
      "name": this.newDeviceForm.get("name")?.value,
      "ip": this.newDeviceForm.get("email")?.value,
      "port": this.newDeviceForm.get("password")?.value,
    }
    this.devicesService.addNewDevice(newDevice).then(response => {
      console.log(response);
      this.messageService.showMessage("Dispositivo creado!.", "success");
      this.closeModal();
    });
  }
}
