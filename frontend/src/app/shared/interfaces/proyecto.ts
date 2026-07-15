export interface Proyecto {
  id: number;
  nombre: string;
  estado: string;
  cliente?: { 
    id: number; 
    nombre: string 
  }; 
  idCliente?: number; 
}