import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
  selectDevice: boolean = false;
  addDevice: boolean = false;
  newMeterID: string = '';
  selectedMeterID: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) { 

    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      apartmentNumber: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(5)]],  
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required]]  
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      apartmentNumber: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(5)]],  
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required]]  
    });
    
    // Fetch user data when component initializes
    this.authService.getUserData().subscribe(
      (userData: any) => {
        this.user = userData;
        // Initialize form with user data
        this.profileForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          userName: this.user.userName,
          email: this.user.email,
          age: this.user.age,
          gender: this.user.gender,
          apartmentNumber: this.user.apartmentNumber,
          phoneNumber: this.user.phoneNumber,
          address: this.user.address,
        });
        this.selectMeter(this.user.meters[0])

        // this.setMeterIDs(this.user.meters);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  // get meters(): FormArray {
  //   return this.profileForm.get('meters') as FormArray;
  // }

  // setMeterIDs(meters: string[]) {
  //   const meterIDsFormArray = this.profileForm.get('meters') as FormArray;
  //   meters.forEach(meterID => {
  //     meterIDsFormArray.push(this.fb.control(meterID, Validators.required));
  //   });
  // }

  editModeOn() {
    this.editMode = true;
  }

  // Method to update user data
  updateProfile() {
      
      const updatedUserData: any = {
        userId: this.userId, 
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
        userName: this.profileForm.value.userName,
        phoneNumber: this.profileForm.value.phoneNumber,
        address: this.profileForm.value.address,
        apartmentNumber: this.profileForm.value.apartmentNumber.toString(),
        age: this.profileForm.value.age.toString(),
      };

      
      this.authService.editUser(updatedUserData).subscribe(
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
  }

  selectAddNewMeter() {
    this.selectDevice = true;
  }

  openNewMeterField(){
    this.addDevice = true;
  }

  selectMeter(meterID: string) {
    this.selectedMeterID = this.selectedMeterID === meterID ? null : meterID;
  }
  
}
