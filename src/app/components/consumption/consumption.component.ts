import { Component } from '@angular/core';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/auth';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent {
  userId: string;
  user: User | undefined;
  waterBarChartData: any[] | undefined;
  moneyBarChartData: any[] | undefined;
  fromDate: Date;
  toDate: Date;
  timeFilter: string = '';
  selectedMeterID: string;
  colorScheme: Color = {
    domain: ['#008DDA', '#41C9E2', '#ACE2E1', '#F7EEDD', '#a8385d', '#CCCCCC'],
    name: '',
    selectable: false,
    group: ScaleType.Ordinal
  };
  flowLineChartData: any[] = [];
  pressureLineChartData: any[] = [];
  litresLineChartData: any[] = [];
  applyFilterClicked:boolean = false;


  constructor(
    private dataService: DataService,
    private authService: AuthService,
  ) { }
  onSelect(event: any): void {
    // Your logic here
    console.log('Selected data:', event);
  }
  

  ngOnInit(): void {
    // Fetch user data when component initializes
    this.authService.getUserData().subscribe(
      (userData: any) => {
        this.user = userData;
        this.selectedMeterID = this.user.meters[0];
        
        // Call methods that depend on selectedMeterID here
        this.getFlowLineChartData();
      },
      error => {
        console.error('Error fetching user data:', error);
        // Handle error as needed
      }
    );

  }

  // Handle filter changes
  applyFilter(fromDate: Date | string, toDate: Date | string, timeFilter: string): void {
    this.applyFilterClicked = true;

    let startDate,endDate;
    startDate = this.fromDate.toISOString();
    endDate = this.toDate.toISOString();
  
    switch (timeFilter) {
      case 'Day':
        startDate = startOfDay(fromDate);
        endDate = endOfDay(toDate);
        break;
      case 'Week':
        startDate = startOfDay(subWeeks(fromDate, 1));
        endDate = endOfWeek(toDate);
        break;
      case 'Month':
        startDate = startOfDay(subMonths(fromDate, 1));
        endDate = endOfMonth(toDate);
        break;
      default:
        break;
    }
    const waterReqData = {
      meterId: this.selectedMeterID,
      fromDate: startDate,
      toDate: endDate,
    };
    this.dataService.getWaterConsumption(waterReqData).subscribe(
      (response: any) => {
          const data = response.litersConsumed;
          this.waterBarChartData = data.map(item => ({
            name: new Date(item.created_at).toLocaleDateString(), 
            value: item.liters_consumed
          }));
      },
      error => {
        console.log('Error fetching meter data:', error);
        this.waterBarChartData = [];
      }
    );

  }
  applyTimeFilter(selectedFilter: string): void {
    // Logic to handle filtering based on the selectedFilter value
    console.log(selectedFilter);
  }
  
  getFlowLineChartData() {
    if(this.selectedMeterID){
      const requestData = {
        meterId: this.selectedMeterID
      };
      this.dataService.getMeterData(requestData).subscribe(
        (response: any) => {
            const data = response.IoTDevice.readings;
            
            this.flowLineChartData = [{
              name: 'Flow', 
              series: data.map(item => ({
                name: new Date(item.created_at), // x-axis: timestamp
                value: item.flow_rate // y-axis: waterFlowSensor value
              }))
            }];
  
            this.pressureLineChartData = [{
              name: 'Pressure', 
              series: data.map(item => ({
                name: new Date(item.created_at), // x-axis: timestamp
                value: item.pressure_rate // y-axis: pressureSensor value
              }))
            }];

            this.litresLineChartData = [{
              name: 'Litre', 
              series: data.map(item => ({
                name: new Date(item.created_at), // x-axis: timestamp
                value: item.liters_consumed // y-axis: pressureSensor value
              }))
            }];
          
        },
        error => {
          console.log('Error fetching meter data:', error);
          // Handle error or set default/empty data
          this.flowLineChartData = []; 
          this.pressureLineChartData = []; 
        }
      );
      this.dataService.getMoney(requestData).subscribe(
        (response: any) => {
          const moneyData = response.Money;
  
          // Process the money data to match the chart format
          this.moneyBarChartData = moneyData.map(item => ({
            name: new Date(item.created_at).toLocaleDateString(), 
            value: item.amount
          }));

        },
        error => {
          console.error('Error fetching money data:', error);
          this.moneyBarChartData = [];
        }
      );
    }
  }
  

}
