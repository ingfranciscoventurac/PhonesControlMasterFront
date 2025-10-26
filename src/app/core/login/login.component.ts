import { Component, inject, OnInit, } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  loginForm!: UntypedFormGroup;
  loading: boolean = false;
  showPassword: boolean = false;
  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['josealbertopersonal@gmail.com', Validators.required],
      password: ['1234', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.authService.login(this.loginForm.get("email")?.value, this.loginForm.get("password")?.value).then((response) => {
      if (!response?.isSuccess || !response) {
        this.messageService.showMessage("Correo o contraseña incorrectos.", "error");
        this.loading = false;
        return;
      }
      if ("p1" in response && response.p1 == 0 || "p2" in response && response.p2 == 0) {
        this.router.navigate(['/']);
      } else {
        window.location.href =
          "https://spotify-auth-server-delta.vercel.app/api/login";
      }

    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
