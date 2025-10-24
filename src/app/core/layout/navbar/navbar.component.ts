import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  constructor(public spotifyService: SpotifyService, public authService: AuthService) { }

  permissions: any;
  userInfo: any;
  ngOnInit(): void {
    const permissions = localStorage.getItem("permissions") || "";
    this.permissions = JSON.parse(permissions);

    const userInfo = localStorage.getItem("USER") || "";
    this.userInfo = JSON.parse(userInfo);
  }

}

