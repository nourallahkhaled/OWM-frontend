import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css']
})
export class EditUserFormComponent {
  adminForm: FormGroup;
  addMeterForm: FormGroup;
  adminId: string;
  isEditing: boolean;
  openAddMeterForm:boolean =false;

  constructor(
    private fb: FormBuilder, 
    private userService: AuthService, 
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.adminId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.adminId;


    this.adminForm = this.fb.group({
      userId: ['',Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      address: ['', Validators.required],
      apartmentNumber: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role:['admin']
    });
    this.addMeterForm = this.fb.group({
      macAddress: ['',Validators.required],
    });

    if (this.isEditing) {
      this.initializeFormForEdit();
    }
  }

  initializeFormForEdit() {
    // Fetch product details by ID and set the form values
    this.userService.getUserDataById(this.adminId).subscribe((admin) => {
      if (admin) {
        const adminData = admin.user; 
        console.log('adminData', adminData)
        this.adminForm.setValue({
          userId: adminData._id,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          userName: adminData.userName,
          email: adminData.email,
          password: adminData.password,
          address: adminData.address,
          apartmentNumber: adminData.apartmentNumber,
          age: adminData.age,
          gender: adminData.gender,
          phoneNumber: adminData.phoneNumber,
          role: adminData.role
        });
      }
    });
  }
  

  submitAdmin() {
    const formData = this.adminForm.value;
    console.log(formData);

    if (this.isEditing) {
      // Handle editing logic here
      this.userService.editUserDataById(formData).subscribe(() => {
        this.router.navigate(['/users']); 
      });
  }
    else{
      this.userService.addAdmin(formData).subscribe(() => {
        this.router.navigate(['/users']); 
      });
    }
  }
  submitMeter() {
    const formData = this.addMeterForm.value;
    const meterData = {
      userId : this.adminId,
      mac: formData.macAddress
    }
    this.userService.addMeterbyAdmin(meterData).subscribe(() => {
      this.router.navigate(['/users']); 
    });
  }

}
