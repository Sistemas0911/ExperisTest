import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orden-list',
  standalone: false,
  templateUrl: './orden-list.component.html',
  styleUrl: './orden-list.component.css'
})
export class OrdenListComponent implements OnInit {
  ordenes: Orden[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  nroOrden?: number;
  cliente?: string;

  constructor(
    private ordenService: OrdenService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    this.ordenService.getOrdenes(this.nroOrden,this.cliente,this.pageNumber,this.pageSize)
    .subscribe(response => {
      this.ordenes = response.data;
      this.totalCount=response.totalCount;
    });
  }

  GenerarOrden(): void{
    this.router.navigate(['/ordenes/nueva']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/ordenes', id]);
  }

  eliminarOrden(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta orden?')) {
      this.ordenService.deleteOrden(id).subscribe(() => {
        this.cargarOrdenes(); // Recargar la lista después de eliminar
      });
    }
  }

  onPageChange(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.cargarOrdenes();
  }

  onFilterChange(): void {
    this.pageNumber = 1; // Reiniciar a la primera página al aplicar filtros
    this.cargarOrdenes();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isUser(): boolean {
    return this.authService.isUser();
  }
}
