import { Component, inject, model, OnInit, ViewChild } from '@angular/core';
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
import { LicenseGroupService } from '../../../../services/licenseGroup.service';
import { LicenseTypeService } from '../../../../services/licenseType.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LicensesService } from '../../../../services/licenses.service';
import { CustomTableComponent } from '../../../custom-table/custom-table.component';
import { DeleteConfirmationModalComponent } from '../../generics/delete-confirmation-modal/delete-confirmation-modal.component';
import { NewLicenseModalComponent } from '../new-license-modal/newLicenseModal.component';
import { EditLicenseModalComponent } from '../edit-license-modal/editLicenseModal.component';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'LicensesListModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CustomTableComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './licenses-list-modal.component.html',
})
export class LicensesListModalComponent implements OnInit {

  //COMPONENTS///////////////////////////////////////////////////////
  @ViewChild('customTable') customTable!: CustomTableComponent;
  //COMPONENTS///////////////////////////////////////////////////////


  //DEPENDENCIES///////////////////////////////////////////////////////
  readonly dialog = inject(MatDialog);
  private fb = inject(UntypedFormBuilder);
  public licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  //DEPENDENCIES///////////////////////////////////////////////////////

  //VARIABELS///////////////////////////////////////////////////////
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  selectedRow: any;
  readonly devices = model(this.data.devicesList);
  newLicenseForm!: UntypedFormGroup;

  columns = [
    { variableName: 'id', headerName: 'Id', dataType: 'string' },
    // { variableName: 'name', headerName: 'Nombre de Dispositivo', dataType: 'string' },
    { variableName: 'typeName', headerName: 'Tipo De Cuenta', dataType: 'string' },
    { variableName: 'groupName', headerName: 'Grupo', dataType: 'string' },
    { variableName: 'email', headerName: 'Correo', dataType: 'string' },
    { variableName: 'expirationDate', headerName: 'Fecha De Expiración', dataType: 'dateWithHour' },
    { variableName: 'family', headerName: 'Familia', dataType: 'string' },
    { variableName: 'statusName', headerName: 'Status', dataType: 'status' },
    // { variableName: 'daysLeftLicenseExpiration', headerName: 'Dias Restantes', dataType: 'status' },
    // { variableName: 'daysLeftWarrantyExpiration', headerName: 'Dias De Garantía', dataType: 'status' },
  ];
  //VARIABELS///////////////////////////////////////////////////////

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

  getLicenses = (pagination: any) => {
    this.licensesService.getLicensePagination(pagination);
  };

  rowSelected(data: any) {
    this.selectedRow = data;
    console.log(this.selectedRow)
  }


  openNewLicenseModal() {
    const dialogRef = this.dialog.open(NewLicenseModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: "600px",
      data: { devicesList: null, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
    });
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
      this.customTable.loadPage();
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
      this.customTable.loadPage();
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
