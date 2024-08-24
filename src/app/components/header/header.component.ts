import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {

  loggedIn: boolean = false;
  isAdmin: boolean = false;
  userId: string

  constructor(
    private authService: AuthService,
    private router: Router,
    
  ) {
    if(localStorage.getItem('token')){
      this.loggedIn = true;
    }
    if(localStorage.getItem('role') == 'admin'){
      this.isAdmin = true;
    }
  }

  ngAfterViewInit() {
    // Initialize Bootstrap navbar toggler
    const navbarToggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');
    navbarToggler.addEventListener('click', function () {
      collapse.classList.toggle('show');
    });
  }

  logoutUser() {
    this.authService.logout();
    this.loggedIn = false; 
    this.isAdmin = false; 
    this.router.navigate(['/login']);
  }

}
