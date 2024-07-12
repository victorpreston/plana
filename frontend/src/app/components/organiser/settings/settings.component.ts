import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  isEditing: boolean = false;
  isLoading: boolean = false;

  toggleEdit() {
    this.isLoading = true;
    setTimeout(() => {
      this.isEditing = !this.isEditing;
      this.isLoading = false;
    }, 1000); // 1 second delay
  }

  cancelEdit() {
    this.isEditing = false;
  }
}
