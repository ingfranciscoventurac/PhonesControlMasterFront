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
  selector: 'NewProxyModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './newProxyModal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProxyModalComponent implements OnInit {


  //DEPENDENCIES///////////////////////////////////////////////////////
  private fb = inject(UntypedFormBuilder);
  public proxiesService = inject(ProxiesService);
  readonly dialogRef = inject(MatDialogRef);
  //DEPENDENCIES///////////////////////////////////////////////////////


  //VARIABELS///////////////////////////////////////////////////////
  newProxyForm!: UntypedFormGroup;
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
    this.newProxyForm = this.fb.group({
      origin: [{ value: "", disabled: false }, Validators.required],
      ip: [{ value: "", disabled: false }, Validators.required],
      port: [{ value: "", disabled: false }, Validators.required],
      userName: [{ value: "", disabled: false }, Validators.required],
      password: [{ value: "", disabled: false }, Validators.required]
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }


  saveNewLicense() {
    if (this.newProxyForm.invalid) {
      return;
    }

    const newProxy = {
      "userId": this.userInfo.id,
      "origin": this.newProxyForm.get("origin")?.value,
      "ip": this.newProxyForm.get("ip")?.value,
      "port": this.newProxyForm.get("port")?.value,
      "userName": this.newProxyForm.get("userName")?.value,
      "password": this.newProxyForm.get("password")?.value
    }
    this.proxiesService.addNewProxy(newProxy).then(response => {
      this.messageService.showMessage("Nuevo proxy creado.", "success");
      this.closeModal();
    });
  }
}
