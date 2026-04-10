-- ============================================
-- SEED: 30,000+ registros para Salud Activa
-- Distribución:
--   ~20,000 usuarios
--   ~4,000  citas_medicas
--   ~3,000  medicamentos
--   ~1,500  vacunas
--   ~800    familiares
--   ~500    recordatorios
--   ~200    alertas
-- ============================================

USE smarthealth;

-- Desactivar checks para velocidad
SET FOREIGN_KEY_CHECKS = 0;
SET autocommit = 0;

-- -----------------------------------------------
-- 1. Usuarios de prueba principales
-- -----------------------------------------------
INSERT INTO usuarios (nombre, apellido, correo, contrasena, fecha_nacimiento, rol)
VALUES
  ('Juan', 'Pérez', 'juan@salud.com', '123456', '1990-05-15', 'usuario'),
  ('María', 'Pérez', 'maria@salud.com', '123456', '1965-08-20', 'familiar');

-- -----------------------------------------------
-- 2. Generar 20,000 usuarios con procedimiento
-- -----------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_usuarios$$
CREATE PROCEDURE seed_usuarios()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE v_nombre VARCHAR(100);
  DECLARE v_apellido VARCHAR(100);
  DECLARE v_rol VARCHAR(10);
  DECLARE v_year INT;
  DECLARE v_month INT;
  DECLARE v_day INT;

  WHILE i < 20000 DO
    SET v_nombre = ELT(1 + FLOOR(RAND() * 40),
      'Carlos','Ana','Luis','Sofía','Diego','Valentina','Andrés','Camila','Fernando','Isabella',
      'Miguel','Daniela','José','Mariana','Ricardo','Paula','Gabriel','Lucía','Alejandro','Elena',
      'Pedro','Carolina','Sebastián','Natalia','Javier','Andrea','Tomás','Gabriela','Nicolás','Laura',
      'Santiago','Valeria','Mateo','Fernanda','Daniel','Catalina','Emilio','Julieta','Rafael','Lorena'
    );
    SET v_apellido = ELT(1 + FLOOR(RAND() * 40),
      'García','Rodríguez','Martínez','López','Hernández','González','Pérez','Sánchez','Ramírez','Torres',
      'Flores','Rivera','Gómez','Díaz','Cruz','Morales','Reyes','Gutiérrez','Ortiz','Ramos',
      'Mendoza','Castillo','Romero','Álvarez','Ruiz','Jiménez','Vargas','Medina','Castro','Rojas',
      'Herrera','Aguilar','Peña','Silva','Vega','Campos','Delgado','Ríos','Guerrero','Navarro'
    );
    SET v_rol = IF(RAND() < 0.8, 'usuario', 'familiar');
    SET v_year = 1950 + FLOOR(RAND() * 60);
    SET v_month = 1 + FLOOR(RAND() * 12);
    SET v_day = 1 + FLOOR(RAND() * 28);

    INSERT IGNORE INTO usuarios (nombre, apellido, correo, contrasena, fecha_nacimiento, rol)
    VALUES (
      v_nombre,
      v_apellido,
      CONCAT(LOWER(v_nombre), '.', LOWER(REPLACE(v_apellido,'í','i')), '.', i, '@salud.com'),
      '123456',
      CONCAT(v_year, '-', LPAD(v_month, 2, '0'), '-', LPAD(v_day, 2, '0')),
      v_rol
    );

    SET i = i + 1;

    IF i % 2000 = 0 THEN
      COMMIT;
    END IF;
  END WHILE;

  COMMIT;
END$$

DELIMITER ;
CALL seed_usuarios();
DROP PROCEDURE IF EXISTS seed_usuarios;

