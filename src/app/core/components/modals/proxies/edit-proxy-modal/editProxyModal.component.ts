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
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'EditProxyModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './editProxyModal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProxyModalComponent implements OnInit {

  //DEPENDENCIES///////////////////////////////////////////////////////
  private fb = inject(UntypedFormBuilder);
  public proxiesService = inject(ProxiesService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly proxyInfo = this.data.proxyInfo;
  //DEPENDENCIES///////////////////////////////////////////////////////


  //VARIABELS///////////////////////////////////////////////////////
  editProxyForm!: UntypedFormGroup;
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
  //VARIABELS///////////////////////////////////////////////////////

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.editProxyForm = this.fb.group({
      id: [{ value: this.proxyInfo.id, disabled: false }, Validators.required],
      origin: [{ value: this.proxyInfo.origin, disabled: false }, Validators.required],
      ip: [{ value: this.proxyInfo.ip, disabled: false }, Validators.required],
      port: [{ value: this.proxyInfo.port, disabled: false }, Validators.required],
      userName: [{ value: this.proxyInfo.userName, disabled: false }, Validators.required],
      password: [{ value: this.proxyInfo.password, disabled: false }, Validators.required]
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }


  saveNewLicense() {
    if (this.editProxyForm.invalid) {
      return;
    }

    const newProxy = {
      "userId": this.userInfo.id,
      "origin": this.editProxyForm.get("origin")?.value,
      "id": this.editProxyForm.get("id")?.value,
      "ip": this.editProxyForm.get("ip")?.value,
      "port": this.editProxyForm.get("port")?.value,
      "userName": this.editProxyForm.get("userName")?.value,
      "password": this.editProxyForm.get("password")?.value
    }
    console.log("🚀 ~ EditProxyModalComponent ~ saveNewLicense ~ newProxy:", newProxy)
    this.proxiesService.editNewProxy(newProxy).then(response => {
      this.messageService.showMessage("Proxy modificado.", "success");
      this.closeModal();
    });
  }
}
