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
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'NewLicenseModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './newLicenseModal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewLicenseModalComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly devices = model(this.data.devicesList);
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  newLicenseForm!: UntypedFormGroup;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.newLicenseForm = this.fb.group({
      groupId: [{ value: "", disabled: false }, Validators.required],
      typeId: [{ value: "", disabled: false }, Validators.required],
      email: [{ value: "", disabled: false }, Validators.required],
      password: [{ value: "", disabled: false }, Validators.required],
      emailPassword: [{ value: "", disabled: false }, Validators.required],
      expirationDate: [{ value: "", disabled: false }, Validators.required],
      family: [{ value: "", disabled: false }, Validators.required],
    });

    this.newLicenseForm.get('expirationDate')?.valueChanges.subscribe((value) => {
      if (value instanceof Date) {
        const isoString = value.toISOString();
        this.newLicenseForm.get('expirationDate')?.setValue(isoString, { emitEvent: false });
      }
    });

  }

  closeModal(): void {
    this.dialogRef.close();
  }

  playOnDevices() {
    if (this.data.devicesList.length == 0 || this.spotifyUrl.length == 0) {
      this.messageService.showMessage("Necesitas agregar el/los enlace(s) de artista que deseas reproducir.", "error");
      return;
    }
    this.devicesService.playArtist(this.data.devicesList, this.spotifyUrls).then(() => {
      this.messageService.showMessage("Listado de playlist agregado con éxito.", "success");
    });
    this.dialogRef.close();
  }

  onSpotifyUrlDragOver(event: DragEvent) {
    event.preventDefault(); // Allow drop
  }

  onSpotifyUrlDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const data = event.dataTransfer?.getData('text/plain') || '';
    const url = data.trim();

    const spotifyPlaylistPattern = /^https:\/\/open\.spotify\.com\/artist\/([A-Za-z0-9]+)(\?.*)?$/;
    const match = spotifyPlaylistPattern.exec(url);

    if (!match) {
      console.warn('Invalid Spotify Artist URL:', url);
      return;
    }

    const playlistId = match[1]; // Extracted playlist ID

    // Append with comma if already has content
    if (this.spotifyUrl && this.spotifyUrl.trim() !== '') {
      this.spotifyUrl = `${this.spotifyUrl.trim()}, ${playlistId}`;
      const result = this.convertToArray(this.spotifyUrl);
      this.spotifyUrls = result;
    } else {
      this.spotifyUrl = playlistId;
      const result = this.convertToArray(this.spotifyUrl);
      this.spotifyUrls = result;
    }

    console.log('Playlist IDs:', this.spotifyUrl);
  }

  convertToArray(input: string): string[] {
    return input
      .split(",")               // split by commas
      .map(item => item.trim()) // remove spaces around each item
      .filter(item => item !== ""); // remove empty strings (if any)
  }


  onSpotifyUrlPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const urls = pastedText.split(/\s+/); // split by spaces/newlines

    const spotifyPlaylistPattern = /^https:\/\/open\.spotify\.com\/artist\/([A-Za-z0-9]+)(\?.*)?$/;

    urls.forEach((url) => {
      const match = spotifyPlaylistPattern.exec(url.trim());
      if (!match) {
        console.warn('Invalid Spotify Artist URL:', url);
        return;
      }

      const playlistId = match[1]; // extracted ID

      if (this.spotifyUrl && this.spotifyUrl.trim() !== '') {
        this.spotifyUrl = `${this.spotifyUrl.trim()}, ${playlistId}`;
        const result = this.convertToArray(this.spotifyUrl);
        this.spotifyUrls = result;
      } else {

        this.spotifyUrl = playlistId;
        const result = this.convertToArray(this.spotifyUrl);
        this.spotifyUrls = result;
      }
    });

    console.log('Playlist IDs after paste:', this.spotifyUrl);
  }

  saveNewLicense() {
    if (this.newLicenseForm.invalid) {
      return;
    }
    const formValue = this.newLicenseForm.value;
    const expirationDate = new Date(formValue.expirationDate); // 👈 always returns a Date

    const formattedDate = isNaN(expirationDate.getTime())
      ? null
      : expirationDate.toISOString();

    const newLicense = {
      "groupId": Number(this.newLicenseForm.get("groupId")?.value),
      "typeId": Number(this.newLicenseForm.get("typeId")?.value),
      "email": this.newLicenseForm.get("email")?.value,
      "password": this.newLicenseForm.get("password")?.value,
      "emailPassword": this.newLicenseForm.get("emailPassword")?.value,
      "expirationDate": formattedDate,
      "family": Number(this.newLicenseForm.get("family")?.value),
    }
    this.licensesService.addNewLicense(newLicense).then(response => {
      console.log(response);
    });
  }
}
