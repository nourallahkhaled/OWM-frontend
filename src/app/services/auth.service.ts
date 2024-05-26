import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
    
  constructor(private http: HttpClient) { }

  registerUser(userDetails: User){
      const url = `${this.baseUrl}/users`;
      return this.http.post(url, userDetails);
  }
  // getAllUsers(): Observable<User[]> {
  //     const url = `${this.baseUrl}/users`; 
  //     return this.http.get<User[]>(url);
  // }
  getUserByEmail(email: string): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }
  // getUserById(id: string): Observable<User[]> {
  //     return this.http.get<User[]>(`${this.baseUrl}/users?id=${id}`);
  // }
  // getUserRole(email: string): Observable<User | null> {
  //     return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`).pipe(
  //         map((users: User[]) => {
  //             if (users.length > 0) {
  //                 return users[0]; 
  //             }
  //             return null; 
  //         })
  //         );
  // }
  // editAdmin(id: string, userDetails: User): Observable<User> {
  //     const url = `${this.baseUrl}/users/${id}`;
  //     return this.http.put<User>(url, userDetails);
  // }
  // deleteAdmin(id: string): Observable<void> {
  //     const url = `${this.baseUrl}/users/${id}`;
  //     return this.http.delete<void>(url);
  // }
}
