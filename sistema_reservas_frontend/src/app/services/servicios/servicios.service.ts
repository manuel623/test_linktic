import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
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

  listService(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/servicios`, { ...this.getHttpOptions() });
  }

  createService(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/servicios/register`, data, { ...this.getHttpOptions() });
  }

  editService(data:any, id:number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/servicios/` + id, data, { ...this.getHttpOptions() });
  }

  deleteService(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/servicios/` + id, { ...this.getHttpOptions() });
  }
}
