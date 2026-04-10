-- ============================================
-- Schema: smarthealth
-- Sistema Integral "Salud Activa"
-- ============================================

CREATE DATABASE IF NOT EXISTS smarthealth
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smarthealth;

-- -----------------------------------------------
-- Tabla: usuarios
-- -----------------------------------------------
CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100)  NOT NULL,
  apellido      VARCHAR(100)  NOT NULL,
  correo        VARCHAR(150)  NOT NULL UNIQUE,
  contrasena    VARCHAR(255)  NOT NULL,
  fecha_nacimiento DATE       NOT NULL,
  rol           ENUM('usuario','familiar') NOT NULL DEFAULT 'usuario',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: familiares
-- -----------------------------------------------
CREATE TABLE familiares (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT NOT NULL,
  familiar_id   INT NOT NULL,
  parentesco    VARCHAR(80)  NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_familiar_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_familiar_familiar FOREIGN KEY (familiar_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: citas_medicas
-- -----------------------------------------------
CREATE TABLE citas_medicas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT NOT NULL,
  medico        VARCHAR(150) NOT NULL,
  especialidad  VARCHAR(100) NOT NULL,
  lugar         VARCHAR(200) NOT NULL,
  fecha_hora    DATETIME     NOT NULL,
  estado        ENUM('pendiente','completada') NOT NULL DEFAULT 'pendiente',
  notas         TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cita_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: medicamentos
-- -----------------------------------------------
CREATE TABLE medicamentos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT NOT NULL,
  nombre          VARCHAR(150) NOT NULL,
  dosis           VARCHAR(100) NOT NULL,
  frecuencia      VARCHAR(100) NOT NULL,
  fecha_inicio    DATE         NOT NULL,
  fecha_fin       DATE         NOT NULL,
  notas           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_med_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: vacunas
-- -----------------------------------------------
CREATE TABLE vacunas (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id          INT NOT NULL,
  nombre              VARCHAR(150) NOT NULL,
  dosis_aplicada      VARCHAR(100) NOT NULL,
  fecha_aplicacion    DATE         NOT NULL,
  proxima_dosis_fecha DATE,
  notas               TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vac_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: recordatorios
-- -----------------------------------------------
CREATE TABLE recordatorios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT NOT NULL,
  tipo            ENUM('cita','medicamento','vacuna') NOT NULL,
  referencia_id   INT NOT NULL,
  fecha_recordatorio DATETIME NOT NULL,
  estado          ENUM('activo','enviado') NOT NULL DEFAULT 'activo',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rec_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla: alertas
-- -----------------------------------------------
CREATE TABLE alertas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT NOT NULL,
  familiar_id     INT,
  tipo            VARCHAR(80)  NOT NULL,
  mensaje         TEXT         NOT NULL,
  leida           BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alerta_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_alerta_familiar FOREIGN KEY (familiar_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;
