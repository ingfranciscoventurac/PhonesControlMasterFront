import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../../core/components/custom-table/custom-table.component";
import { PaginationRequest } from '../../core/models/pagination.model';
import { LicensesService } from '../../core/services/licenses.service';
import { LicenseGroupService } from '../../core/services/licenseGroup.service';
import { LicenseTypeService } from '../../core/services/licenseType.service';
import { NewLicenseModalComponent } from '../../core/components/modals/licenses/new-license-modal/newLicenseModal.component';
import { NewLicenseGroupModalComponent } from '../../core/components/modals/licenses/new-license-group-modal/newLicenseGroupModal.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupListModalComponent } from '../../core/components/modals/licenses/group-list-modal/groupListModal.component';
@Component({
  selector: 'app-licenses',
  imports: [FormsModule, CommonModule, CustomTableComponent],
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  selectedDevices: string[] = [];
  devices: any = undefined;
  deviceSettingsOpened: any;
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
    { variableName: 'name', headerName: 'Nombre de Dispositivo', dataType: 'string' },
    { variableName: 'typeName', headerName: 'Tipo De Cuenta', dataType: 'string' },
    { variableName: 'groupName', headerName: 'Grupo', dataType: 'string' },
    { variableName: 'email', headerName: 'Correo', dataType: 'string' },
    { variableName: 'expirationDate', headerName: 'Fecha De Expiración', dataType: 'dateWithHour' },
    { variableName: 'family', headerName: 'Familia', dataType: 'string' },
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
    this.licenseTypeService.getLicenseType();
    this.licenseGroupService.getLicenseGroup();
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

  openNewLicenseModal() {
    const dialogRef = this.dialog.open(NewLicenseModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { devicesList: null, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
    });
  }

  openNewLicenseGroupModal() {
    const dialogRef = this.dialog.open(NewLicenseGroupModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { devicesList: null, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
    });
  }

  openGroupListModal() {
    const dialogRef = this.dialog.open(GroupListModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { devicesList: null, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

      }
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
