import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from '../models/orden.model';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = 'http://localhost:5050/api/Ordenes';

  constructor(private http: HttpClient) { }

  getOrdenes(nroOrden: number = 0, cliente: string ='', pageNumber: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('nroOrden', nroOrden.toString())
      .set('cliente', cliente.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (nroOrden) {
      params = params.set('nroOrden', nroOrden.toString());
    }

    if (cliente) {
      params = params.set('cliente', cliente);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getOrdenById(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  createOrden(orden: Orden): Observable<Orden> {
    console.log(orden);
    return this.http.post<Orden>(this.apiUrl, orden);
  }

  deleteOrden(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}