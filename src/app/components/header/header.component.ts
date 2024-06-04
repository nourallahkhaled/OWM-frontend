import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  loggedIn: boolean = false;
  isAdmin: boolean = false;
  userId: string

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((status) => {
      this.loggedIn = status;
      if (status) {
        this.userId = sessionStorage.getItem('userId');
        const role = sessionStorage.getItem('role');
        this.isAdmin = role === 'admin';
      }
    });
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
