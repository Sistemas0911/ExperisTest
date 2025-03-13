import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenService } from '../../services/orden.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-orden-form',
  standalone: false,
  templateUrl: './orden-form.component.html',
  styleUrl: './orden-form.component.css'
})
export class OrdenFormComponent implements OnInit {
  ordenForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ordenService: OrdenService,
    private router: Router
  ) {
    this.ordenForm = this.fb.group({
      cliente: ['', Validators.required],
      fechaCreacion:['',Validators.required],
      detalles: this.fb.array([this.crearDetalleGrupo()])
    });
  }

  ngOnInit(): void {
    const fechaActual=new Date().toISOString().split('T')[0];
    this.ordenForm.get('fechaCreacion')?.setValue(fechaActual);
  }

  crearDetalleGrupo(): FormGroup {
    return this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get detalles() {
    return this.ordenForm.get('detalles') as any;
  }

  agregarDetalle(): void {
    this.detalles.push(this.crearDetalleGrupo());
  }

  eliminarDetalle(index: number): void {
    this.detalles.removeAt(index);
  }

  onSubmit(): void {
    if (this.ordenForm.valid) {
      const orden = this.ordenForm.value;
      this.ordenService.createOrden(orden).subscribe(() => {
        this.router.navigate(['/ordenes']);
      });
    }
  }
}