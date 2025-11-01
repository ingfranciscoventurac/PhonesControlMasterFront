import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../../core/components/custom-table/custom-table.component";
import { PaginationRequest } from '../../core/models/pagination.model';
import { MatDialog } from '@angular/material/dialog';
import { UnassignConfirmationModalComponent } from '../../core/components/modals/generics/unassign-confirmation-modal/unassign-confirmation-modal.component';
import { ProxiesService } from '../../core/services/proxies.service';
import { ProxiesListModalComponent } from '../../core/components/modals/proxies/proxy-list-modal/proxies-list-modal.component';
import { NewProxyModalComponent } from '../../core/components/modals/proxies/new-proxy-modal/newProxyModal.component';
import { EditProxyModalComponent } from '../../core/components/modals/proxies/edit-proxy-modal/editProxyModal.component';
import { UnassignProxyConfirmationModalComponent } from '../../core/components/modals/generics/unassign-proxy-confirmation-modal/unassign-proxy-confirmation-modal.component';

@Component({
  selector: 'app-proxies',
  imports: [FormsModule, CommonModule, CustomTableComponent],
  templateUrl: './proxies.component.html',
  styleUrls: ['./proxies.component.scss'],
})
export class ProxiesComponent implements OnInit {

  @ViewChild('customTable') customTable!: CustomTableComponent;
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
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
    userId: this.userInfo.id
  }

  columns = [
    { variableName: 'id', headerName: 'Id', dataType: 'string' },
    { variableName: 'proxyId', headerName: 'ID Proxy', dataType: 'string' },
    { variableName: 'deviceId', headerName: 'ID Dispositivo', dataType: 'string' },
    { variableName: 'name', headerName: 'Nombre', dataType: 'string' },
    { variableName: 'origin', headerName: 'Origen', dataType: 'string' },
    { variableName: 'ip', headerName: 'IP', dataType: 'string' },
    { variableName: 'port', headerName: 'Puerto', dataType: 'string' },
    { variableName: 'userName', headerName: 'Nombre De Usuario', dataType: 'string' },
    { variableName: 'password', headerName: 'Contraseña', dataType: 'string' },
    { variableName: 'createdDate', headerName: 'Fecha de Creación', dataType: 'date' },
    { variableName: 'modifiedDate', headerName: 'Fecha de Modification', dataType: 'date' },
  ];

  constructor(
    public proxiesService: ProxiesService,
  ) { }

  ngOnInit(): void {
  }


  getProxies = (pagination: PaginationRequest) => {
    this.proxiesService.getProxiesWithDevices(pagination);
  };

  sort(event: any, variableName: string) {
    let inputValue = '';
    inputValue = (event.target as HTMLInputElement).value;

    const transform = {
      first: 0,
      rows: 10,
      sortField: 'createdDate',
      sortOrder: -1,
      filters: variableName == "filters" ? inputValue : this.customPagination.filters,
      userId: this.userInfo.id
    }

    this.customPagination = transform as any;
  }

  openProxiesListModal() {
    const dialogRef = this.dialog.open(ProxiesListModalComponent, {
      width: '90vw', // or '90vw'
      maxWidth: '90vw', // to override default 80vw
      height: "90vh",
      data: { multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
    });
  }

  openNewProxiesModal() {
    const dialogRef = this.dialog.open(NewProxyModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: "600px",
      data: { multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
    });
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
      this.customTable.loadPage();
    });
  }



  openUnassignDeviceProxyModal() {

    const payload = {
      proxyInfo: {
        "deviceId": this.selectedRow?.id,
        "proxyId": this.selectedRow?.proxyId,
        "userId": this.userInfo.id
      },
    };

    const dialogRef = this.dialog.open(UnassignProxyConfirmationModalComponent, {
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
    // if (formName) {
    //   this[formName!]?.patchValue({
    //     [formVariable]: data
    //   });
    // } else {
    this.selectedRow = data;
    console.log(this.selectedRow)
    // }
  }

  clearFiltros() {
    this.customPagination = {
      first: 0,
      rows: 10,
      sortField: 'createdDate',
      sortOrder: -1,
      filters: '',
      userId: this.userInfo.id
    }
  }

}
