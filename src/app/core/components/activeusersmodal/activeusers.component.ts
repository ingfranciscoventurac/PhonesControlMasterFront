import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DevicesService } from '../../services/devices.service';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-activeusers',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule],
  templateUrl: './activeusers.component.html',
  styleUrls: ['./activeusers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveUsersModalComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");

  readonly dialogRef = inject(MatDialogRef);
  readonly dialogData = inject<any>(MAT_DIALOG_DATA);
  readonly devices = this.dialogData.devicesList;
  readonly hasMultiDevices = this.dialogData.multi;
  userSelected: number | undefined = undefined;

  constructor(public devicesService: DevicesService, public usersService: UsersService, private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.usersService.getAllActiveUsers();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onCheckboxChange(event: any, value: number) {
    this.userSelected = value;
  }

  assignUser() {

    if (this.devices.length == 0) {
      this.messageService.showMessage("No hay dispositivos seleccionados para asignar.", "error");
      return;
    }

    if (this.userSelected == undefined) {
      this.messageService.showMessage("Debes seleccionar un usuario para asignar los dispositivos seleccionados.", "error");
      return;
    }

    this.devicesService.assignDeviceToUsers(this.devices, this.userSelected!).then(() => {
      this.closeModal();
      this.devicesService.getDevices();
    });
  }
}