-- -----------------------------------------------
-- 3. Generar 4,000 citas médicas
-- -----------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_citas$$
CREATE PROCEDURE seed_citas()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE v_uid INT;
  DECLARE v_medico VARCHAR(150);
  DECLARE v_especialidad VARCHAR(100);
  DECLARE v_lugar VARCHAR(200);
  DECLARE v_estado VARCHAR(15);
  DECLARE v_fecha DATETIME;
  DECLARE max_uid INT;

  SELECT MAX(id) INTO max_uid FROM usuarios WHERE rol = 'usuario';

  WHILE i < 4000 DO
    SELECT id INTO v_uid FROM usuarios WHERE rol = 'usuario' ORDER BY RAND() LIMIT 1;

    SET v_medico = CONCAT('Dr. ', ELT(1 + FLOOR(RAND() * 20),
      'Ramírez','Soto','Valencia','Moreno','Paredes','Delgado','Ávila','Montoya','Cervantes','Espinoza',
      'Cordero','Lara','Bautista','Mejía','Figueroa','Salazar','Acosta','Pacheco','Villanueva','Cisneros'
    ));

    SET v_especialidad = ELT(1 + FLOOR(RAND() * 15),
      'Medicina General','Cardiología','Dermatología','Pediatría','Ginecología',
      'Oftalmología','Traumatología','Neurología','Gastroenterología','Endocrinología',
      'Urología','Neumología','Psiquiatría','Otorrinolaringología','Oncología'
    );

    SET v_lugar = ELT(1 + FLOOR(RAND() * 10),
      'Hospital General del Norte','Clínica Santa Fe','Centro Médico Nacional','Hospital Ángeles',
      'Clínica del Valle','Hospital San José','Centro de Salud Comunitario','Hospital Universitario',
      'Clínica Médica Integral','Consultorio Médico Plaza Salud'
    );

    SET v_estado = IF(RAND() < 0.6, 'completada', 'pendiente');
    SET v_fecha = DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 900) DAY);
    SET v_fecha = DATE_ADD(v_fecha, INTERVAL (8 + FLOOR(RAND() * 10)) HOUR);

    INSERT INTO citas_medicas (usuario_id, medico, especialidad, lugar, fecha_hora, estado, notas)
    VALUES (
      v_uid, v_medico, v_especialidad, v_lugar, v_fecha, v_estado,
      IF(RAND() < 0.3, ELT(1 + FLOOR(RAND() * 5),
        'Llevar estudios previos','Acudir en ayunas','Revisión de rutina','Seguimiento de tratamiento','Control mensual'
      ), NULL)
    );

    SET i = i + 1;
    IF i % 1000 = 0 THEN COMMIT; END IF;
  END WHILE;
  COMMIT;
END$$

DELIMITER ;
CALL seed_citas();
DROP PROCEDURE IF EXISTS seed_citas;

-- -----------------------------------------------
-- 4. Generar 3,000 medicamentos
-- -----------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_medicamentos$$
CREATE PROCEDURE seed_medicamentos()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE v_uid INT;
  DECLARE v_nombre VARCHAR(150);
  DECLARE v_dosis VARCHAR(100);
  DECLARE v_frecuencia VARCHAR(100);
  DECLARE v_inicio DATE;
  DECLARE v_fin DATE;

  WHILE i < 3000 DO
    SELECT id INTO v_uid FROM usuarios WHERE rol = 'usuario' ORDER BY RAND() LIMIT 1;

    SET v_nombre = ELT(1 + FLOOR(RAND() * 25),
      'Metformina','Losartán','Omeprazol','Atorvastatina','Amoxicilina',
      'Ibuprofeno','Paracetamol','Ciprofloxacino','Metoprolol','Enalapril',
      'Diclofenaco','Naproxeno','Clonazepam','Sertralina','Fluoxetina',
      'Levotiroxina','Insulina Glargina','Salbutamol','Prednisona','Azitromicina',
      'Ranitidina','Captopril','Amlodipino','Simvastatina','Clopidogrel'
    );

    SET v_dosis = ELT(1 + FLOOR(RAND() * 8),
      '500mg','250mg','100mg','50mg','10mg','20mg','850mg','1g'
    );

    SET v_frecuencia = ELT(1 + FLOOR(RAND() * 6),
      'Cada 8 horas','Cada 12 horas','Cada 24 horas','Cada 6 horas','Cada 4 horas','Una vez al día'
    );

    SET v_inicio = DATE_ADD('2024-01-01', INTERVAL FLOOR(RAND() * 800) DAY);
    SET v_fin = DATE_ADD(v_inicio, INTERVAL (7 + FLOOR(RAND() * 180)) DAY);

    INSERT INTO medicamentos (usuario_id, nombre, dosis, frecuencia, fecha_inicio, fecha_fin, notas)
    VALUES (
      v_uid, v_nombre, v_dosis, v_frecuencia, v_inicio, v_fin,
      IF(RAND() < 0.2, ELT(1 + FLOOR(RAND() * 4),
        'Tomar con alimentos','No mezclar con alcohol','Tomar en ayunas','Guardar en refrigeración'
      ), NULL)
    );

    SET i = i + 1;
    IF i % 1000 = 0 THEN COMMIT; END IF;
  END WHILE;
  COMMIT;
