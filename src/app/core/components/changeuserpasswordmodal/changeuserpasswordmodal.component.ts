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
  selector: 'app-changeuserpasswordmodal',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './changeuserpasswordmodal.component.html',
  styleUrls: ['./changeuserpasswordmodal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeUserPasswordModalComponent {
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly devices = model(this.data.devicesList);
  devicesService = inject(DevicesService);
  usersService = inject(UsersService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';


  password: string = '';
  passwordConfirmation: string = '';

  constructor(private messageService: MessageService) {

  }
  closeModal(): void {
    this.dialogRef.close();
  }



  updateUserPassword() {
    if (this.password !== this.passwordConfirmation) {
      return;
    };
    const newPassword = {
      "id": this.data?.currentUser.id,
      "password": this.password
    }
    this.usersService.updateUserPassword(
      newPassword
    ).then(() => {
      this.messageService.showMessage("Contraseña actualizada con éxito.", "success");
      this.usersService.getUsers();
    });
  }

  cancelUser() {
    this.closeModal();
  }
}
