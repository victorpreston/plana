import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent {
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
