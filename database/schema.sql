DROP DATABASE IF EXISTS tramites_db;

CREATE DATABASE tramites_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tramites_db;

CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_doc ENUM('DNI','CE','RUC') NOT NULL,
    num_doc VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    ap_paterno VARCHAR(50) NOT NULL,
    ap_materno VARCHAR(50),
    email VARCHAR(100),
    telefono VARCHAR(20),
    fecha_nac DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_tipo_doc_num_doc UNIQUE (tipo_doc, num_doc)
) ENGINE=InnoDB;

CREATE TABLE tramites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    placa VARCHAR(10),
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    estado ENUM(
        'REGISTRADO',
        'EN_FIRMAS',
        'PRESENTADO',
        'OBSERVADO',
        'INSCRITO',
        'CERRADO',
        'ANULADO'
    ) NOT NULL DEFAULT 'REGISTRADO',
    monto DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tramites_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tramite_seguimiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tramite_id INT NOT NULL,
    estado_anterior ENUM(
        'REGISTRADO',
        'EN_FIRMAS',
        'PRESENTADO',
        'OBSERVADO',
        'INSCRITO',
        'CERRADO',
        'ANULADO'
    ) NULL,
    estado_nuevo ENUM(
        'REGISTRADO',
        'EN_FIRMAS',
        'PRESENTADO',
        'OBSERVADO',
        'INSCRITO',
        'CERRADO',
        'ANULADO'
    ) NOT NULL,
    comentario TEXT,
    usuario VARCHAR(50) NOT NULL DEFAULT 'operador',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tramite_seguimiento_tramite
        FOREIGN KEY (tramite_id)
        REFERENCES tramites(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_tramites_estado
    ON tramites(estado);

CREATE INDEX idx_tramites_cliente_id
    ON tramites(cliente_id);

CREATE INDEX idx_tramite_seguimiento_tramite_id
    ON tramite_seguimiento(tramite_id);

CREATE INDEX idx_clientes_num_doc
    ON clientes(num_doc);

CREATE INDEX idx_clientes_nombres
    ON clientes(nombres);

INSERT INTO clientes (
    tipo_doc,
    num_doc,
    nombres,
    ap_paterno,
    ap_materno,
    email,
    telefono,
    fecha_nac
) VALUES
('DNI', '12345678', 'Juan', 'Perez', 'Gomez', 'juan.perez@email.com', '987654321', '1985-03-15'),
('DNI', '87654321', 'Maria', 'Lopez', 'Torres', 'maria.lopez@email.com', '987654322', '1990-07-22'),
('CE', 'A123456', 'Carlos', 'Garcia', 'Martinez', 'carlos.garcia@email.com', '987654323', '1988-11-10'),
('RUC', '20123456789', 'Empresa', 'Ejemplo', 'SAC', 'contacto@empresa.com', '987654324', NULL),
('DNI', '45678912', 'Ana', 'Rodriguez', 'Flores', 'ana.rodriguez@email.com', '987654325', '1995-05-05');

INSERT INTO tramites (
    codigo,
    cliente_id,
    placa,
    marca,
    modelo,
    anio,
    estado,
    monto
) VALUES
('INM-2026-0001', 1, 'ABC-123', 'Toyota', 'Corolla', 2020, 'REGISTRADO', 1500.00),
('INM-2026-0002', 2, 'DEF-456', 'Honda', 'Civic', 2019, 'EN_FIRMAS', 2000.00),
('INM-2026-0003', 3, 'GHI-789', 'Ford', 'Focus', 2021, 'PRESENTADO', 1800.00),
('INM-2026-0004', 4, NULL, 'Chevrolet', 'Spark', 2022, 'OBSERVADO', 1200.00),
('INM-2026-0005', 5, 'JKL-012', 'Nissan', 'Versa', 2020, 'INSCRITO', 2500.00),
('INM-2026-0006', 1, 'MNO-345', 'Volkswagen', 'Golf', 2018, 'CERRADO', 3000.00),
('INM-2026-0007', 2, 'PQR-678', 'Mazda', '3', 2023, 'ANULADO', 0.00),
('INM-2026-0008', 3, 'STU-901', 'Hyundai', 'Elantra', 2021, 'REGISTRADO', 1600.00);

INSERT INTO tramite_seguimiento (
    tramite_id,
    estado_anterior,
    estado_nuevo,
    comentario,
    usuario
) VALUES
(1, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(2, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(2, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(3, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(3, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(3, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),
(4, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(4, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(4, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),
(4, 'PRESENTADO', 'OBSERVADO', 'Observacion por documentacion incompleta', 'operador'),
(5, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(5, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(5, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),
(5, 'PRESENTADO', 'INSCRITO', 'Inscripcion completada', 'operador'),
(6, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(6, 'REGISTRADO', 'EN_FIRMAS', 'Inicio de firmas', 'operador'),
(6, 'EN_FIRMAS', 'PRESENTADO', 'Presentado ante entidad', 'operador'),
(6, 'PRESENTADO', 'INSCRITO', 'Inscripcion completada', 'operador'),
(6, 'INSCRITO', 'CERRADO', 'Tramite cerrado', 'operador'),
(7, NULL, 'REGISTRADO', 'Tramite creado', 'operador'),
(7, 'REGISTRADO', 'ANULADO', 'Anulado por error en datos', 'operador'),
(8, NULL, 'REGISTRADO', 'Tramite creado', 'operador');

SELECT * FROM clientes ORDER BY id;

SELECT * FROM tramites ORDER BY id;

SELECT * FROM tramite_seguimiento ORDER BY id;