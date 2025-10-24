import { Component, } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  loading: boolean = false;
  showPassword: boolean = false;
  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

  login() {
    this.loading = true;
    this.authService.login(this.email, this.password).then((response) => {
      console.log("🚀 ~ LoginComponent ~ login ~ response:", response)
      if (!response?.isSuccess || !response) {
        this.messageService.showMessage("Correo o contraseña incorrectos.", "error");
        this.loading = false;
        return;
      }
      if ("p1" in response && response.p1 == 0 || "p2" in response && response.p2 == 0) {
        this.router.navigate(['/']);
      } else {
        window.location.href =
          "https://spg-testing.vercel.app/api/login";
      }

    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
