import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Employee, Guid } from '../model';  
import { Observable, throwError, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private WebApi = 'http://localhost:3000/employees';  
  
  constructor(private http: HttpClient) { }  
  
  getEmployees(): Observable<Employee[]> {  
    return this.http.get<Employee[]>(this.WebApi)  
      .pipe(  
        catchError(this.handleError)  
      );  
  }  
  
  getEmployee(id: string): Observable<Employee> {  
    if (id === '') {  
      return of(this.initializeEmployee());  
    }  
    const url = `${this.WebApi}/${id}`;  
    return this.http.get<Employee>(url)  
      .pipe(  
        catchError(this.handleError)  
      );  
  }  
  
  createEmployee(employee: Employee): Observable<Employee> {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    employee.id = Guid.newGuid();    
    return this.http.post<Employee>(this.WebApi, employee, { headers: headers })  
      .pipe(  
        catchError(this.handleError)  
      );  
  }  
  
  deleteEmployee(id: string): Observable<{}> {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    const url = `${this.WebApi}/${id}`;  
    return this.http.delete<Employee>(url, { headers: headers })  
      .pipe(  
        catchError(this.handleError)  
      );  
  }  
  
  updateEmployee(employee: Employee): Observable<Employee> {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    const url = `${this.WebApi}/${employee.id}`;  
    return this.http.put<Employee>(url, employee, { headers: headers })  
      .pipe(  
        map(() => employee),  
        catchError(this.handleError)  
      );  
  }  
  
  private handleError(err) {  
    let errorMessage: string;  
    if (err.error instanceof ErrorEvent) {  
      errorMessage = `An error occurred: ${err.error.message}`;  
    } else {  
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;  
    }  
    console.error(err);  
    return throwError(errorMessage);  
  }  
  
  private initializeEmployee(): Employee {  
    return {  
      id: null,  
      name: null,  
      address: null,  
      gender: null,  
      company: null,  
      designation: null  
    };  
  }
}
