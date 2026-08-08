-- Habilito extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla cliente
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    tipo_doc VARCHAR(10) NOT NULL CHECK (tipo_doc IN ('DNI', 'CE', 'RUC')),
    num_doc VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    ap_paterno VARCHAR(50) NOT NULL,
    ap_materno VARCHAR(50),
    email VARCHAR(100),
    telefono VARCHAR(20),
    fecha_nac DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tipo_doc_num_doc UNIQUE (tipo_doc, num_doc)
);

-- Tabla tramite
CREATE TABLE IF NOT EXISTS tramites (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    placa VARCHAR(10),
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL CHECK (anio BETWEEN 1990 AND 2027),
    estado VARCHAR(20) NOT NULL DEFAULT 'REGISTRADO' CHECK (estado IN ('REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO')),
    monto DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla tramite_seguimiento (subdominio)
CREATE TABLE IF NOT EXISTS tramite_seguimiento (
    id SERIAL PRIMARY KEY,
    tramite_id INTEGER NOT NULL REFERENCES tramites(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    comentario TEXT,
    usuario VARCHAR(50) NOT NULL DEFAULT 'operador',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_estado_anterior CHECK (
        estado_anterior IN ('REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO') OR estado_anterior IS NULL
    ),
    CONSTRAINT valid_estado_nuevo CHECK (
        estado_nuevo IN ('REGISTRADO', 'EN_FIRMAS', 'PRESENTADO', 'OBSERVADO', 'INSCRITO', 'CERRADO', 'ANULADO')
    )
);

-- Indices para mejorar el rendimiento
CREATE INDEX idx_tramites_estado ON tramites(estado);
CREATE INDEX idx_tramites_codigo ON tramites(codigo);
CREATE INDEX idx_tramites_cliente_id ON tramites(cliente_id);
CREATE INDEX idx_tramite_seguimiento_tramite_id ON tramite_seguimiento(tramite_id);
CREATE INDEX idx_clientes_num_doc ON clientes(num_doc);
CREATE INDEX idx_clientes_nombres ON clientes(nombres);

-- Seed de datos de ejemplo
-- Clientes
INSERT INTO clientes (tipo_doc, num_doc, nombres, ap_paterno, ap_materno, email, telefono, fecha_nac) VALUES
('DNI', '12345678', 'Juan', 'Perez', 'Gomez', 'juan.perez@email.com', '987654321', '1985-03-15'),
('DNI', '87654321', 'Maria', 'Lopez', 'Torres', 'maria.lopez@email.com', '987654322', '1990-07-22'),
('CE', 'A123456', 'Carlos', 'Garcia', 'Martinez', 'carlos.garcia@email.com', '987654323', '1988-11-10'),
('RUC', '20123456789', 'Empresa', 'Ejemplo', 'SAC', 'contacto@empresa.com', '987654324', NULL),
('DNI', '45678912', 'Ana', 'Rodriguez', 'Flores', 'ana.rodriguez@email.com', '987654325', '1995-05-05');

-- Tramites en diferentes estados
INSERT INTO tramites (codigo, cliente_id, placa, marca, modelo, anio, estado, monto) VALUES
('INM-2026-0001', 1, 'ABC-123', 'Toyota', 'Corolla', 2020, 'REGISTRADO', 1500.00),
('INM-2026-0002', 2, 'DEF-456', 'Honda', 'Civic', 2019, 'EN_FIRMAS', 2000.00),
('INM-2026-0003', 3, 'GHI-789', 'Ford', 'Focus', 2021, 'PRESENTADO', 1800.00),
('INM-2026-0004', 4, NULL, 'Chevrolet', 'Spark', 2022, 'OBSERVADO', 1200.00),
('INM-2026-0005', 5, 'JKL-012', 'Nissan', 'Versa', 2020, 'INSCRITO', 2500.00),
('INM-2026-0006', 1, 'MNO-345', 'Volkswagen', 'Golf', 2018, 'CERRADO', 3000.00),
('INM-2026-0007', 2, 'PQR-678', 'Mazda', '3', 2023, 'ANULADO', 0.00),
('INM-2026-0008', 3, 'STU-901', 'Hyundai', 'Elantra', 2021, 'REGISTRADO', 1600.00);

-- Seguimientos para cada tramite
INSERT INTO tramite_seguimiento (tramite_id, estado_anterior, estado_nuevo, comentario, usuario) VALUES
-- Tramite 1 (REGISTRADO)
(1, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),

-- Tramite 2 (EN_FIRMAS)
(2, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(2, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),

-- Tramite 3 (PRESENTADO)
(3, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(3, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(3, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),

-- Tramite 4 (OBSERVADO)
(4, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(4, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(4, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),
(4, 'PRESENTADO', 'OBSERVADO', 'Observacion por documentacion incompleta', 'operador'),

-- Tramite 5 (INSCRITO)
(5, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(5, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(5, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),
(5, 'PRESENTADO', 'INSCRITO', 'Inscripcion completada', 'operador'),

-- Tramite 6 (CERRADO)
(6, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(6, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(6, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),
(6, 'PRESENTADO', 'INSCRITO', 'Inscripcion completada', 'operador'),
(6, 'INSCRITO', 'CERRADO', 'Tramite cerrado', 'operador'),

-- Tramite 7 (ANULADO)
(7, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(7, 'REGISTRADO', 'ANULADO', 'Anulado por error en datos', 'operador'),

-- Tramite 8 (REGISTRADO)
(8, NULL, 'REGISTRADO', 'Tramite creado', 'operador');