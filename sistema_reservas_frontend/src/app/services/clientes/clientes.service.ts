import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
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

  listClient(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes`, { ...this.getHttpOptions() });
  }

  createClient(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes/register`, data, { ...this.getHttpOptions() });
  }

  editClient(data:any, id:number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/clientes/` + id, data, { ...this.getHttpOptions() });
  }

  deleteClient(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clientes/` + id, { ...this.getHttpOptions() });
  }
}
