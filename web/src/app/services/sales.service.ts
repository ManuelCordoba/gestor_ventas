import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private BACKEND_URL = "http://localhost:8000/api"
  
    constructor(private http: HttpClient) {}
  
    getClients(): Observable<any> {
      return this.http.get<any>(`${this.BACKEND_URL}/clients`)
    }
    createClient(data:any): Observable<any> {
      return this.http.post<any>(`${this.BACKEND_URL}/clients/`,data)
    }
    getProducts(): Observable<any> {
      return this.http.get<any>(`${this.BACKEND_URL}/products`)
    }
    createProduct(data:any): Observable<any> {
      return this.http.post<any>(`${this.BACKEND_URL}/products/`,data)
    }
    getSales(): Observable<any> {
      return this.http.get<any>(`${this.BACKEND_URL}/sales`)
    }
    createSales(data:any): Observable<any> {
      return this.http.post<any>(`${this.BACKEND_URL}/sales/`,data)
      .pipe(catchError(error => {
        console.error('Error fetching sales data', error);
        return throwError(() => new Error('Error fetching sales data')); // Nueva forma de lanzar el error
      })
      );
    }
  }