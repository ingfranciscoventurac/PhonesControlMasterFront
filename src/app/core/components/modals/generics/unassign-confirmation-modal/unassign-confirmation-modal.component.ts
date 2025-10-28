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
  templateUrl: './unassign-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnassignConfirmationModalComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private deviceLicenseService = inject(DeviceLicenseService);
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  public licenseGroupService = inject(LicenseGroupService);
  public licensesService = inject(LicensesService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly licenseInfo = this.data.licenseInfo;
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  unassignConfirmationForm!: UntypedFormGroup;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.unassignConfirmationForm = this.fb.group({
      deviceId: [{ value: this.licenseInfo.deviceId, disabled: false }, Validators.required],
      licenseId: [{ value: this.licenseInfo.licenseId, disabled: false }, Validators.required],
      userId: [{ value: this.licenseInfo.userId, disabled: false }, Validators.required],
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }


  removeDeviceLicense() {
    console.log(this.unassignConfirmationForm.value);
    if (this.unassignConfirmationForm.invalid) {
      return;
    }
    this.deviceLicenseService.deleteLicense(this.unassignConfirmationForm.value).then((response: any) => {
      this.messageService.showMessage("Licencia removida.", "success");
      this.closeModal();
    });

  }
}
