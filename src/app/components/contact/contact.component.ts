import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string;
  email: string;
  phone: number;
  message: string;
  constructor(){}
  ngOnInit(){}
  submitForm(){
    // const message= ⁠ My name is ${this.name}. My email is ${this.email}. My message is ${this.message} ⁠;
    // alert(message);
  }
  
}