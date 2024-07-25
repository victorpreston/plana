import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EventService } from '../../../services/events/event.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Event } from '../../../interfaces/event';
import { Category } from '../../../interfaces/category';
import { Tag } from '../../../interfaces/tag';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketType } from '../../../interfaces/ticket';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventComponent implements OnInit {
  isAddingEvent = false;
  isLoading = false;
  isEditing = false;
  isViewing = false;
  currentStep = 1;
  eventForm: FormGroup;
  selectedEvent: Event | null = null;
  events: Event[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];
  currentPage = 1;
  itemsPerPage = 2;
  managerId: string | null = null;
  selectedTags: Tag[] = [];
  isUploading = false;
  uploadedImageUrl: string | null = null;
  showSuccess = false;
  successMessage = '';
  showError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      bannerImage: [''],
      categoryId: ['', Validators.required],
      tags: [[]],
      ticketTypes: this.fb.array([
        this.fb.group({
          type: ['', Validators.required],
          price: ['', Validators.required],
          quantity: ['', Validators.required],
        })
      ])
    });
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
    this.loadTags();
    this.authService.user$.subscribe(user => {
      if (user) {
        this.managerId = user.id;
      }
    });
  }

  loadEvents(): void {
    this.isLoading = true;
    this.authService.user$.subscribe(user => {
      if (user) {
        this.eventService.getEventsByManager(user.id).subscribe(events => {
          this.events = events;
          this.isLoading = false;
        });
      }
    });
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadTags(): void {
    this.eventService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  get ticketTypesControls() {
    return (this.eventForm.get('ticketTypes') as FormArray).controls;
  }

  addTicketType(): void {
    const control = this.fb.group({
      type: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
    });
    (this.eventForm.get('ticketTypes') as FormArray).push(control);
  }

  showAddEventForm(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isAddingEvent = true;
      this.isEditing = false;
    }, 1000);
  }

  showEditEventForm(event: Event): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.isAddingEvent = true;
      this.isEditing = true;
      this.selectedEvent = event;
      this.uploadedImageUrl = event.bannerImage || null;
      this.selectedTags = event.tags.map(tag => tag.tag);
      this.eventForm.patchValue({
        ...event,
        tags: this.selectedTags.map(tag => tag.id)
      });
    }, 1000);
  }

  showViewEventModal(event: Event): void {
    this.selectedEvent = event;
    this.isViewing = true;
  }

  closeViewEventModal(): void {
    this.isViewing = false;
    this.selectedEvent = null;
  }

  cancelAddEvent(): void {
    this.isAddingEvent = false;
    this.isEditing = false;
    this.eventForm.reset();
    this.uploadedImageUrl = null;
    (this.eventForm.get('ticketTypes') as FormArray).clear();
    this.addTicketType();
  }

  saveEvent(): void {
    const formData = {
      ...this.eventForm.value,
      date: new Date(this.eventForm.value.date).toISOString(),
      time: new Date(this.eventForm.value.date).toISOString(),
      managerId: this.managerId,
      tags: this.selectedTags.map(tag => ({ tagId: tag.id })),
      ticketTypes: this.eventForm.value.ticketTypes.map((ticketType: Partial<TicketType>) => {
        const { id, type, price, quantity } = ticketType;
        return id ? { id, type, price, quantity } : { type, price, quantity };
      }),
    };
  
    console.log('Form Data:', formData);
  
    if (this.isEditing && this.selectedEvent) {
      console.log('Updating event:', this.selectedEvent.id);
      this.eventService.updateEvent(this.selectedEvent.id, formData).subscribe({
        next: () => {
          // console.log('Event updated successfully');
          this.loadEvents();
          this.showSuccessMessage('Event updated successfully!');
        },
        error: (error) => {
          console.error('Error updating event:', error);
          // console.log('Server response:', error.error); // Log the error response from the server
          this.showErrorMessage('Failed to update event. Please try again.');
        }
      });
    } else {
      console.log('Creating new event');
      this.eventService.createEvent(formData).subscribe({
        next: () => {
          // console.log('Event created successfully');
          this.loadEvents();
          this.showSuccessMessage('Event created successfully!');
        },
        error: (error) => {
          console.error('Error creating event:', error);
          // console.log('Server response:', error.error); // Log the error response from the server
          this.showErrorMessage('Failed to create event. Please try again.');
        }
      });
    }
    this.cancelAddEvent();
  }
  
      

  deleteEvent(id: string): void {
    this.showConfirmPopup(id);
  }

  confirmDeleteEvent(id: string): void {
    this.isLoading = true;
    setTimeout(() => {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
        this.showSuccessMessage('Event deleted successfully!');
      }, (error) => {
        this.showErrorMessage('Failed to delete event.');
      });
      this.isLoading = false;
    }, 1000);
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 3000);
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadImageToCloudinary(file);
    }
  }

  uploadImageToCloudinary(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "t2gtalks");
    formData.append("cloud_name", "dtn9kzx2v");
    this.isUploading = true;
    fetch('https://api.cloudinary.com/v1_1/dtn9kzx2v/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        this.eventForm.patchValue({ bannerImage: data.secure_url });
        this.uploadedImageUrl = data.secure_url || null;
        this.isUploading = false;
        this.showSuccessMessage('Image uploaded successfully!');
      })
      .catch(() => {
        this.isUploading = false;
        this.showErrorMessage('Failed to upload image. Please try again.');
      });
  }

  paginate(events: Event[]): Event[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return events.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.events.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onTagSelect(event: any): void {
    const tagId = event.target.value;
    const selectedTag = this.tags.find(tag => tag.id === tagId);
    if (selectedTag && !this.selectedTags.includes(selectedTag)) {
      this.selectedTags.push(selectedTag);
    }
    this.eventForm.patchValue({ tags: this.selectedTags.map(tag => tag.id) });
  }

  removeTag(tag: Tag): void {
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
    this.eventForm.patchValue({ tags: this.selectedTags.map(tag => tag.id) });
  }

  showConfirmPopup(eventId: string): void {
    const confirmPopup = document.createElement('div');
    confirmPopup.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-md shadow-md relative w-full max-w-sm mx-auto">
        <h2 class="text-xl font-semibold mb-4">
        <i class="pi pi-info-circle text-red-600 fill-red-600"></i>
        Confirm Delete</h2>
        <p class="mb-4">Are you sure you want to delete this event?</p>
        <div class="flex justify-end">
        <button class="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2" id="cancelDelete">
          <i class="pi pi-times"></i> Cancel
        </button>
        <button class="bg-red-600 text-white py-2 px-4 rounded-md" id="confirmDelete">
          <i class="pi pi-trash"></i> Delete
        </button>
        </div>
      </div>
      </div>
    `;
    document.body.appendChild(confirmPopup);

    document.getElementById('cancelDelete')?.addEventListener('click', () => {
      document.body.removeChild(confirmPopup);
    });

    document.getElementById('confirmDelete')?.addEventListener('click', () => {
      this.confirmDeleteEvent(eventId);
      document.body.removeChild(confirmPopup);
    });
  }
}