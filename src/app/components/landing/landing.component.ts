import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  teamMembers = [
    { name: 'Rawan Mahmoud', role: 'Co-Founder - Marketing Specialist', photoUrl: '../assets/images/team/Rawan.jpeg' },
    { name: 'Asmaa Latif', role: 'Co-Founder - Embedded Hardware Engineer', photoUrl: '../assets/images/team/Asmaa.jpeg' },
    { name: 'Nourallah Khaled', role: 'Frontend Web Developer', photoUrl: '../assets/images/team/Nourallah.jpeg' },
    { name: 'Mohab Yasser', role: 'Backend Web Developer', photoUrl: '../assets/images/team/Mohab.jpeg' },
    { name: 'Noor El-Deen Magdy', role: 'Founder - CTO', photoUrl: '../assets/images/team/Noor El Deen Magdy.jpg' },

  ];
}
