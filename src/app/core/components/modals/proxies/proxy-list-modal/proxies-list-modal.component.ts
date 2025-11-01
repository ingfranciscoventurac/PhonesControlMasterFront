import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CustomTableComponent } from '../../../custom-table/custom-table.component';
import { DeleteConfirmationModalComponent } from '../../generics/delete-confirmation-modal/delete-confirmation-modal.component';
import { NewProxyModalComponent } from '../new-proxy-modal/newProxyModal.component';
import { EditProxyModalComponent } from '../edit-proxy-modal/editProxyModal.component';
import { ProxiesService } from '../../../../services/proxies.service';

@Component({
  selector: 'ProxiesListModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, MatButtonModule,
    FormsModule,
    CustomTableComponent],
  templateUrl: './proxies-list-modal.component.html',
})
export class ProxiesListModalComponent {

  //COMPONENTS///////////////////////////////////////////////////////
  @ViewChild('customTable') customTable!: CustomTableComponent;
  //COMPONENTS///////////////////////////////////////////////////////


  //DEPENDENCIES///////////////////////////////////////////////////////
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef);
  public proxiesService = inject(ProxiesService);
  //DEPENDENCIES///////////////////////////////////////////////////////


  //VARIABELS///////////////////////////////////////////////////////
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  selectedRow: any;
  columns = [
    { variableName: 'id', headerName: 'Id', dataType: 'string' },
    { variableName: 'statusName', headerName: 'Status', dataType: 'string' },
    { variableName: 'origin', headerName: 'Origen', dataType: 'string' },
    { variableName: 'ip', headerName: 'IP', dataType: 'string' },
    { variableName: 'port', headerName: 'Puerto', dataType: 'string' },
    { variableName: 'userName', headerName: 'Nombre De Usuario', dataType: 'string' },
    { variableName: 'password', headerName: 'Contraseña', dataType: 'string' },
    { variableName: 'createdDate', headerName: 'Fecha de Creación', dataType: 'date' },
    { variableName: 'modifiedDate', headerName: 'Fecha de Modification', dataType: 'date' },
  ];
  customPagination: any = {
    first: 0,
    rows: 10,
    sortField: 'createdDate',
    sortOrder: -1,
    filters: '',
    userId: this.userInfo.id
  }
  //VARIABELS///////////////////////////////////////////////////////

  constructor() { }


  getProxies = (pagination: any) => {
    this.proxiesService.getProxyPagination(pagination);
  };

  rowSelected(data: any) {
    this.selectedRow = data;
    console.log(this.selectedRow)
  }


  openNewProxyModal() {
    const dialogRef = this.dialog.open(NewProxyModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
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
      data: { proxyInfo: this.selectedRow, multi: true },

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.customTable.loadPage();
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
      this.customTable.loadPage();
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
