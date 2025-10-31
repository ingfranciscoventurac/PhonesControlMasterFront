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

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'EditLicenseGroupModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './editProxyGroupModal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLicenseGroupModalComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  private licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly licenseGroupInfo = this.data.licenseGroupInfo;
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  editLicenseForm!: UntypedFormGroup;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.editLicenseForm = this.fb.group({
      id: [{ value: this.licenseGroupInfo.id, disabled: false }, Validators.required],
      typeId: [{ value: this.licenseGroupInfo.typeId, disabled: false }, Validators.required],
      name: [{ value: this.licenseGroupInfo.name, disabled: false }, Validators.required],
      purchaseDate: [{ value: this.licenseGroupInfo.purchaseDate, disabled: false }, Validators.required],
      warrantyExpirationDate: [{ value: this.licenseGroupInfo.warrantyExpirationDate, disabled: false }, Validators.required],
    });
    console.log(this.licenseGroupInfo);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  saveEditLicenseGroup() {
    if (this.editLicenseForm.invalid) {
      return;
    }
    const purchaseDate = new Date(this.editLicenseForm.get("purchaseDate")?.value); // 👈 always returns a Date
    const warrantyExpirationDate = new Date(this.editLicenseForm.get("warrantyExpirationDate")?.value); // 👈 always returns a Date
    const formattedPurchaseDate = isNaN(purchaseDate.getTime())
      ? null
      : purchaseDate.toISOString();

    const formattedWarrantyExpirationDate = isNaN(warrantyExpirationDate.getTime())
      ? null
      : warrantyExpirationDate.toISOString();

    const newLicenseGroup =
    {
      "id": this.editLicenseForm.get("id")?.value,
      "typeId": Number(this.editLicenseForm.get("typeId")?.value),
      "name": this.editLicenseForm.get("name")?.value,
      "purchaseDate": formattedPurchaseDate,
      "warrantyExpirationDate": formattedWarrantyExpirationDate
    }
    this.licenseGroupService.editNewLicenseGroup(newLicenseGroup).then((response: any) => {
      this.messageService.showMessage("Grupo de licencias editado.", "success");
      this.closeModal();
    });
  }
}
