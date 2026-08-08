export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  mensaje?: string;
  errores?: Array<{
    campo: string;
    detalle: string;
  }>;
}

export interface Cliente {
  id: number;
  tipo_doc: 'DNI' | 'CE' | 'RUC';
  num_doc: string;
  nombres: string;
  ap_paterno: string;
  ap_materno?: string | undefined;
  email?: string | undefined;
  telefono?: string | undefined;
  fecha_nac?: Date | string | null | undefined;
  created_at: Date;
  updated_at: Date;
}

export type EstadoTramite = 
  | 'REGISTRADO' 
  | 'EN_FIRMAS' 
  | 'PRESENTADO' 
  | 'OBSERVADO' 
  | 'INSCRITO' 
  | 'CERRADO' 
  | 'ANULADO';

export interface Tramite {
  id: number;
  codigo: string;
  cliente_id: number;
  placa?: string | undefined;
  marca: string;
  modelo: string;
  anio: number;
  estado: EstadoTramite;
  monto?: number | undefined;
  created_at: Date;
  updated_at: Date;
}

export interface TramiteSeguimiento {
  id: number;
  tramite_id: number;
  estado_anterior?: EstadoTramite | null | undefined;
  estado_nuevo: EstadoTramite;
  comentario?: string | undefined;
  usuario: string;
  created_at: Date;
}

export interface TramiteDetalle extends Tramite {
  cliente: Cliente;
  seguimientos: TramiteSeguimiento[];
}