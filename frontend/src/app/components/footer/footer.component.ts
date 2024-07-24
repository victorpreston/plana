import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isModalOpen: boolean = false;
  contactForm: FormGroup;
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      subject: ['general', Validators.required]
    });
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    this.message = '';
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.message = 'Please fill in all required fields correctly.';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.message = 'Message sent successfully!';
      this.messageType = 'success';
      setTimeout(() => {
        this.toggleModal();
      }, 1000);
    }, 1000);
  }

  closeMessage(): void {
    this.message = '';
  }
}