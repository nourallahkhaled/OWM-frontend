import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() { return this.loginForm.controls['password']; }

  loginUser() {
    const postData = { ...this.loginForm.value };
    console.log(this.loginForm.value);
    this.authService.loginUser(postData).subscribe(
      response => {
        console.log(response)
        this.authService.handleLoginResponse(response);
        this.router.navigate(['landing']);
      },
      error => {
        this.snackBar.open('Something went wrong.', 'Close', {
          duration: 3000,
        });
      })
  }

}
