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

export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-confirmationmodal',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './confirmationmodal.component.html',
  styleUrls: ['./confirmationmodal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent {
  dialogRef = inject(MatDialogRef<ConfirmationModalComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly title = this.data.title;
  readonly message = this.data.message;
  readonly color = this.data.color;
  readonly confirmationButton = this.data.confirmationButton;

  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';

  delete(): void {
    // Return 'false' or a custom value
    this.dialogRef.close({ canDelete: true });
  }

  cancel(): void {
    // Return 'true' or the data you want
    this.dialogRef.close({ canDelete: false });
  }


}
