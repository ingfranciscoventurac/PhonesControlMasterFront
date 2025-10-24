import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
@Component({
  selector: 'app-message',
  imports: [
    FormsModule, CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  messageService = inject(MessageService);
  message = this.messageService.currentMessage;

  constructor() { }
}
