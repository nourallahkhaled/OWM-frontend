import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User | undefined;
  profileForm: FormGroup;
  editMode: boolean = false;
  userId: string;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private snackBar: MatSnackBar,
  ) { 
    
    // Initialize profile form
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      apartmentNo: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      meterID: ['', Validators.required],
      // password: ['', Validators.required],
      // newPassword: [''],
      // confirmPassword: [''],
      address: ['', Validators.required],
      // Add more form controls as needed
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    console.log(this.userId)
    // Fetch user data when component initializes
    this.authService.getUserById(this.userId).subscribe(
      (userData: any ) => {
        this.user = userData[0];
        console.log('userdata',userData);
        // Initialize form with user data
        this.profileForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          username: this.user.username,
          email: this.user.email,
          age: this.user.age,
          gender: this.user.gender,
          apartmentNo: this.user.apartmentNo,
          phoneNumber: this.user.phoneNumber,
          meterID: this.user.meterID,
          // password: this.user.password,
          address: this.user.address,
        });
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );

  }
  editModeOn(){
    this.editMode = true;
  }

  // Method to update user data
  updateProfile() {
    if (this.profileForm.valid) {
      const updatedUserData: User = { ...this.user, ...this.profileForm.value };
      this.authService.editUser('6d3d',updatedUserData).subscribe(
        response => {
          window.location.reload()
          this.snackBar.open('Updated Successfully.', 'Close', {
            duration: 3000,
          });
          this.editMode = false;
        },
        error => {
          this.snackBar.open('Something went wrong.', 'Close', {
            duration: 3000,
          });
        }
      );
    } else {
      // Form is invalid, show validation errors
      // Optionally, you can mark the form controls as touched or dirty to trigger validation messages
    }
  }

}
