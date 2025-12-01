-- Script para insertar datos de ejemplo en TheraTrack
-- Ejecutar este script directamente en la base de datos PostgreSQL

-- Insertar 20 pacientes
INSERT INTO patients (full_name, email, age, gender, contact_info, notes, created_at, updated_at) VALUES
('María González Silva', 'maria.gonzalez@email.com', 28, 'femenino', '+56 9 1234 5678', 'Paciente con ansiedad social', NOW(), NOW()),
('Carlos Rodríguez Pérez', 'carlos.rodriguez@email.com', 35, 'masculino', '+56 9 2345 6789', 'Depresión moderada', NOW(), NOW()),
('Ana María López', 'ana.lopez@email.com', 42, 'femenino', '+56 9 3456 7890', 'Estrés laboral', NOW(), NOW()),
('Roberto Fernández', 'roberto.fernandez@email.com', 31, 'masculino', '+56 9 4567 8901', 'Problemas de pareja', NOW(), NOW()),
('Carmen Elena Vargas', 'carmen.vargas@email.com', 39, 'femenino', '+56 9 5678 9012', 'Autoestima baja', NOW(), NOW()),
('Diego Alejandro Morales', 'diego.morales@email.com', 26, 'masculino', '+56 9 6789 0123', 'Adicción a redes sociales', NOW(), NOW()),
('Patricia Isabel Herrera', 'patricia.herrera@email.com', 45, 'femenino', '+56 9 7890 1234', 'Duelo por pérdida', NOW(), NOW()),
('Francisco Javier Torres', 'francisco.torres@email.com', 33, 'masculino', '+56 9 8901 2345', 'Problemas de comunicación', NOW(), NOW()),
('Valentina Andrea Soto', 'valentina.soto@email.com', 29, 'femenino', '+56 9 9012 3456', 'Trastorno de pánico', NOW(), NOW()),
('Manuel Antonio Rojas', 'manuel.rojas@email.com', 37, 'masculino', '+56 9 0123 4567', 'Problemas de ira', NOW(), NOW()),
('Sofía Camila Díaz', 'sofia.diaz@email.com', 24, 'femenino', '+56 9 1234 5679', 'Ansiedad académica', NOW(), NOW()),
('Andrés Felipe Jiménez', 'andres.jimenez@email.com', 41, 'masculino', '+56 9 2345 6780', 'Burnout laboral', NOW(), NOW()),
('Isabella Fernanda Ruiz', 'isabella.ruiz@email.com', 27, 'femenino', '+56 9 3456 7891', 'Problemas de sueño', NOW(), NOW()),
('Sebastián Ignacio Castro', 'sebastian.castro@email.com', 34, 'masculino', '+56 9 4567 8902', 'Problemas de confianza', NOW(), NOW()),
('Camila Antonia Flores', 'camila.flores@email.com', 30, 'femenino', '+56 9 5678 9013', 'Problemas de alimentación', NOW(), NOW()),
('Matías Alejandro Reyes', 'matias.reyes@email.com', 38, 'masculino', '+56 9 6789 0124', 'Problemas de identidad', NOW(), NOW()),
('Javiera Francisca Moreno', 'javiera.moreno@email.com', 25, 'femenino', '+56 9 7890 1235', 'Problemas de límites', NOW(), NOW()),
('Nicolás Andrés Silva', 'nicolas.silva@email.com', 32, 'masculino', '+56 9 8901 2346', 'Problemas de procrastinación', NOW(), NOW()),
('Antonia Valentina Muñoz', 'antonia.munoz@email.com', 36, 'femenino', '+56 9 9012 3457', 'Problemas de maternidad', NOW(), NOW()),
('Tomás Eduardo Fuentes', 'tomas.fuentes@email.com', 29, 'masculino', '+56 9 0123 4568', 'Problemas de adaptación', NOW(), NOW());

-- Insertar algunas sesiones de ejemplo
INSERT INTO sessions (patient_id, fecha_inicio, fecha_fin, concepto_principal, precio, pagado, created_at, updated_at) VALUES
(1, '2024-01-15 09:00:00', '2024-01-15 10:00:00', 'individual', 30000, true, NOW(), NOW()),
(1, '2024-01-18 14:00:00', '2024-01-18 15:00:00', 'evaluación', 35000, false, NOW(), NOW()),
(2, '2024-01-15 10:30:00', '2024-01-15 11:30:00', 'individual', 38000, true, NOW(), NOW()),
(2, '2024-01-18 15:30:00', '2024-01-18 16:30:00', 'evaluación', 40000, false, NOW(), NOW()),
(3, '2024-01-16 09:00:00', '2024-01-16 10:00:00', 'individual', 32000, false, NOW(), NOW()),
(3, '2024-01-19 14:00:00', '2024-01-19 15:00:00', 'evaluación', 38000, true, NOW(), NOW()),
(4, '2024-01-16 10:30:00', '2024-01-16 11:30:00', 'individual', 35000, true, NOW(), NOW()),
(4, '2024-01-19 15:30:00', '2024-01-19 16:30:00', 'evaluación', 40000, false, NOW(), NOW()),
(5, '2024-01-17 09:00:00', '2024-01-17 10:00:00', 'individual', 30000, false, NOW(), NOW()),
(5, '2024-01-20 14:00:00', '2024-01-20 15:00:00', 'evaluación', 35000, true, NOW(), NOW());

-- Insertar algunas transcripciones de ejemplo
INSERT INTO transcriptions (session_id, content, created_at, updated_at) VALUES
(1, 'Sesión individual con María González Silva. El paciente se mostró colaborativo y participativo durante toda la sesión. Se trabajó en técnicas de respiración y mindfulness para manejar la ansiedad. El paciente reportó una mejora significativa en su capacidad para identificar los primeros signos de ansiedad y aplicar las técnicas aprendidas.', NOW(), NOW()),
(3, 'Sesión individual con Carlos Rodríguez Pérez. Se abordaron temas relacionados con el manejo del estrés laboral y la búsqueda de equilibrio personal. El paciente demostró una mayor conciencia de sus patrones de pensamiento negativos.', NOW(), NOW()),
(5, 'Sesión individual con Ana María López. Se abordaron temas relacionados con el duelo y el proceso de aceptación. El paciente mostró una mayor capacidad para expresar sus emociones de manera saludable.', NOW(), NOW()),
(7, 'Sesión individual con Roberto Fernández. El paciente mostró progresos significativos en el manejo de sus síntomas. Se revisaron las tareas asignadas en la sesión anterior y se observó un alto nivel de compromiso.', NOW(), NOW()),
(9, 'Sesión individual con Carmen Elena Vargas. Evaluación inicial donde el paciente manifestó síntomas de autoestima baja. Se aplicaron escalas de evaluación estandarizadas.', NOW(), NOW());

-- Verificar datos insertados
SELECT 'Pacientes insertados:' as info, COUNT(*) as total FROM patients;
SELECT 'Sesiones insertadas:' as info, COUNT(*) as total FROM sessions;
SELECT 'Transcripciones insertadas:' as info, COUNT(*) as total FROM transcriptions; 