import { Component } from '@angular/core';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent {
  waterBarChartData: any[] | undefined;
  moneyBarChartData: any[] | undefined;
  fromDate: Date | string = '';
  toDate: Date | string = '';
  timeFilter: string = '';
  colorScheme: Color = {
    domain: ['#008DDA', '#41C9E2', '#ACE2E1', '#F7EEDD', '#a8385d', '#CCCCCC'],
    name: '',
    selectable: false,
    group: ScaleType.Ordinal
  };
  onSelect(event: any): void {
    // Your logic here
    console.log('Selected data:', event);
  }
  flowLineChartData: any[] = [
    {
      name: 'Flow',
      series: [
        { name: new Date('2022-01-01'), value: 100 },
        { name: new Date('2022-01-02'), value: 200 },
        { name: new Date('2022-01-03'), value: 150 },
        // Add more data points as needed
      ]
    }
  ];
  litresLineChartData: any[] = [
    {
      name: 'Litres',
      series: [
        { name: new Date('2022-01-01'), value: 120 },
        { name: new Date('2022-01-02'), value: 180 },
        { name: new Date('2022-01-03'), value: 150 },
        // Add more data points as needed
      ]
    }
  ];
  pressureLineChartData: any[] = [
    {
      name: 'Pressure',
      series: [
        { name: new Date('2022-01-01'), value: 80 },
        { name: new Date('2022-01-02'), value: 120 },
        { name: new Date('2022-01-03'), value: 90 },
        // Add more data points as needed
      ]
    }
  ];
  

  ngOnInit(): void {
    // Initialize with dummy data
    this.updateChartData();
  }
  

  updateChartData(): void {
    // Generate dummy data for the bar chart
    this.waterBarChartData = [
      { name: 'Day 1', value: Math.floor(Math.random() * 100) },
      { name: 'Day 2', value: Math.floor(Math.random() * 100) },
      { name: 'Day 3', value: Math.floor(Math.random() * 100) },
      { name: 'Day 4', value: Math.floor(Math.random() * 100) },
      { name: 'Day 5', value: Math.floor(Math.random() * 100) },
      { name: 'Day 6', value: Math.floor(Math.random() * 100) },
      { name: 'Day 7', value: Math.floor(Math.random() * 100) }
    ];
    this.moneyBarChartData = [
      { name: 'Day 1', value: Math.floor(Math.random() * 100) },
      { name: 'Day 2', value: Math.floor(Math.random() * 100) },
      { name: 'Day 3', value: Math.floor(Math.random() * 100) },
      { name: 'Day 4', value: Math.floor(Math.random() * 100) },
      { name: 'Day 5', value: Math.floor(Math.random() * 100) },
      { name: 'Day 6', value: Math.floor(Math.random() * 100) },
      { name: 'Day 7', value: Math.floor(Math.random() * 100) }
    ];
  }

  // Handle filter changes
  applyFilter(fromDate: Date | string , toDate: Date | string, timeFilter: string): void {
    let startDate, endDate;

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


    // Logic to fetch data for the selected date range
    // Update this.waterBarChartData with the fetched data
    this.updateChartData();
  }
  applyTimeFilter(selectedFilter: string): void {
    // Logic to handle filtering based on the selectedFilter value
    console.log(selectedFilter);
  }

}
