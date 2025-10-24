import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
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
import { MessageService } from '../../services/message.service';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-createusermodal',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './createusermodal.component.html',
  styleUrls: ['./createusermodal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserModalComponent {
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly devices = model(this.data.devicesList);
  devicesService = inject(DevicesService);
  usersService = inject(UsersService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';

  name: string = this.data?.currentUser?.nombre ?? '';
  lastName: string = this.data?.currentUser?.apellidos ?? '';
  email: string = '';
  password: string = '';

  showPlaylistCreator: boolean = this.data?.currentUser?.p1 == 0 ? false : true;
  showTrackList: boolean = this.data?.currentUser?.p2 == 0 ? false : true;
  showDevices: boolean = this.data?.currentUser?.p3 == 0 ? false : true;
  showUsers: boolean = this.data?.currentUser?.p4 == 0 ? false : true;

  constructor(private messageService: MessageService) {

  }
  closeModal(): void {
    this.dialogRef.close();
    console.log(this.data?.currentUser);
  }

  saveUser() {
    if (!this.name || !this.email || !this.password || !this.lastName || !this.showPlaylistCreator || !this.showTrackList || !this.showDevices || !this.showUsers) {
      return;
    };
    const newUser = {
      "email": this.email,
      "nombre": this.name,
      "apellidos": this.lastName,
      "password": this.password,
      "p1": this.showPlaylistCreator ? 1 : 0,
      "p2": this.showTrackList ? 1 : 0,
      "p3": this.showDevices ? 1 : 0,
      "p4": this.showUsers ? 1 : 0,
      "p5": 0,
      "p6": 0,
      "p7": 0,
      "p8": 0,
      "p9": 0,
      "p10": 0,
    }
    this.usersService.createUser(
      newUser
    ).then(() => {
      this.messageService.showMessage("Usuario creado con éxito.", "success");
      this.usersService.getUsers();
    });
  }

  updateUser() {
    if (!this.name || !this.lastName) {
      return;
    };
    const newUser = {
      "id": this.data?.currentUser?.id,
      "nombre": this.name,
      "apellidos": this.lastName,
      "p1": this.showPlaylistCreator ? 1 : 0,
      "p2": this.showTrackList ? 1 : 0,
      "p3": this.showDevices ? 1 : 0,
      "p4": this.showUsers ? 1 : 0,
      "p5": 0,
      "p6": 0,
      "p7": 0,
      "p8": 0,
      "p9": 0,
      "p10": 0,
    }
    this.usersService.updateUser(
      newUser
    ).then(() => {
      this.messageService.showMessage("Usuario actualizado con éxito.", "success");
      this.usersService.getUsers();
    });
  }

  cancelUser() {
    this.closeModal();
  }
}
