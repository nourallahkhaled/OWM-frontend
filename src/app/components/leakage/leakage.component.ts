import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import mqtt, { MqttClient } from 'mqtt';

@Component({
  selector: 'app-leakage',
  templateUrl: './leakage.component.html',
  styleUrls: ['./leakage.component.css']
})
export class LeakageComponent implements OnInit, OnDestroy {

  isMotorValveOpened: boolean = false;
  userId: string | null = null;
  private mqttClient: MqttClient | undefined;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.getLeakageData();
    } else {
      console.error('User ID is not available.');
    }
  }

  ngOnDestroy(): void {
    this.disconnectMqtt();
  }

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


getLeakageData() {
  // For TCP connection
  // const brokerUrl = 'mqtt://owmmeter.com:1883';

  // For WebSocket connection (example URL)
  const brokerUrl = 'ws://owmmeter.com:8083/mqtt';

  this.mqttClient = mqtt.connect(brokerUrl);

  this.mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    if (this.userId) {
      this.mqttClient.subscribe(this.userId, (err) => {
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
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
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
}
