import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { RoleService } from '../../../services/roles/role.service';
import { User, Role } from '../../../interfaces/user';
import { RoleChangeRequest, RequestStatus } from '../../../interfaces/role';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ManagersComponent implements OnInit {
  managers: User[] = [];
  roleChangeRequests: RoleChangeRequest[] = [];
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  paginatedManagers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  visiblePages: number[] = [];

  constructor(private authService: AuthService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadManagers();
    this.loadRoleChangeRequests();
  }

  loadManagers(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.managers = users.filter(user => user.role === Role.MANAGER);
      this.setPage(1);
    });
  }

  loadRoleChangeRequests(): void {
    this.roleService.getAllRoleChangeRequests().subscribe(requests => {
      this.roleChangeRequests = requests;
    });
  }

  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 3000);
  }

  getRequestStatus(userId: string): RequestStatus | undefined {
    const request = this.roleChangeRequests.find(req => req.userId === userId);
    return request ? request.status : undefined;
  }

  getRoleChangeRequest(userId: string): RoleChangeRequest | undefined {
    return this.roleChangeRequests.find(req => req.userId === userId);
  }

  revokeManager(manager: User): void {
    const request = this.getRoleChangeRequest(manager.id);
    if (request) {
      this.roleService.rejectRoleChange(request.id).subscribe({
        next: () => {
          this.showAlert('Role change revoked successfully!', 'success');
          this.loadManagers();
          this.loadRoleChangeRequests();
        },
        error: () => {
          this.showAlert('Failed to revoke role change. Please try again.', 'error');
        }
      });
    } else {
      const newRequest: RoleChangeRequest = {
        id: '', // Generate a new ID in the backend
        userId: manager.id,
        newRole: Role.ATTENDEE,
        status: RequestStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.roleService.requestRoleChange(manager.id, Role.ATTENDEE).subscribe({
        next: () => {
          this.showAlert('Role change request created successfully!', 'success');
          this.loadManagers();
          this.loadRoleChangeRequests();
        },
        error: () => {
          this.showAlert('Failed to create role change request. Please try again.', 'error');
        }
      });
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.paginateManagers();
    this.updateVisiblePages();
  }

  paginateManagers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedManagers = this.managers.slice(startIndex, endIndex);
  }

  updateVisiblePages(): void {
    const totalPages = Math.ceil(this.managers.length / this.itemsPerPage);
    this.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.managers.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }
}