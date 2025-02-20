import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DataService {
    private baseUrl = 'https://owmmeter.com/backend';
    private token: string = null;
    selectedMeterID: string  = '';


    getToken(): string {
        return this.token;
    }


    setSelectedMeterID(meterID: string) {
        this.selectedMeterID = meterID;
    }

    getSelectedMeterID() {
        return this.selectedMeterID;
    }


    constructor(private http: HttpClient) { 
        this.token = localStorage.getItem('token');
    }

    getMeterData(meterID): Observable<any> {
        const url = `${this.baseUrl}/user/get-meter-data`;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.post<any>(url, meterID, { headers });
    }
    getWaterConsumption(data):Observable<any> {
        const url = `${this.baseUrl}/user/get-water-consumption`;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.post<any>(url, data, { headers });
    }
    getMoney(meterID):Observable<any> {
        const url = `${this.baseUrl}/user/get-money`;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.post<any>(url, meterID, { headers });
    }
    getBill():Observable<any> {
        const url = `${this.baseUrl}/user/payment`;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.get<any>(url, { headers });
    }
    detectLeakage(data){
        const url = `${this.baseUrl}/meter/leakage-detected`
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.post<any>(url, data, { headers });
    }
    ToggleMotorValve(data){
        const url = `${this.baseUrl}/meter/valve-status`
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });
        return this.http.post<any>(url, data, { headers });
    }

}
