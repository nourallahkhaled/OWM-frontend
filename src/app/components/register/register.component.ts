import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]], 
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    userName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    age: ['', Validators.required],
    gender: ['', Validators.required],
    phoneNumber: [''],
    address: [''],
    apartmentNumber: [''],
    role:['user']
  }, {
    validators: passwordMatchValidator
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  get userName() {
    return this.registerForm.controls['userName'];
  } 
  get firstName() {
    return this.registerForm.controls['firstName'];
  }
  get lastName() {
    return this.registerForm.controls['lastName'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get age() {
    return this.registerForm.controls['age'];
  }
  get address() {
    return this.registerForm.controls['address'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  submitDetails() {
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword;
    this.authService.registerUser(postData as unknown as User).subscribe(
            response => {
              this.snackBar.open('Registered Successfully.', 'Close', {
                duration: 3000,
              });
              this.router.navigate(['login']);
            },
            error => {
              if(error.status === 0){
                this.snackBar.open('Email Already Exist.', 'Close', {
                  duration: 3000,
                });
              }else{
                this.snackBar.open('Something went wrong.', 'Close', {
                  duration: 3000,
                });
              }
            }
    );
  }

}
