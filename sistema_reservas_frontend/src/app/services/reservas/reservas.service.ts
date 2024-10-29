import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private apiUrl: string = environment.apiUrl;

  /**
   * Se obtiene token
   * @returns string
   */
  private getHttpOptions() {
    const accessToken = localStorage.getItem('token')?.replace(/['"]+/g, '');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }

  constructor(private http: HttpClient) { }

  listReservas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservas`, { ...this.getHttpOptions() });
  }

  createReservas(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reservas`, data, { ...this.getHttpOptions() });
  }

  editReservas(data:any, id:number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reservas/` + id, data, { ...this.getHttpOptions() });
  }

  deleteReservas(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reservas/` + id, { ...this.getHttpOptions() });
  }
}
