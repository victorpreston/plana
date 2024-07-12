import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventComponent {
  isAddingEvent = false;
  isLoading = false;
  isEditing = false;
  isViewing = false;
  isLoadingView = false;
  currentStep = 1;
  eventForm: FormGroup;
  selectedEvent: any = null;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: [''],
      location: [''],
      date: [''],
      vipPrice: [''],
      regularPrice: [''],
      numberOfTickets: [''],
      description: [''],
      image: [null]
    });
  }

  nextStep() {
    this.currentStep++;
  }

  previousStep() {
    this.currentStep--;
  }

  showAddEventForm() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isAddingEvent = true;
      this.isEditing = false;
    }, 1000); // Adjust the timeout as needed
  }

  showEditEventForm(event: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isAddingEvent = true;
      this.isEditing = true;
      // Fill the form with event details for editing
      this.eventForm.patchValue(event);
    }, 1000); // Adjust the timeout as needed
  }

  showViewEventModal(event: any) {
    this.selectedEvent = event;
    this.isViewing = true;
  }

  closeViewEventModal() {
    this.isViewing = false;
    this.selectedEvent = null;
  }

  cancelAddEvent() {
    this.isAddingEvent = false;
    this.isEditing = false;
    this.currentStep = 1;
    this.eventForm.reset();
  }

  finish() {
    console.log(this.eventForm.value);
    this.cancelAddEvent();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.eventForm.patchValue({
        image: file
      });
    }
  }
}