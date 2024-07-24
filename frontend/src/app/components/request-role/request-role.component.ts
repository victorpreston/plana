import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/roles/role.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-request-role',
  standalone: true,
  templateUrl: './request-role.component.html',
  styleUrls: ['./request-role.component.css'],
  imports: [CommonModule]
})
export class RequestRoleComponent {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();

  requestStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';

  constructor(private roleService: RoleService) {}

  requestRoleChange(): void {
    if (this.user) {
      this.requestStatus = 'loading';
      setTimeout(() => {
        this.roleService.requestRoleChange(this.user!.id, 'MANAGER').subscribe({
          next: () => {
            this.requestStatus = 'success';
          },
          error: () => {
            this.requestStatus = 'error';
          }
        });
      }, 1300);
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}