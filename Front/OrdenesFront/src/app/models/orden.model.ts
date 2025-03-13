export interface Orden {
    id: number;
    fechaCreacion: string;
    cliente: string;
    total: number;
    detalles: OrdenDetalle[];
  }
  
  export interface OrdenDetalle {
    id: number;
    ordenId: number;
    producto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }