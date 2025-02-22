import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import mqtt, { MqttClient } from 'mqtt';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-leakage',
  templateUrl: './leakage.component.html',
  styleUrls: ['./leakage.component.css']
})
export class LeakageComponent implements OnInit, OnDestroy {

  isMotorValveOpened: boolean = false;
  user: User | undefined;
  userId: string | null = null;
  private mqttClient: MqttClient | undefined;
  selectedMeterID: string | null = null;
  leakageMessage = ''

  constructor(public dialog: MatDialog,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
     // Fetch user data when component initializes
    this.authService.getUserData().subscribe(
      (userData: any) => {
        this.user = userData;
        this.selectedMeterID = this.user.meters[0];
        
        // Call methods that depend on selectedMeterID here
        this.leakageDetectionClicked();
      },
      error => {
        console.error('Error fetching user data:', error);
        // Handle error as needed
      }
    );
    if (this.userId) {
      this.getLeakageData();
      const storedStatus = localStorage.getItem('motorValveStatus');
      if (storedStatus !== null) {
        this.isMotorValveOpened = JSON.parse(storedStatus);
      }
    } else {
      console.error('User ID is not available.');
    }
  }

  ngOnDestroy(): void {
    this.disconnectMqtt();
  }

  onToggleChange() {
    const data: any = {
      meterId: this.selectedMeterID
    };
  
    this.dataService.ToggleMotorValve(data).subscribe(
      (response: any) => {
        console.log(response); 
  
        // Determine the valve state based on response message
        if (response.message.toLowerCase().includes('closed')) {
          this.isMotorValveOpened = false;
        } else if (response.message.toLowerCase().includes('open')) {
          this.isMotorValveOpened = true;
        }
        localStorage.setItem('motorValveStatus', JSON.stringify(this.isMotorValveOpened));
        // Show appropriate dialog
        const action = this.isMotorValveOpened ? 'Opening Motor Valve...' : 'Closing Motor Valve...';
        this.openDialog(action);
      },
      error => {
        console.error('Error toggling motor valve:', error);
      }
    );
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


getLeakageData() {
  // For WebSocket connection
  const brokerUrl = 'wss://owmmeter.com/mqtt';

  this.mqttClient = mqtt.connect(brokerUrl);

  this.mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    if (this.userId) {
      this.mqttClient.subscribe(`leakage${this.userId}`, (err) => {
        if (err) {
          console.error('Failed to subscribe to the topic:', err);
        } else {
          console.log('Subscribed to the topic:', this.userId);
        }
      });
    } else {
      console.error('User ID is not available.');
    }
  });

  this.mqttClient.on('message', (topic, message) => {
    // console.log(`Received message: ${message.toString()}`);
    this.leakageMessage = message.toString();
  });

  this.mqttClient.on('error', (err) => {
    console.error('MQTT Error:', err);
  });
}


  private disconnectMqtt() {
    if (this.mqttClient) {
      this.mqttClient.end(true, () => {
        console.log('MQTT client disconnected');
      });
    }
  }

  leakageDetectionClicked(){
    const data: any = {
      meterId: this.selectedMeterID, 
      userId: this.userId
    };
    this.dataService.detectLeakage(data).subscribe(
      response => {
        console.log(response);
      },
      error => {
      }
    );
  }
}
