import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/categories/category.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Category } from '../../../interfaces/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isLoading: boolean = false;
  isEditing: boolean = false;
  currentCategoryId: string | null = null;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {
    this.categoryForm = this.fb.group({
      name: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;
    this.isLoading = true;

    if (this.isEditing && this.currentCategoryId) {
      this.categoryService.updateCategory(this.currentCategoryId, this.categoryForm.value).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
          this.showAlert('Category updated successfully!', 'success');
        },
        error: () => {
          this.showAlert('Failed to update category. Please try again.', 'error');
        },
        complete: () => (this.isLoading = false)
      });
    } else {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
          this.showAlert('Category created successfully!', 'success');
        },
        error: () => {
          this.showAlert('Failed to create category. Please try again.', 'error');
        },
        complete: () => (this.isLoading = false)
      });
    }
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue(category);
  }

  deleteCategory(id: string): void {
    this.isLoading = true;
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.showAlert('Category deleted successfully!', 'success');
      },
      error: () => {
        this.showAlert('Failed to delete category. Please try again.', 'error');
      },
      complete: () => (this.isLoading = false)
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentCategoryId = null;
    this.categoryForm.reset();
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }
}
