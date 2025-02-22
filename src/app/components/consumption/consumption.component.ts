import { Component } from '@angular/core';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/auth';
import { Chart,registerables } from 'chart.js';
import mqtt, { MqttClient } from 'mqtt';

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
  public chart!: Chart;
  private maxDataPoints = 20; // Limit points in graph
  private mqttClient!: mqtt.MqttClient;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
  ) {
    Chart.register(...registerables);
  }
  onSelect(event: any): void {
    // Your logic here
    // console.log('Selected data:', event);
  }
  

  ngOnInit(): void {
    // Fetch user data when component initializes
    this.userId = localStorage.getItem('userId');
    this.authService.getUserData().subscribe(
      (userData: any) => {
        this.user = userData;
        this.selectedMeterID = this.user.meters[0];
        
        // Call methods that depend on selectedMeterID here
        this.getFlowLineChartData();
        this.initializeChart();
        this.subscribeToConsumption();
      },
      error => {
        console.error('Error fetching user data:', error);
        // Handle error as needed
      }
    );

  }
  ngOnDestroy() {
    this.disconnectMqtt();
  }

  private subscribeToConsumption() {
    const brokerUrl = 'wss://owmmeter.com:9001/mqtt';
    this.mqttClient = mqtt.connect(brokerUrl);

    this.mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');

      this.mqttClient.subscribe(`data${this.userId!}`, (err) => {
        if (err) {
          console.error('Failed to subscribe to the topic:', err);
        } else {
          console.log('Subscribed to the topic:', this.userId);
        }
      });
    });

    this.mqttClient.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString()); // Parse the JSON message
        console.log(`Received Consumption Data:`, data);
        this.updateChart(data);
      } catch (error) {
        console.error("Error parsing MQTT message:", error);
      }
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

  private initializeChart() {
    this.chart = new Chart("realTimeChart", {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { label: 'Liters Consumed', data: [], borderColor: 'blue', fill: false },
          { label: 'Flow Rate', data: [], borderColor: 'green', fill: false },
          { label: 'Pressure Rate', data: [], borderColor: 'red', fill: false }
        ]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          x: { type: 'category', position: 'bottom' },
          y: { beginAtZero: true }
        }
      }
    });
  }

  private updateChart(data: { meter_id?: string; liters_consumed: number; flow_rate: number; pressure_rate: number }) {
    const time = new Date().toLocaleTimeString(); // Get current time
  
    // Extract only the necessary fields
    const { liters_consumed, flow_rate, pressure_rate } = data;
  
    if (!this.chart || !this.chart.data.labels || !this.chart.data.datasets) {
      console.warn("Chart is not properly initialized!");
      return;
    }

    this.chart.data.labels.push(time);
    this.chart.data.datasets[0].data.push(liters_consumed);
    this.chart.data.datasets[1].data.push(flow_rate);
    this.chart.data.datasets[2].data.push(pressure_rate);
  
    // Keep chart size under control
    if (this.chart.data.labels.length > this.maxDataPoints) {
      this.chart.data.labels.shift();
      this.chart.data.datasets.forEach(dataset => dataset.data.shift());
    }
  
    this.chart.update();
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
    // console.log(selectedFilter);
  }
  
  getFlowLineChartData() {
    if(this.selectedMeterID){
      const requestData = {
        meterId: this.selectedMeterID
      };
      this.dataService.getMeterData(requestData).subscribe(
        (response: any) => {
            const data = response.IoTDevice.readings;
            
              // Preprocess data to handle missing values
        const processedData = data.map(item => ({
          created_at: new Date(item.created_at), // Ensure timestamp is a valid date
          flow_rate: item.flow_rate ?? 0, // Replace null/undefined with 0
          pressure_rate: item.pressure_rate ?? 0,
          liters_consumed: item.liters_consumed ?? 0
        }));

        // Bind processed data to ngx-charts
        this.flowLineChartData = [{
          name: 'Flow',
          series: processedData.map(item => ({
            name: item.created_at,
            value: item.flow_rate
          }))
        }];

        this.pressureLineChartData = [{
          name: 'Pressure',
          series: processedData.map(item => ({
            name: item.created_at,
            value: item.pressure_rate
          }))
        }];

        this.litresLineChartData = [{
          name: 'Litre',
          series: processedData.map(item => ({
            name: item.created_at,
            value: item.liters_consumed
          }))
        }];
      },
      error => {
        console.log('Error fetching meter data:', error);
        this.flowLineChartData = [];
        this.pressureLineChartData = [];
        this.litresLineChartData = [];
      }
    );
          
    this.dataService.getMoney(requestData).subscribe(
      (response: any) => {
        const moneyData = response.Money;
    
        // Check if moneyData is empty or undefined/null
        if (!moneyData || Object.keys(moneyData).length === 0) {
          this.moneyBarChartData = [{ name: new Date().toLocaleDateString(), value: 0 }];
        } else {
          // Process the money data to match the chart format
          this.moneyBarChartData = moneyData.map(item => ({
            name: new Date(item.created_at).toLocaleDateString(),
            value: item.amount ?? 0 // Ensure amount is not null/undefined
          }));
        }
      },
      error => {
        console.error('Error fetching money data:', error);
        this.moneyBarChartData = [{ name: new Date().toLocaleDateString(), value: 0 }];
      }
    );
    
    }
  }
  

}
