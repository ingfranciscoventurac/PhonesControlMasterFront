import { ChangeDetectionStrategy, Component, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DevicesService } from '../../../../services/devices.service';
import { LicenseGroupService } from '../../../../services/licenseGroup.service';
import { LicenseTypeService } from '../../../../services/licenseType.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LicensesService } from '../../../../services/licenses.service';
import { MessageService } from '../../../../services/message.service';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'NewLicenseModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './newLicenseModal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewLicenseModalComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  private fb = inject(UntypedFormBuilder);
  private licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public messageService = inject(MessageService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly devices = model(this.data.devicesList);
  devicesService = inject(DevicesService);
  newLicenseForm!: UntypedFormGroup;
  constructor() { }

  ngOnInit(): void {
    this.newLicenseForm = this.fb.group({
      groupId: [{ value: "", disabled: false }, Validators.required],
      typeId: [{ value: "", disabled: false }, Validators.required],
      email: [{ value: "", disabled: false }, Validators.required],
      password: [{ value: "", disabled: false }, Validators.required],
      emailPassword: [{ value: "", disabled: false }, Validators.required],
      expirationDate: [{ value: "", disabled: false }, Validators.required],
      family: [{ value: "", disabled: false }, Validators.required],
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  saveNewLicense() {
    if (this.newLicenseForm.invalid) {
      return;
    }
    const formValue = this.newLicenseForm.value;
    const expirationDate = new Date(formValue.expirationDate); // 👈 always returns a Date

    const formattedDate = isNaN(expirationDate.getTime())
      ? null
      : expirationDate.toISOString();

    const newLicense = {
      "userId": this.userInfo.id,
      "groupId": Number(this.newLicenseForm.get("groupId")?.value),
      "typeId": Number(this.newLicenseForm.get("typeId")?.value),
      "email": this.newLicenseForm.get("email")?.value,
      "password": this.newLicenseForm.get("password")?.value,
      "emailPassword": this.newLicenseForm.get("emailPassword")?.value,
      "expirationDate": formattedDate,
      "family": Number(this.newLicenseForm.get("family")?.value),
    }
    this.licensesService.addNewLicense(newLicense).then(response => {
      this.messageService.showMessage("Nueva licencia creada.", "success");
      this.closeModal();
    });
  }
}
