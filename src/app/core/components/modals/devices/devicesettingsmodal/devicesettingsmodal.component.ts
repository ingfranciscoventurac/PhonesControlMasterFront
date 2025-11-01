import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DevicesService } from '../../../../services/devices.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from '../../../../services/message.service';
import { ConfirmationModalComponent } from '../../../confirmationmodal/confirmationmodal.component';
import { UsersService } from '../../../../services/users.service';
import { LicensesService } from '../../../../services/licenses.service';
import { UnassignConfirmationModalComponent } from '../../generics/unassign-confirmation-modal/unassign-confirmation-modal.component';
import { LicensesActiveListModalComponent } from '../licenses-active-list-modal/licenses-active-list-modal.component';
import { DeleteConfirmationModalComponent } from '../../generics/delete-confirmation-modal/delete-confirmation-modal.component';
import { ProxiesService } from '../../../../services/proxies.service';
import { UnassignProxyConfirmationModalComponent } from '../../generics/unassign-proxy-confirmation-modal/unassign-proxy-confirmation-modal.component';
import { ProxiesActiveListModalComponent } from '../proxies-active-list-modal/proxies-active-list-modal.component';
export interface DialogData {
  devicesList: string[];
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-devicesettingsmodal',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    CommonModule],
  templateUrl: './devicesettingsmodal.component.html',
  styleUrls: ['./devicesettingsmodal.component.scss'],
})
export class DeviceSettingsModalComponent implements OnInit {
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  private fb = inject(UntypedFormBuilder);
  private proxiesService = inject(ProxiesService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly device = this.data.id;
  readonly deviceId = this.data.deviceId;
  readonly deviceName = this.data.currentName;
  readonly ownerId = this.data.ownerId;
  devicesService = inject(DevicesService);
  newOwnerId: number = this.ownerId ?? 0;
  gotLicenseId: any = 0;
  gotProxyId: any = 0;
  readonly dialog = inject(MatDialog);
  deviceInfoForm: UntypedFormGroup = this.fb.group({
    statusName: [{ value: "", disabled: true }, Validators.required],
    typeName: [{ value: "", disabled: true }, Validators.required],
    groupName: [{ value: "", disabled: true }, Validators.required],
    email: [{ value: "", disabled: true }, Validators.required],
    password: [{ value: "", disabled: true }, Validators.required],
    emailPassword: [{ value: "", disabled: true }, Validators.required],
    expirationDate: [{ value: "", disabled: true }, Validators.required],
    family: [{ value: "", disabled: true }, Validators.required],
    deviceName: [{ value: this.deviceName, disabled: false }, Validators.required],
    ownerId: [{ value: this.ownerId, disabled: false }, Validators.required],

    origin: [{ value: "", disabled: true }, Validators.required],
    userName: [{ value: "", disabled: true }, Validators.required],
    ip: [{ value: "", disabled: true }, Validators.required],
    port: [{ value: "", disabled: true }, Validators.required],
    passwordProxy: [{ value: "", disabled: true }, Validators.required],
    statusNameProxy: [{ value: "", disabled: true }, Validators.required],
  });

  constructor(
    private sanitizer: DomSanitizer,
    public usersService: UsersService,
    private messageService: MessageService,
    public licensesService: LicensesService,

  ) { }


  ngOnInit(): void {
    this.loadInfo();
  }

  loadInfo() {
    this.devicesService.getListOfPlayingPlaylist(this.deviceId);
    this.devicesService.getListOfPlayingArtist(this.deviceId);
    this.usersService.getAllActiveUsers();
    this.licensesService.getLicenseByDeviceId(this.device).then(() => {
      this.loadLicenses();
    });
    this.proxiesService.getProxyByDeviceId(this.device).then(() => {
      this.loadProxies();
    });
  }

  loadProxies() {
    this.proxiesService.deviceProxyInfo$.subscribe(info => {
      console.log("🚀 ~ DeviceSettingsModalComponent ~ loadProxies ~ info:", info)

      if (info) {
        if (info.id) {
          this.gotProxyId = info.id;
          this.deviceInfoForm.get("origin")?.setValue(info.ip);
          this.deviceInfoForm.get("userName")?.setValue(info.userName);
          this.deviceInfoForm.get("ip")?.setValue(info.ip);
          this.deviceInfoForm.get("port")?.setValue(info.port);
          this.deviceInfoForm.get("passwordProxy")?.setValue(info.password);
          this.deviceInfoForm.get("statusNameProxy")?.setValue(info.statusName);
        } else {
          this.gotProxyId = 0;
        }

      }
    });
  }

  loadLicenses() {
    this.licensesService.deviceLicenseInfo$.subscribe(info => {

      if (info) {
        if (info.id) {
          this.gotLicenseId = info.id;
          this.deviceInfoForm.get("statusName")?.setValue(info.statusName);
          this.deviceInfoForm.get("typeName")?.setValue(info.typeName);
          this.deviceInfoForm.get("groupName")?.setValue(info.groupName);
          this.deviceInfoForm.get("email")?.setValue(info.email);

          this.deviceInfoForm.get("password")?.setValue(info.password);
          this.deviceInfoForm.get("emailPassword")?.setValue(info.emailPassword);
          this.deviceInfoForm.get("expirationDate")?.setValue(info.expirationDate);
          this.deviceInfoForm.get("family")?.setValue(info.family);
        } else {
          this.gotLicenseId = 0;
        }
      }
    });
  }

  assignDevice() {
    const payload = {
      licenseInfo: {
        "deviceId": this.device,
        "licenseId": 0,
        "userId": this.userInfo.id
      },
    };

    const dialogRef = this.dialog.open(LicensesActiveListModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: '80vh', // to override default 80vw
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadInfo();
    });
  }
  deleteDevice() {
    const payload = {
      licenseGroupInfo: {
        "deviceId": this.device,
        "deleteType": "device",
      },
    };

    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadInfo();
    });
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

    this.devicesService.changeDeviceName(this.deviceId, this.deviceInfoForm.get("deviceName")?.value, this.deviceInfoForm.get("ownerId")?.value).then(() => {
      this.devicesService.getDevices();
      this.messageService.showMessage('Nombre Cambiado Correctamente!', 'success');
    });
  }

  deleteArtistFromList(id: any) {

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '40vw', // or '90vw'
      maxWidth: '40vw', // to override default 80vw
      height: "250px",
      data: { message: "¿Estás seguro de que deseas eliminar a este artista que está pendiente para reproducir?" },
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
      data: { message: "¿Estás seguro de que deseas eliminar a esta playlist que está pendiente para reproducir?" },
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



  unAssignDevice() {

    const payload = {
      licenseInfo: {
        "deviceId": this.device,
        "licenseId": this.gotLicenseId,
        "userId": this.userInfo.id
      },
    };

    const dialogRef = this.dialog.open(UnassignConfirmationModalComponent, {
      width: '50vw', // or '90vw'
      maxWidth: '50vw', // to override default 80vw
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadInfo();
    });
  }

  unAssignProxyDevice() {
    const payload = {
      proxyInfo: {
        "deviceId": this.device,
        "proxyId": this.gotProxyId,
        "userId": this.userInfo.id
      },
    };

    const dialogRef = this.dialog.open(UnassignProxyConfirmationModalComponent, {
      width: '50vw', // or '90vw'
      maxWidth: '50vw', // to override default 80vw
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadInfo();
      this.loadProxies()
    });
  }


  assignProxyOnDevice() {

    const payload = {
      proxyInfo: {
        "deviceId": this.device,
        "proxyId": 0,
        "userId": this.userInfo.id
      },
    };

    const dialogRef = this.dialog.open(ProxiesActiveListModalComponent, {
      width: '80vw', // or '90vw'
      maxWidth: '80vw', // to override default 80vw
      height: '80vh', // to override default 80vw
      data: payload,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadInfo();
      this.loadProxies()
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
