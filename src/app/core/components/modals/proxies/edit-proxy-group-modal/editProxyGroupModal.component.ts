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

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'EditLicenseGroupModal',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './editProxyGroupModal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLicenseGroupModalComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "null");
  private licensesService = inject(LicensesService);
  public licenseGroupService = inject(LicenseGroupService);
  public licenseTypeService = inject(LicenseTypeService);
  readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly licenseGroupInfo = this.data.licenseGroupInfo;
  devicesService = inject(DevicesService);
  spotifyUrl: any = '';
  spotifyUrls: any = '';
  editLicenseForm!: UntypedFormGroup;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.editLicenseForm = this.fb.group({
      id: [{ value: this.licenseGroupInfo.id, disabled: false }, Validators.required],
      typeId: [{ value: this.licenseGroupInfo.typeId, disabled: false }, Validators.required],
      name: [{ value: this.licenseGroupInfo.name, disabled: false }, Validators.required],
      purchaseDate: [{ value: this.licenseGroupInfo.purchaseDate, disabled: false }, Validators.required],
      warrantyExpirationDate: [{ value: this.licenseGroupInfo.warrantyExpirationDate, disabled: false }, Validators.required],
    });
    console.log(this.licenseGroupInfo);
  }

  closeModal(): void {
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

  saveEditLicenseGroup() {
    if (this.editLicenseForm.invalid) {
      return;
    }
    const purchaseDate = new Date(this.editLicenseForm.get("purchaseDate")?.value); // 👈 always returns a Date
    const warrantyExpirationDate = new Date(this.editLicenseForm.get("warrantyExpirationDate")?.value); // 👈 always returns a Date
    const formattedPurchaseDate = isNaN(purchaseDate.getTime())
      ? null
      : purchaseDate.toISOString();

    const formattedWarrantyExpirationDate = isNaN(warrantyExpirationDate.getTime())
      ? null
      : warrantyExpirationDate.toISOString();

    const newLicenseGroup =
    {
      "id": this.editLicenseForm.get("id")?.value,
      "typeId": Number(this.editLicenseForm.get("typeId")?.value),
      "name": this.editLicenseForm.get("name")?.value,
      "purchaseDate": formattedPurchaseDate,
      "warrantyExpirationDate": formattedWarrantyExpirationDate
    }
    this.licenseGroupService.editNewLicenseGroup(newLicenseGroup).then((response: any) => {
      console.log("🚀 ~ EditLicenseGroupModalComponent ~ saveEditLicenseGroup ~ response:", response)
      this.messageService.showMessage("Grupo de licencias editado.", "success");
      this.closeModal();
    });
  }
}
