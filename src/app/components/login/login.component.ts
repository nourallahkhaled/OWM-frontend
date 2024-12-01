import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginEmail: string = '';
  forgotEmail: string = '';
  showForgotPassword: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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
    this.authService.loginUser(postData).subscribe(
      response => {
        this.authService.handleLoginResponse(response);
        this.router.navigate(['']);      
      },
      error => {
        this.snackBar.open('Email or password is incorrect.', 'Close', {
          duration: 3000,
        });
      })
  }
  onForgotPasswordSubmit() {
    const payload = { email: this.forgotEmail };

    this.authService.sendResetLink(payload).subscribe(
      (response) => {
        this.successMessage = 'Password reset link has been sent to your email.';
        this.errorMessage = ''; // Clear previous errors
      },
      (error) => {
        this.errorMessage = 'Failed to send password reset link. Please try again.';
        this.successMessage = ''; // Clear previous success messages
        console.error('Error:', error);
      }
    );
  }

  // Toggle between login and forgot password forms
  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
    this.successMessage = '';
    this.errorMessage = '';
  }

}
