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
import { MessageService } from '../../services/message.service';

export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-addartistmodal',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './addartistmodal.component.html',
  styleUrls: ['./addartistmodal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddArtistModalComponent {

  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly devices = model(this.data.devicesList);
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';

  constructor(private messageService: MessageService) { }

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

}
