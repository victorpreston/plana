// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../../services/auth/auth.service';
// import { RoleService } from '../../../services/roles/role.service';
// import { User, Role } from '../../../interfaces/user';
// import { RoleChangeRequest, RequestStatus } from '../../../interfaces/role';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-users',
//   templateUrl: './users.component.html',
//   styleUrls: ['./users.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule]
// })
// export class UsersComponent implements OnInit {
//   users: User[] = [];
//   roleChangeRequests: RoleChangeRequest[] = [];
//   alertMessage: string = '';
//   alertType: 'success' | 'error' = 'success';

//   constructor(private authService: AuthService, private roleService: RoleService) {}

//   ngOnInit(): void {
//     this.loadUsers();
//     this.loadRoleChangeRequests();
//   }

//   loadUsers(): void {
//     this.authService.getAllUsers().subscribe(users => {
//       this.users = users.filter(user => user.role !== Role.MANAGER);
//     });
//   }

//   loadRoleChangeRequests(): void {
//     this.roleService.getAllRoleChangeRequests().subscribe(requests => {
//       this.roleChangeRequests = requests;
//     });
//   }

//   approveRequest(request: RoleChangeRequest): void {
//     this.roleService.approveRoleChange(request.id).subscribe({
//       next: () => {
//         this.showAlert('Role change approved successfully!', 'success');
//         this.loadUsers();
//         this.loadRoleChangeRequests();
//       },
//       error: () => {
//         this.showAlert('Failed to approve role change. Please try again.', 'error');
//       }
//     });
//   }

//   rejectRequest(request: RoleChangeRequest): void {
//     this.roleService.rejectRoleChange(request.id).subscribe({
//       next: () => {
//         this.showAlert('Role change rejected successfully!', 'success');
//         this.loadUsers();
//         this.loadRoleChangeRequests();
//       },
//       error: () => {
//         this.showAlert('Failed to reject role change. Please try again.', 'error');
//       }
//     });
//   }

//   showAlert(message: string, type: 'success' | 'error'): void {
//     this.alertMessage = message;
//     this.alertType = type;
//     setTimeout(() => {
//       this.alertMessage = '';
//     }, 3000);
//   }

//   getRequestStatus(userId: string): RequestStatus | undefined {
//     const request = this.roleChangeRequests.find(req => req.userId === userId);
//     return request ? request.status : undefined;
//   }

//   getRoleChangeRequest(userId: string): RoleChangeRequest | undefined {
//     return this.roleChangeRequests.find(req => req.userId === userId);
//   }

//   hasPendingRequest(userId: string): boolean {
//     const request = this.getRoleChangeRequest(userId);
//     return request !== undefined && request.status === 'PENDING';
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { RoleService } from '../../../services/roles/role.service';
import { User, Role } from '../../../interfaces/user';
import { RoleChangeRequest, RequestStatus } from '../../../interfaces/role';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  roleChangeRequests: RoleChangeRequest[] = [];
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  paginatedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  visiblePages: number[] = [];

  constructor(private authService: AuthService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoleChangeRequests();
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users.filter(user => user.role !== Role.MANAGER);
      this.setPage(1);
    });
  }

  loadRoleChangeRequests(): void {
    this.roleService.getAllRoleChangeRequests().subscribe(requests => {
      this.roleChangeRequests = requests;
    });
  }

  approveRequest(request: RoleChangeRequest): void {
    this.roleService.approveRoleChange(request.id).subscribe({
      next: () => {
        this.showAlert('Role change approved successfully!', 'success');
        this.loadUsers();
        this.loadRoleChangeRequests();
      },
      error: () => {
        this.showAlert('Failed to approve role change. Please try again.', 'error');
      }
    });
  }

  rejectRequest(request: RoleChangeRequest): void {
    this.roleService.rejectRoleChange(request.id).subscribe({
      next: () => {
        this.showAlert('Role change rejected successfully!', 'success');
        this.loadUsers();
        this.loadRoleChangeRequests();
      },
      error: () => {
        this.showAlert('Failed to reject role change. Please try again.', 'error');
      }
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

  hasPendingRequest(userId: string): boolean {
    return this.getRequestStatus(userId) === RequestStatus.PENDING;
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.paginateUsers();
    this.updateVisiblePages();
  }

  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, startIndex + this.itemsPerPage);
  }

  updateVisiblePages(): void {
    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.visiblePages.length) {
      this.setPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }
}