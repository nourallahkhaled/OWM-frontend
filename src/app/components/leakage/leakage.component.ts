import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-leakage',
  templateUrl: './leakage.component.html',
  styleUrls: ['./leakage.component.css']
})
export class LeakageComponent {

  leakageDetectionClicked(){}
  isMotorValveOpened: boolean = false;

  constructor(public dialog: MatDialog) {}

  onToggleChange() {
    const action = this.isMotorValveOpened ? 'Opening Motor Valve...' : 'Closing Motor Valve...';
    this.openDialog(action);
  }

  motorStatusDetectionClicked() {
    this.openDialog('Checking Motor Valve Status...');
    console.log('Motor valve state changed:', this.isMotorValveOpened ? 'Opened' : 'Closed');
  }

  openDialog(action: string) {
    this.dialog.open(PopupComponent, {
      data: {
        title: 'Motor Valve Status',
        message: action
      }
    });
  }

}
