import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../../core/components/custom-table/custom-table.component";
import { PaginationRequest } from '../../core/models/pagination.model';
import { LicensesService } from '../../core/services/licenses.service';
@Component({
  selector: 'app-licenses',
  imports: [FormsModule, CommonModule, CustomTableComponent],
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent implements OnInit {

  selectedDevices: string[] = [];
  devices: any = undefined;
  deviceSettingsOpened: any;
  permissions: any;

  columns = [
    { variableName: 'id', headerName: 'Id', dataType: 'string' },
    { variableName: 'typeName', headerName: 'Tipo De Cuenta', dataType: 'string' },
    { variableName: 'groupName', headerName: 'Grupo', dataType: 'string' },
    { variableName: 'deviceId', headerName: '# Dispositivo', dataType: 'string' },
    { variableName: 'deviceName', headerName: 'Nombre de Dispositivo', dataType: 'string' },
    { variableName: 'daysLeftLicenseExpiration', headerName: 'Dias Restantes', dataType: 'status' },
    { variableName: 'daysLeftWarrantyExpiration', headerName: 'Dias De Garantía', dataType: 'status' },
  ];

  constructor(public licensesService: LicensesService) { }

  ngOnInit(): void {
  }

  getLicenses = (pagination: PaginationRequest) => {
    this.licensesService.getLicenseWithDevices(pagination);
  };

}