END$$

DELIMITER ;
CALL seed_medicamentos();
DROP PROCEDURE IF EXISTS seed_medicamentos;

-- -----------------------------------------------
-- 5. Generar 1,500 vacunas
-- -----------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_vacunas$$
CREATE PROCEDURE seed_vacunas()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE v_uid INT;
  DECLARE v_nombre VARCHAR(150);
  DECLARE v_dosis_ap VARCHAR(100);
  DECLARE v_fecha DATE;
  DECLARE v_proxima DATE;

  WHILE i < 1500 DO
    SELECT id INTO v_uid FROM usuarios ORDER BY RAND() LIMIT 1;

    SET v_nombre = ELT(1 + FLOOR(RAND() * 12),
      'COVID-19 Pfizer','COVID-19 AstraZeneca','COVID-19 Moderna','Influenza Estacional',
      'Hepatitis B','Tétanos','Sarampión (MMR)','Varicela','Neumococo',
      'VPH','Meningococo','Fiebre Amarilla'
    );

    SET v_dosis_ap = ELT(1 + FLOOR(RAND() * 4),
      '1ra dosis','2da dosis','3ra dosis (refuerzo)','Dosis única'
    );

    SET v_fecha = DATE_ADD('2023-01-01', INTERVAL FLOOR(RAND() * 1000) DAY);
    SET v_proxima = IF(RAND() < 0.6, DATE_ADD(v_fecha, INTERVAL (30 + FLOOR(RAND() * 335)) DAY), NULL);

    INSERT INTO vacunas (usuario_id, nombre, dosis_aplicada, fecha_aplicacion, proxima_dosis_fecha, notas)
    VALUES (
      v_uid, v_nombre, v_dosis_ap, v_fecha, v_proxima,
      IF(RAND() < 0.15, ELT(1 + FLOOR(RAND() * 3),
        'Sin reacciones adversas','Dolor leve en zona de aplicación','Fiebre leve por 24h'
      ), NULL)
    );

    SET i = i + 1;
    IF i % 500 = 0 THEN COMMIT; END IF;
  END WHILE;
  COMMIT;
END$$

DELIMITER ;
CALL seed_vacunas();
DROP PROCEDURE IF EXISTS seed_vacunas;

-- -----------------------------------------------
-- 6. Generar 800 familiares (vínculos)
-- -----------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_familiares$$
CREATE PROCEDURE seed_familiares()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE v_uid INT;
  DECLARE v_fid INT;
  DECLARE v_parentesco VARCHAR(80);

  WHILE i < 800 DO
    SELECT id INTO v_uid FROM usuarios WHERE rol = 'usuario' ORDER BY RAND() LIMIT 1;
    SELECT id INTO v_fid FROM usuarios WHERE rol = 'familiar' AND id != v_uid ORDER BY RAND() LIMIT 1;

    IF v_fid IS NOT NULL THEN
      SET v_parentesco = ELT(1 + FLOOR(RAND() * 8),
        'Madre','Padre','Hermano/a','Esposo/a','Hijo/a','Abuelo/a','Tío/a','Primo/a'
      );

      INSERT IGNORE INTO familiares (usuario_id, familiar_id, parentesco)
      VALUES (v_uid, v_fid, v_parentesco);
    END IF;

    SET i = i + 1;
    IF i % 200 = 0 THEN COMMIT; END IF;
  END WHILE;
  COMMIT;
END$$

DELIMITER ;
CALL seed_familiares();
DROP PROCEDURE IF EXISTS seed_familiares;

