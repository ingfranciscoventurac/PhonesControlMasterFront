import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../../core/components/custom-table/custom-table.component";
import { PaginationRequest } from '../../core/models/pagination.model';
import { LicensesService } from '../../core/services/licenses.service';
import { LicenseGroupService } from '../../core/services/licenseGroup.service';
import { LicenseTypeService } from '../../core/services/licenseType.service';
import { NewLicenseModalComponent } from '../../core/components/modals/licenses/new-license-modal/newLicenseModal.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupListModalComponent } from '../../core/components/modals/licenses/group-list-modal/groupListModal.component';
import { EditLicenseModalComponent } from '../../core/components/modals/licenses/edit-license-modal/editLicenseModal.component';
import { DeleteConfirmationModalComponent } from '../../core/components/modals/generics/delete-confirmation-modal/delete-confirmation-modal.component';
import { LicensesListModalComponent } from '../../core/components/modals/licenses/licenses-list-modal/licenses-list-modal.component';
import { UnassignConfirmationModalComponent } from '../../core/components/modals/generics/unassign-confirmation-modal/unassign-confirmation-modal.component';
@Component({
  selector: 'app-licenses',
  imports: [FormsModule, CommonModule, CustomTableComponent],
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");

  //COMPONENTS///////////////////////////////////////////////////////
  @ViewChild('customTable') customTable!: CustomTableComponent;
  //COMPONENTS///////////////////////////////////////////////////////

  selectedDevices: string[] = [];
  devices: any = undefined;
  deviceSettingsOpened: any;
  selectedRow: any;
  readonly dialog = inject(MatDialog);
  permissions: any;
  customPagination: any = {
    first: 0,
    rows: 10,
    sortField: 'createdDate',
    sortOrder: -1,
    filters: '',
    typeId: 0,
    groupId: 0,
    family: 0,
    userId: this.userInfo.id
  }
  columns = [
    { variableName: 'id', headerName: 'Id', dataType: 'string' },
    { variableName: 'deviceId', headerName: 'Numero De Dispositivo', dataType: 'string' },
    { variableName: 'name', headerName: 'Nombre de Dispositivo', dataType: 'string' },
    { variableName: 'typeName', headerName: 'Tipo De Cuenta', dataType: 'string' },
    { variableName: 'groupName', headerName: 'Grupo', dataType: 'string' },
    { variableName: 'email', headerName: 'Correo', dataType: 'string' },
    { variableName: 'expirationDate', headerName: 'Fecha De Expiración', dataType: 'dateWithHour' },
    { variableName: 'family', headerName: '¿Es Plan Familiar?', dataType: 'family' },
    { variableName: 'statusName', headerName: 'Status', dataType: 'string' },
    { variableName: 'daysLeftLicenseExpiration', headerName: 'Dias Restantes', dataType: 'status' },
    { variableName: 'daysLeftWarrantyExpiration', headerName: 'Dias De Garantía', dataType: 'status' },
  ];

  constructor(
    public licensesService: LicensesService,
    public licenseGroupService: LicenseGroupService,
    public licenseTypeService: LicenseTypeService,

  ) { }

  ngOnInit(): void {
    this.loadData();

  }

  loadData() {
    this.licenseTypeService.getLicenseType();
    this.licenseGroupService.getLicenseGroup(this.userInfo.id);
  }

  sort(event: any, variableName: string) {
    let inputValue = '';
    inputValue = (event.target as HTMLInputElement).value;
    const transform = {
      first: 0,
      rows: 10,
      sortField: 'createdDate',
      sortOrder: -1,
      filters: variableName == "filters" ? inputValue : this.customPagination.filters,
      typeId: variableName == "typeId" ? Number(inputValue) : this.customPagination.typeId,
      groupId: variableName == "groupId" ? Number(inputValue) : this.customPagination.groupId,
      family: variableName == "family" ? Number(inputValue) : this.customPagination.family,
      userId: this.userInfo.id
    }
    this.customPagination = transform as any;
  }

  openLicenseListModal() {
    const dialogRef = this.dialog.open(LicensesListModalComponent, {
      width: '90vw', // or '90vw'
      maxWidth: '90vw', // to override default 80vw
      height: "90vh",
      data: { devicesList: null, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
    });
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

  openUnassignDeviceLicenseModal() {

    const payload = {
      licenseInfo: {
        "deviceId": this.selectedRow?.id,
        "licenseId": this.selectedRow?.licenseId,
        "userId": this.userInfo.id
      },
    };

    const dialogRef = this.dialog.open(UnassignConfirmationModalComponent, {
      width: '50vw', // or '90vw'
      maxWidth: '50vw', // to override default 80vw
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
    });
  }

  rowSelected(data: any) {
    this.selectedRow = data;
    console.log(this.selectedRow);
  }

  openGroupListModal() {
    const dialogRef = this.dialog.open(GroupListModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: "600px",
      data: { devicesList: null, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
      this.loadData();
    });
  }

  clearFiltros() {
    this.customPagination = {
      first: 0,
      rows: 10,
      sortField: 'createdDate',
      sortOrder: -1,
      filters: '',
      typeId: 0,
      groupId: 0,
      family: 0,
      userId: this.userInfo.id
    }
  }

  getLicenses = (pagination: PaginationRequest) => {
    this.licensesService.getLicenseWithDevices(pagination);
  };

}
