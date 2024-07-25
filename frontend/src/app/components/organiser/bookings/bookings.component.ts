import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagService } from '../../../services/tags/tag.service';
import { Tag } from '../../../interfaces/tag';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  tags: Tag[] = [];
  tagForm: FormGroup;
  isLoading: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  isEditing: boolean = false;
  currentTagId: string | null = null;

  constructor(private fb: FormBuilder, private tagService: TagService) {
    this.tagForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchTags();
  }

  fetchTags(): void {
    this.isLoading = true;
    this.tagService.getAllTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.isLoading = false;
      },
      error: () => {
        this.showAlert('Failed to fetch tags. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.tagForm.invalid) return;

    this.isLoading = true;

    if (this.isEditing && this.currentTagId) {
      this.tagService.updateTag(this.currentTagId, this.tagForm.value).subscribe({
        next: (tag) => {
          this.showAlert('Tag updated successfully!', 'success');
          this.fetchTags();
          this.resetForm();
        },
        error: () => {
          this.showAlert('Failed to update tag. Please try again.', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.tagService.createTag(this.tagForm.value).subscribe({
        next: (tag) => {
          this.showAlert('Tag created successfully!', 'success');
          this.fetchTags();
          this.resetForm();
        },
        error: () => {
          this.showAlert('Failed to create tag. Please try again.', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  editTag(tag: Tag): void {
    this.isEditing = true;
    this.currentTagId = tag.id;
    this.tagForm.patchValue(tag);
  }

  deleteTag(tagId: string): void {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    this.isLoading = true;
    this.tagService.deleteTag(tagId).subscribe({
      next: () => {
        this.showAlert('Tag deleted successfully!', 'success');
        this.fetchTags();
      },
      error: () => {
        this.showAlert('Failed to delete tag. Please try again.', 'error');
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.tagForm.reset();
    this.isEditing = false;
    this.currentTagId = null;
    this.isLoading = false;
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
}