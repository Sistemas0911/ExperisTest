import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden.model';

@Component({
  selector: 'app-orden-detail',
  standalone: false,
  templateUrl: './orden-detail.component.html',
  styleUrl: './orden-detail.component.css'
})
export class OrdenDetailComponent implements OnInit {
  orden: Orden | undefined;

  constructor(
    private route: ActivatedRoute,
    private ordenService: OrdenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ordenService.getOrdenById(+id).subscribe(data => {
        this.orden = data;
      });
    }
  }

  returnOrdenes(): void {
        this.router.navigate(['/ordenes']);
  }
}
