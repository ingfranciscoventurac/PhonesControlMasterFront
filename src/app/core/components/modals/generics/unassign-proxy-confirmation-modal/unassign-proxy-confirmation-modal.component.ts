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
import { DeviceLicenseService } from '../../../../services/deviceLicense.service';
import { DeviceProxyService } from '../../../../services/deviceProxy.service';
/**
 * @title Dialog Overview
 */
@Component({
  selector: 'UnassignConfirmationModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './unassign-proxy-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnassignProxyConfirmationModalComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private deviceProxyService = inject(DeviceProxyService);
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  public licenseGroupService = inject(LicenseGroupService);
  public licensesService = inject(LicensesService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly proxyInfo = this.data.proxyInfo;
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  unassignConfirmationForm!: UntypedFormGroup;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.unassignConfirmationForm = this.fb.group({
      deviceId: [{ value: this.proxyInfo.deviceId, disabled: false }, Validators.required],
      proxyId: [{ value: this.proxyInfo.proxyId, disabled: false }, Validators.required],
      userId: [{ value: this.proxyInfo.userId, disabled: false }, Validators.required],
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }


  removeDeviceProxy() {
    console.log(this.unassignConfirmationForm.value);
    if (this.unassignConfirmationForm.invalid) {
      return;
    }
    this.deviceProxyService.deleteProxy(this.unassignConfirmationForm.value).then((response: any) => {
      this.messageService.showMessage("Proxy removido.", "success");
      this.closeModal();
    });

  }
}
