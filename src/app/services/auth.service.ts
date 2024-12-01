import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://owmmeter.com/backend';
  private token: string = null;
  private userId: string = null;
  private username: string = null;
  private role: string = null;
  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getToken(): string {
    return this.token;
  }

  getUserId(): string {
    return this.userId;
  }
  getUsername(): string {
    return this.username;
  }
  getRole(): string {
    return this.role;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }
  

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');

  }

  
  handleLoginResponse(response: any): void {
    if (response && response.user) {
      this.token = response.user.token_data.access_token;
      this.userId = response.user.id;
      this.username = response.user.first_name;
      this.role = response.user.role;
      this.loggedIn$.next(true);
      localStorage.setItem('token', this.token);
      localStorage.setItem('userId', this.userId);
      localStorage.setItem('username', this.username);
      localStorage.setItem('role', this.role);
    }
  }

  logout(): void {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.loggedIn$.next(false);
    // Clear token from storage if applicable
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('username');

  }

  registerUser(userDetails: User){
      const url = `${this.baseUrl}/signup`;
      return this.http.put(url, userDetails);
  }
  loginUser(userInfo){
    const url = `${this.baseUrl}/login`;
    return this.http.post(url, userInfo);
  }
  getUserData(): Observable<any> {
    const url = `${this.baseUrl}/user/get-user-data`;
    // Prepare headers with Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
     // Prepare data object with userId
    const data = {
      userId: this.userId };
    return this.http.post<any>(url, data, { headers });
  }

  editUser(userDetails){
    const url = `${this.baseUrl}/user/edit-user`;
    // Prepare headers with Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(url, userDetails, { headers });
  }
  getUserById(id: string): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}/users?id=${id}`);
  }

  getUserRole(email: string): Observable<User | null> {
      return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`).pipe(
          map((users: User[]) => {
              if (users.length > 0) {
                  return users[0]; 
              }
              return null; 
          })
          );
  }
  // Dashboard Services
  getAllUsers(): Observable<{ users: User[], message: string }> {
      const url = `${this.baseUrl}/admin/users`; 
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      return this.http.get<{ users: User[], message: string }>(url, { headers });
  }
  getUserDataById(userId:any): Observable<any> {
    const url = `${this.baseUrl}/admin/get-user-data`;
    // Prepare headers with Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const data = {
      userId: userId };
    return this.http.post<any>(url, data, { headers });
  }
  editUserDataById(userDetails: User): Observable<any> {
    const url = `${this.baseUrl}/admin/edit-user`;
    // Prepare headers with Authorization token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post<any>(url, userDetails, { headers });
  }
  addAdmin(userDetails: User){
    const url = `${this.baseUrl}/admin/add-user`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(url, userDetails, { headers });
}

  deleteUser(id: string): Observable<void> {
      const url = `${this.baseUrl}/admin/delete-user`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      const data = { userId: id };
      return this.http.post<void>(url, data, {headers});
  }
  addMeterbyAdmin(meterData: any){
    const url = `${this.baseUrl}/admin/add-meter`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(url, meterData, { headers });
  }

  // Forget Password
  sendResetLink(email:any){
    const url = `${this.baseUrl}/user/forget-password`;
    return this.http.post(url, email);
  }
  resetPassword(data:any){
    const url = `${this.baseUrl}/user/reset-password`;
    return this.http.post(url, data);
  }
}
