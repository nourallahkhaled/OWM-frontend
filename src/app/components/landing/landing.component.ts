import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  teamMembers = [
    { name: 'Noor El-Deen Magdy', role: 'CEO', photoUrl: '../assets/images/Noor El Deen Magdy.jpg' },
    { name: 'Moataz Hosny', role: 'CTO', photoUrl: '../assets/images/Moutaz.jpeg' },
    { name: 'Rawan Mahmoud', role: 'CTO', photoUrl: '../assets/images/Rawan 1.jpeg' },
    { name: 'Asmaa Latif', role: 'CTO', photoUrl: '../assets/images/Asmaa.jpeg' },
  ];
}
