import { Injectable, signal } from '@angular/core';
export interface AppMessage {
  text: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  // Signal for the current message
  currentMessage = signal<any | null>(null);

  showMessage(text: string, type: 'success' | 'error' | 'warning') {
    this.currentMessage.set({ text, type });

    // Hide after 5 seconds
    setTimeout(() => {
      this.currentMessage.set(null);
    }, 5000);
  }
}
