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
      meterIDs: this.fb.array([], Validators.required), 
      address: ['', Validators.required],
      // Add more form controls as needed
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    console.log(this.userId)
    // Fetch user data when component initializes
    this.authService.getUserById(this.userId).subscribe(
      (userData: any) => {
        this.user = userData[0];
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
          address: this.user.address,
        });
        this.selectMeter(this.user.meterIDs[0])

        // Initialize meterIDs FormArray
        this.setMeterIDs(this.user.meterIDs);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  get meterIDs(): FormArray {
    return this.profileForm.get('meterIDs') as FormArray;
  }

  setMeterIDs(meterIDs: string[]) {
    const meterIDsFormArray = this.profileForm.get('meterIDs') as FormArray;
    meterIDs.forEach(meterID => {
      meterIDsFormArray.push(this.fb.control(meterID, Validators.required));
    });
  }

  editModeOn() {
    this.editMode = true;
  }

  // Method to update user data
  updateProfile() {
    if (this.profileForm.valid) {
      const updatedUserData: User = { ...this.user, ...this.profileForm.value };
      this.authService.editUser(this.userId, updatedUserData).subscribe(
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

  selectAddNewMeter() {
    this.selectDevice = true;
  }

  openNewMeterField(){
    this.addDevice = true;
  }

  addNewMeter() {
    // Ensure newMeterID is not empty
    if (this.newMeterID.trim() !== '') {
      // Add newMeterID to the meterIDs FormArray
      this.meterIDs.push(this.fb.control(this.newMeterID, Validators.required));
      this.updateProfile() 
      this.newMeterID = '';
    }
  }
  selectMeter(meterID: string) {
    this.selectedMeterID = this.selectedMeterID === meterID ? null : meterID;
    console.log(this.selectedMeterID)
  }
  
}
