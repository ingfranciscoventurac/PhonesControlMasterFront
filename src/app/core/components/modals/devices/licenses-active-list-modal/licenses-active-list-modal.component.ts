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
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'LicensesActiveListModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CustomTableComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './licenses-active-list-modal.component.html',
})
export class LicensesActiveListModalComponent implements OnInit {
  //DEPENDENCIES///////////////////////////////////////////////////////
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  readonly dialog = inject(MatDialog);
  private fb = inject(UntypedFormBuilder);
  public licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly deviceLicenseService = inject(DeviceLicenseService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  //DEPENDENCIES///////////////////////////////////////////////////////

  //VARIABELS///////////////////////////////////////////////////////
  selectedRow: any;
  readonly devices = model(this.data.devicesList);
  newLicenseForm!: UntypedFormGroup;
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
    // { variableName: 'name', headerName: 'Nombre de Dispositivo', dataType: 'string' },
    { variableName: 'typeName', headerName: 'Tipo De Cuenta', dataType: 'string' },
    { variableName: 'groupName', headerName: 'Grupo', dataType: 'string' },
    { variableName: 'email', headerName: 'Correo', dataType: 'string' },
    { variableName: 'expirationDate', headerName: 'Fecha De Expiración', dataType: 'dateWithHour' },
    { variableName: 'family', headerName: '¿Es Plan Familiar?', dataType: 'family' },
    { variableName: 'statusName', headerName: 'Status', dataType: 'status' },
    // { variableName: 'daysLeftLicenseExpiration', headerName: 'Dias Restantes', dataType: 'status' },
    // { variableName: 'daysLeftWarrantyExpiration', headerName: 'Dias De Garantía', dataType: 'status' },
  ];
  //VARIABELS///////////////////////////////////////////////////////

  constructor(private messageService: MessageService) { }

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

  getLicenses = (pagination: any) => {
    this.licensesService.getLicenseActivePagination(pagination);
  };

  rowSelected(data: any) {
    this.selectedRow = data;
    console.log(this.selectedRow)
  }


  openAssignLicense() {
    this.data.licenseInfo.licenseId = this.selectedRow.id;
    this.deviceLicenseService.assignLicense(
      this.data.licenseInfo
    ).then((response: any) => {
      this.closeModal();
    })
  }

  openEditLicenseModal() {
    const dialogRef = this.dialog.open(EditLicenseModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: "600px",
      data: { licenseInfo: this.selectedRow, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
    });
  }


  openDeleteLicenseModal() {
    const payload = {
      licenseGroupInfo: {
        ...this.selectedRow,
        deleteType: "license",
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
      "groupId": Number(this.newLicenseForm.get("groupId")?.value),
      "typeId": Number(this.newLicenseForm.get("typeId")?.value),
      "email": this.newLicenseForm.get("email")?.value,
      "password": this.newLicenseForm.get("password")?.value,
      "emailPassword": this.newLicenseForm.get("emailPassword")?.value,
      "expirationDate": formattedDate,
      "family": Number(this.newLicenseForm.get("family")?.value),
    }
    this.licensesService.addNewLicense(newLicense).then(response => {
      console.log(response);
      this.closeModal();
    });
  }


  closeModal(): void {
    this.dialogRef.close();
  }

}
