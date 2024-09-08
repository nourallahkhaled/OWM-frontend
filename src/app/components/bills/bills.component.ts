import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent {
  money: any;
  currentMonth: string = '';

  constructor(private dataService: DataService,){}
  
  ngOnInit(): void {
    this.currentMonth = this.getCurrentMonth();
    this.getBillsMoney();
  }

  getCurrentMonth(): string {
    const date = new Date();
    // Correctly specifying the type of month option
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return date.toLocaleDateString('en-US', options);
  }
  
  getBillsMoney(){
    this.dataService.getBill().subscribe(
      (response: any) => {
        this.money = response.totalBalance;

      },
      error => {
        console.error('Error fetching money data:', error);
      }
    );
  }

}


