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
import { ProxiesService } from '../../../../services/proxies.service';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'DeleteConfirmationModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './delete-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationModalComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  public licenseGroupService = inject(LicenseGroupService);
  public licensesService = inject(LicensesService);
  public licenseTypeService = inject(LicenseTypeService);
  public proxiesService = inject(ProxiesService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly licenseGroupInfo = this.data.licenseGroupInfo;
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    console.log(this.licenseGroupInfo.deviceId);
  }

  closeModal(): void {
    this.dialogRef.close();
  }


  confirmDeleteLicenseGroup() {

    if (!this.licenseGroupInfo?.deleteType) { return };
    switch (this.licenseGroupInfo.deleteType) {

      case "licenseGroup":
        this.licenseGroupService.deleteNewLicenseGroup(this.licenseGroupInfo.id).then((response: any) => {
          this.messageService.showMessage("Grupo de licencias eliminado.", "success");
          this.closeModal();
        });
        return;
      case "license":
        this.licensesService.deleteLicense(this.licenseGroupInfo.id).then((response: any) => {
          this.messageService.showMessage("Grupo de licencias eliminado.", "success");
          this.closeModal();
        });
        return;
      case "device":
        this.devicesService.deleteDevice(this.licenseGroupInfo.deviceId).then((response: any) => {
          this.messageService.showMessage("Dispositivo eliminado.", "success");
          this.closeModal();
        });
        return;
      case "proxy":
        this.proxiesService.deleteProxy(this.licenseGroupInfo.id).then((response: any) => {
          this.messageService.showMessage("Proxy eliminado.", "success");
          this.closeModal();
        });
        return;
    }

  }
}
