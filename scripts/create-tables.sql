-- Script para crear todas las tablas de TheraTrack
-- Ejecutar este script ANTES de ejecutar el seed si no usas synchronize: true

-- Crear extensión para UUID si es necesario
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'therapist'))
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(50) NOT NULL,
    contact_info TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    notas_del_terapeuta TEXT,
    concepto_principal VARCHAR(255),
    precio DECIMAL(10, 2) NOT NULL,
    pagado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

-- Tabla de transcripciones
CREATE TABLE IF NOT EXISTS transcriptions (
    id SERIAL PRIMARY KEY,
    session_id INTEGER UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transcriptions_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Tabla de logs de emociones
CREATE TABLE IF NOT EXISTS emotion_log (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    text TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emotion_log_user FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
);

-- Tabla de análisis de emociones
CREATE TABLE IF NOT EXISTS emotion_analysis (
    id SERIAL PRIMARY KEY,
    "emotionLogId" INTEGER NOT NULL,
    "primaryEmotion" VARCHAR(255) NOT NULL,
    confidence DECIMAL(3, 2) NOT NULL,
    "analysisData" JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emotion_analysis_log FOREIGN KEY ("emotionLogId") REFERENCES emotion_log(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_fecha_inicio ON sessions(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_transcriptions_session_id ON transcriptions(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_log_user_id ON emotion_log("userId");
CREATE INDEX IF NOT EXISTS idx_emotion_analysis_log_id ON emotion_analysis("emotionLogId");

-- Comentarios en las tablas
COMMENT ON TABLE patients IS 'Tabla de pacientes del sistema';
COMMENT ON TABLE sessions IS 'Tabla de sesiones terapéuticas';
COMMENT ON TABLE transcriptions IS 'Tabla de transcripciones de sesiones';
COMMENT ON TABLE "user" IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE emotion_log IS 'Tabla de logs de emociones de usuarios';
COMMENT ON TABLE emotion_analysis IS 'Tabla de análisis de emociones generados por IA';

