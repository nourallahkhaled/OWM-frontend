import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword:any;
  confirmPassword:any;
  resetPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },{
      validators: passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Extract the token directly from the URL
    this.token = this.route.snapshot.paramMap.get('token'); // 'token' is the parameter from the URL
    console.log('Token from URL:', this.token);
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
    
      const payload = {
        token: this.token,
        newPassword: this.newPassword
      };

      this.authService.resetPassword(payload).subscribe(
        (response) => {
          this.successMessage = 'Your password has been successfully reset!';
          this.errorMessage = ''; // Clear any previous error messages
          setTimeout(() => this.router.navigate(['/login']), 3000); // Redirect to login after 3 seconds
        },
        (error) => {
          this.errorMessage = 'Failed to reset password. Please try again.';
          this.successMessage = ''; // Clear previous success messages
          console.error('Error resetting password:', error);
        }
      );
    }
  }
}
