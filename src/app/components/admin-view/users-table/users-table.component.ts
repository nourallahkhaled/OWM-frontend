import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent {

  users: User[] = []; 
  adminUsers: User[] = []; 
  nonAdminUsers: User[] = []; 
  metersIDs = []; 
  displayedColumns: string[] = ['username', 'email', 'address', 'age', 'gender','meterID', 'actions'];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers() {
    this.authService.getAllUsers().subscribe((data) => {
      this.users = data
      this.adminUsers = this.users.filter(user => user.role === 'admin');
      this.nonAdminUsers = this.users.filter(user => user.role !== 'admin');
      this.metersIDs = this.users.filter(user => user.meterIDs !== null);
    });
  }

  deleteUser(id: string) {
    this.authService.deleteUser(id).subscribe(() => {
      // If the deletion is successful, remove the user from the local list.
      this.users = this.users.filter((user) => user.id !== id);
      this.adminUsers = this.adminUsers.filter((user) => user.id !== id);
      this.nonAdminUsers = this.nonAdminUsers.filter((user) => user.id !== id);
    }, (error) => {
      // Handle the error, e.g., display an error message.
      console.error('Error deleting product:', error);
    });
  }

}
