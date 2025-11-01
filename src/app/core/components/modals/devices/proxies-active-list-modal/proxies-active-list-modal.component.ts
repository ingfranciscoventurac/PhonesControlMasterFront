import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from '../../../../services/message.service';
import { LicenseGroupService } from '../../../../services/licenseGroup.service';
import { LicenseTypeService } from '../../../../services/licenseType.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LicensesService } from '../../../../services/licenses.service';
import { CustomTableComponent } from '../../../custom-table/custom-table.component';
import { NewLicenseGroupModalComponent } from '../../licenses/new-license-group-modal/newLicenseGroupModal.component';
import { EditLicenseGroupModalComponent } from '../../licenses/edit-license-group-modal/editLicenseGroupModal.component';
import { DeleteConfirmationModalComponent } from '../../generics/delete-confirmation-modal/delete-confirmation-modal.component';
import { NewLicenseModalComponent } from '../../licenses/new-license-modal/newLicenseModal.component';
import { EditLicenseModalComponent } from '../../licenses/edit-license-modal/editLicenseModal.component';
import { DeviceLicenseService } from '../../../../services/deviceLicense.service';
import { ProxiesService } from '../../../../services/proxies.service';
import { EditProxyModalComponent } from '../../proxies/edit-proxy-modal/editProxyModal.component';
import { DeviceProxyService } from '../../../../services/deviceProxy.service';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'ProxiesActiveListModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CustomTableComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './proxies-active-list-modal.component.html',
})
export class ProxiesActiveListModalComponent implements OnInit {
  //DEPENDENCIES///////////////////////////////////////////////////////
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  readonly dialog = inject(MatDialog);
  private fb = inject(UntypedFormBuilder);
  readonly dialogRef = inject(MatDialogRef);
  readonly deviceProxyService = inject(DeviceProxyService);
  readonly proxiesService = inject(ProxiesService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  //DEPENDENCIES///////////////////////////////////////////////////////

  //VARIABELS///////////////////////////////////////////////////////
  selectedRow: any;
  readonly devices = model(this.data.devicesList);
  newProxyForm!: UntypedFormGroup;
  customPagination = {
    first: 0,
    rows: 10,
    sortField: 'id',
    sortOrder: 1,
    filters: "",
    userId: this.userInfo.id,
  };



  columns = [
    { variableName: 'id', headerName: 'Id', dataType: 'string' },
    { variableName: 'origin', headerName: 'Origen', dataType: 'string' },
    { variableName: 'ip', headerName: 'IP', dataType: 'string' },
    { variableName: 'port', headerName: 'Puerto', dataType: 'string' },
    { variableName: 'userName', headerName: 'Nombre de Usuario', dataType: 'string' },
    { variableName: 'password', headerName: 'Contraseña', dataType: 'string' },
  ];
  //VARIABELS///////////////////////////////////////////////////////

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.newProxyForm = this.fb.group({
      groupId: [{ value: "", disabled: false }, Validators.required],
      typeId: [{ value: "", disabled: false }, Validators.required],
      email: [{ value: "", disabled: false }, Validators.required],
      password: [{ value: "", disabled: false }, Validators.required],
      emailPassword: [{ value: "", disabled: false }, Validators.required],
      expirationDate: [{ value: "", disabled: false }, Validators.required],
      family: [{ value: "", disabled: false }, Validators.required],
    });
  }

  getProxies = (pagination: any) => {
    this.proxiesService.getProxiesActivePagination(pagination);
  };

  rowSelected(data: any) {
    this.selectedRow = data;
    console.log(this.selectedRow)
  }


  openAssignProxy() {
    this.data.proxyInfo.proxyId = this.selectedRow.id;
    this.deviceProxyService.assignProxy(
      this.data.proxyInfo
    ).then((response: any) => {
      this.closeModal();
    })
  }

  openEditProxyModal() {
    const dialogRef = this.dialog.open(EditProxyModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: "600px",
      data: { proxyInfo: this.selectedRow, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
    });
  }


  openDeleteProxyModal() {
    const payload = {
      licenseGroupInfo: {
        ...this.selectedRow,
        deleteType: "proxy",
        multi: true,
      },
    };
    console.log(payload);

    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
    });
  }


  saveNewProxy() {
    if (this.newProxyForm.invalid) {
      return;
    }
    const formValue = this.newProxyForm.value;
    const expirationDate = new Date(formValue.expirationDate); // 👈 always returns a Date

    const formattedDate = isNaN(expirationDate.getTime())
      ? null
      : expirationDate.toISOString();

    const newLicense = {
      "groupId": Number(this.newProxyForm.get("groupId")?.value),
      "typeId": Number(this.newProxyForm.get("typeId")?.value),
      "email": this.newProxyForm.get("email")?.value,
      "password": this.newProxyForm.get("password")?.value,
      "emailPassword": this.newProxyForm.get("emailPassword")?.value,
      "expirationDate": formattedDate,
      "family": Number(this.newProxyForm.get("family")?.value),
    }
    this.proxiesService.addNewProxy(newLicense).then(response => {
      console.log(response);
      this.closeModal();
    });
  }


  closeModal(): void {
    this.dialogRef.close();
  }

}
