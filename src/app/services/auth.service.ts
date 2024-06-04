import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  private loggedIn = new BehaviorSubject<boolean>(false);
    
  constructor(private http: HttpClient) { 
    this.checkLoginStatus();
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login() {
    // Perform login logic
    this.loggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
    this.loggedIn.next(false);
  }

  checkLoginStatus() {
    const email = sessionStorage.getItem('email');
    this.loggedIn.next(!!email);
  }

  registerUser(userDetails: User){
      const url = `${this.baseUrl}/users`;
      return this.http.post(url, userDetails);
  }
  getUserByEmail(email: string): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }
  getUserById(id: string): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}/users?id=${id}`);
  }
  editUser(id: string, userDetails: User): Observable<User[]> {
    const url = `${this.baseUrl}/users/${id}`;
    return this.http.put<User[]>(url, userDetails);
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
  emailExists(email: string): Observable<boolean> {
    return this.getUserByEmail(email).pipe(
      map(users => users.length > 0),
      catchError(() => of(false))
    );
  }

  getAllUsers(): Observable<User[]> {
      const url = `${this.baseUrl}/users`; 
      return this.http.get<User[]>(url);
  }
  editAdmin(id: string, userDetails: User): Observable<User> {
      const url = `${this.baseUrl}/users/${id}`;
      return this.http.put<User>(url, userDetails);
  }
  deleteUser(id: string): Observable<void> {
      const url = `${this.baseUrl}/users/${id}`;
      return this.http.delete<void>(url);
  }
}
