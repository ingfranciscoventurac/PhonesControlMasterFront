import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal, ViewChild } from '@angular/core';
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
import { CustomTableComponent } from '../../../custom-table/custom-table.component';
import { NewLicenseGroupModalComponent } from '../new-license-group-modal/newLicenseGroupModal.component';
import { EditLicenseGroupModalComponent } from '../edit-license-group-modal/editLicenseGroupModal.component';
import { DeleteConfirmationModalComponent } from '../../generics/delete-confirmation-modal/delete-confirmation-modal.component';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'GroupListModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CustomTableComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './groupListModal.component.html',
})
export class GroupListModalComponent implements OnInit {
  //COMPONENTS///////////////////////////////////////////////////////
  @ViewChild('customTable') customTable!: CustomTableComponent;
  //COMPONENTS///////////////////////////////////////////////////////
  readonly dialog = inject(MatDialog);
  private fb = inject(UntypedFormBuilder);
  selectedRow: any;
  private licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly devices = model(this.data.devicesList);
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  newLicenseForm!: UntypedFormGroup;

  columns = [
    { variableName: 'id', headerName: 'Id', dataType: 'string' },
    { variableName: 'name', headerName: 'Nombre', dataType: 'string' },
    { variableName: 'typeName', headerName: 'Tipo', dataType: 'string' },
    { variableName: 'statusName', headerName: 'Estatus', dataType: 'status' },
    { variableName: 'purchaseDate', headerName: 'Fecha de Compra', dataType: 'date' },
    { variableName: 'warrantyExpirationDate', headerName: 'Expiración de Garantía', dataType: 'date' },
  ];




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

  rowSelected(data: any) {
    this.selectedRow = data;
    console.log(this.selectedRow)
  }

  getLicenseGroupPagination = (pagination: any) => {
    this.licenseGroupService.getLicenseGroupPagination(pagination);

  };

  closeModal(): void {
    this.dialogRef.close();
  }

  openNewLicenseGroupModal() {
    const dialogRef = this.dialog.open(NewLicenseGroupModalComponent, {
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

  openEditLicenseGroupModal(data: any) {
    const dialogRef = this.dialog.open(EditLicenseGroupModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: "600px",
      data: { licenseGroupInfo: data, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
    });
  }

  openDeleteLicenseGroupModal(data: any) {
    const payload = {
      licenseGroupInfo: {
        ...data,
        deleteType: "licenseGroup",
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
}
