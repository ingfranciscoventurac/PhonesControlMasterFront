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
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DevicesService } from '../../services/devices.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageComponent } from '../message/message.component';
import { MessageService } from '../../services/message.service';
import { ConfirmationModalComponent } from '../confirmationmodal/confirmationmodal.component';
import { UsersService } from '../../services/users.service';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-devicesettingsmodal',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatTabsModule,
    CommonModule, MessageComponent],
  templateUrl: './devicesettingsmodal.component.html',
  styleUrls: ['./devicesettingsmodal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceSettingsModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef);
  messageService = inject(MessageService);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly deviceId = this.data.deviceId;
  readonly deviceName = this.data.currentName;
  readonly ownerId = this.data.ownerId;
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  newDeviceName: string = this.deviceName ?? "";
  newOwnerId: number = this.ownerId ?? 0;
  readonly dialog = inject(MatDialog);
  constructor(
    private sanitizer: DomSanitizer,
    public usersService: UsersService

  ) { }


  ngOnInit(): void {
    this.devicesService.getListOfPlayingPlaylist(this.deviceId).then(() => {

    });
    this.devicesService.getListOfPlayingArtist(this.deviceId).then(() => {

    });
    this.usersService.getAllActiveUsers();
  }

  getSpotifyEmbedUrlPlaylist(playlist: string): SafeResourceUrl {
    const baseUrl = 'https://open.spotify.com/embed/playlist/';
    return this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl + playlist + '?utm_source=generator');
  }

  getSpotifyEmbedUrlArtist(artistId: string): SafeResourceUrl {
    const baseUrl = 'https://open.spotify.com/embed/artist/';
    return this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl + artistId + '?utm_source=generator');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNewSettings() {
    this.devicesService.changeDeviceName(this.deviceId, this.newDeviceName, this.newOwnerId).then(() => {
      this.devicesService.getDevices();
      this.messageService.showMessage('Nombre Cambiado Correctamente!', 'success');
    });
  }

  deleteArtistFromList(id: any) {

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '40vw', // or '90vw'
      maxWidth: '40vw', // to override default 80vw
      height: "250px",
      data: { message: "¿Estás seguro de que deseas borrar a este artista que está pendiente para reproducir?" },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("🚀 ~ DeviceSettingsModalComponent ~ deleteArtistFromList ~ result:", result?.canDelete)
      console.log('The dialog was closed');
      if (result?.canDelete !== undefined && result?.canDelete) {
        this.devicesService.deletePendingArtist(id).then(() => {
          this.messageService.showMessage('Artista Eliminado de la Reproducción!', 'error');
          this.devicesService.getListOfPlayingArtist(this.deviceId);
        })
      }
    });

  }

  deletePlayListFromList(id: any) {

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '40vw', // or '90vw'
      maxWidth: '40vw', // to override default 80vw
      height: "250px",
      data: { message: "¿Estás seguro de que deseas borrar a esta playlist que está pendiente para reproducir?" },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.canDelete !== undefined && result?.canDelete) {
        this.devicesService.deletePendingPlaylist(id).then(() => {
          this.messageService.showMessage('Playlist Eliminada de la Reproducción!', 'error');
          this.devicesService.getListOfPlayingPlaylist(this.deviceId);
        })
      }
    });

  }





  openPlayList(playlistId: string): void {
    if (!playlistId) return;
    window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank'); // '_blank' ensures it opens in a new tab
  }

  openArtist(artistId: string): void {
    if (!artistId) return;
    window.open(`https://open.spotify.com/artist/${artistId}`, '_blank'); // '_blank' ensures it opens in a new tab
  }
}