-- -----------------------------------------------
-- 7. Generar 500 recordatorios
-- -----------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_recordatorios$$
CREATE PROCEDURE seed_recordatorios()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE v_uid INT;
  DECLARE v_tipo VARCHAR(20);
  DECLARE v_ref INT;
  DECLARE v_fecha DATETIME;
  DECLARE v_estado VARCHAR(10);

  WHILE i < 500 DO
    SET v_tipo = ELT(1 + FLOOR(RAND() * 3), 'cita', 'medicamento', 'vacuna');

    IF v_tipo = 'cita' THEN
      SELECT usuario_id, id INTO v_uid, v_ref FROM citas_medicas ORDER BY RAND() LIMIT 1;
    ELSEIF v_tipo = 'medicamento' THEN
      SELECT usuario_id, id INTO v_uid, v_ref FROM medicamentos ORDER BY RAND() LIMIT 1;
    ELSE
      SELECT usuario_id, id INTO v_uid, v_ref FROM vacunas ORDER BY RAND() LIMIT 1;
    END IF;

    IF v_uid IS NOT NULL THEN
      SET v_fecha = DATE_ADD('2024-06-01', INTERVAL FLOOR(RAND() * 600) DAY);
      SET v_fecha = DATE_ADD(v_fecha, INTERVAL (7 + FLOOR(RAND() * 12)) HOUR);
      SET v_estado = IF(RAND() < 0.4, 'enviado', 'activo');

      INSERT INTO recordatorios (usuario_id, tipo, referencia_id, fecha_recordatorio, estado)
      VALUES (v_uid, v_tipo, v_ref, v_fecha, v_estado);
    END IF;

    SET i = i + 1;
    IF i % 200 = 0 THEN COMMIT; END IF;
  END WHILE;
  COMMIT;
END$$

DELIMITER ;
CALL seed_recordatorios();
DROP PROCEDURE IF EXISTS seed_recordatorios;

-- -----------------------------------------------
-- 8. Generar 200 alertas
-- -----------------------------------------------
DELIMITER $$

DROP PROCEDURE IF EXISTS seed_alertas$$
CREATE PROCEDURE seed_alertas()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE v_uid INT;
  DECLARE v_fid INT;
  DECLARE v_tipo VARCHAR(80);
  DECLARE v_mensaje TEXT;

  WHILE i < 200 DO
    SELECT f.usuario_id, f.familiar_id
      INTO v_uid, v_fid
      FROM familiares f ORDER BY RAND() LIMIT 1;

    IF v_uid IS NOT NULL THEN
      SET v_tipo = ELT(1 + FLOOR(RAND() * 3),
        'cita_incumplida', 'medicamento_omitido', 'vacuna_pendiente'
      );

      SET v_mensaje = ELT(1 + FLOOR(RAND() * 6),
        'El paciente no asistió a su cita médica programada.',
        'Se detectó omisión en la toma del medicamento prescrito.',
        'La vacuna programada no fue aplicada en la fecha indicada.',
        'Cita de seguimiento no completada. Se requiere reprogramar.',
        'El tratamiento no fue administrado en el horario indicado.',
        'Dosis de vacuna pendiente. Favor de acudir al centro de salud.'
      );

      INSERT INTO alertas (usuario_id, familiar_id, tipo, mensaje, leida)
      VALUES (v_uid, v_fid, v_tipo, v_mensaje, IF(RAND() < 0.3, 1, 0));
    END IF;

    SET i = i + 1;
    IF i % 100 = 0 THEN COMMIT; END IF;
  END WHILE;
  COMMIT;
END$$

DELIMITER ;
CALL seed_alertas();
DROP PROCEDURE IF EXISTS seed_alertas;

-- -----------------------------------------------
-- Reactivar checks
-- -----------------------------------------------
SET FOREIGN_KEY_CHECKS = 1;
SET autocommit = 1;

-- Verificar conteos
SELECT 'usuarios' AS tabla, COUNT(*) AS total FROM usuarios
UNION ALL SELECT 'citas_medicas', COUNT(*) FROM citas_medicas
UNION ALL SELECT 'medicamentos', COUNT(*) FROM medicamentos
UNION ALL SELECT 'vacunas', COUNT(*) FROM vacunas
UNION ALL SELECT 'familiares', COUNT(*) FROM familiares
UNION ALL SELECT 'recordatorios', COUNT(*) FROM recordatorios
UNION ALL SELECT 'alertas', COUNT(*) FROM alertas;
