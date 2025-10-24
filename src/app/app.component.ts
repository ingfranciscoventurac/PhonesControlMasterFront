import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { MessageComponent } from './core/components/message/message.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'spotify-playlist-generator';
}
