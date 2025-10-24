import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../core/services/users.service';
import { ConfirmationModalComponent } from '../../core/components/confirmationmodal/confirmationmodal.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserModalComponent } from '../../core/components/createusermodal/createusermodal.component';
import { ChangeUserPasswordModalComponent } from '../../core/components/changeuserpasswordmodal/changeuserpasswordmodal.component';
@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  constructor(public usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUsers();
  }


  deleteUser(id: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '40vw', // or '90vw'
      maxWidth: '40vw', // to override default 80vw
      height: "250px",
      data: { color: "danger", confirmationButton: "Borrar", canEdit: false, message: "¿Estás seguro de que deseas borrar a este usuario?" },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.canDelete !== undefined && result?.canDelete) {
        this.usersService.deleteUser(id);
      }
    });
  }

  activateUser(id: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '40vw', // or '90vw'
      maxWidth: '40vw', // to override default 80vw
      height: "250px",
      data: { color: "success", confirmationButton: "Activar", canEdit: false, message: "¿Estás seguro de que deseas activar a este usuario?" },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.canDelete !== undefined && result?.canDelete) {
        this.usersService.deleteUser(id);
      }
    });
  }

  blockUser(id: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '40vw', // or '90vw'
      maxWidth: '40vw', // to override default 80vw
      height: "250px",
      data: { color: "warning", confirmationButton: "Bloquear", canEdit: false, message: "¿Estás seguro de que deseas bloquear a este usuario?" },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.canDelete !== undefined && result?.canDelete) {
        this.usersService.deleteUser(id);
      }
    });
  }

  createUser() {
    const dialogRef = this.dialog.open(CreateUserModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { color: "neutral", confirmationButton: "Crear", canEdit: false },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.canDelete !== undefined && result?.canDelete) {

      }
    });
  }

  updateUser(currentUser: any) {
    const dialogRef = this.dialog.open(CreateUserModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { color: "neutral", confirmationButton: "Actualizar", canEdit: true, currentUser: currentUser },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.canDelete !== undefined && result?.canDelete) {

      }
    });
  }

  updateUserPassword(currentUser: any) {
    const dialogRef = this.dialog.open(ChangeUserPasswordModalComponent, {
      width: '60vw', // or '90vw'
      maxWidth: '60vw', // to override default 80vw
      height: "600px",
      data: { color: "neutral", confirmationButton: "Cambiar Contraseña", canEdit: true, currentUser: currentUser },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.canDelete !== undefined && result?.canDelete) {

      }
    });
  }
}
