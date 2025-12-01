-- Script para crear todas las tablas de TheraTrack
-- Ejecutar este script ANTES de ejecutar el seed si no usas synchronize: true

-- Crear extensión para UUID si es necesario
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'therapist', 'owner', 'sitter', 'admin'))
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

-- ============================================
-- TABLAS PARA SISTEMA DE MASCOTAS (PetTrack)
-- ============================================

-- Tabla de mascotas
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    species VARCHAR(255) NOT NULL,
    breed VARCHAR(255),
    age INTEGER,
    owner_id INTEGER NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pets_owner FOREIGN KEY (owner_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Tabla de sesiones de cuidado
CREATE TABLE IF NOT EXISTS care_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL,
    sitter_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_care_sessions_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    CONSTRAINT fk_care_sessions_sitter FOREIGN KEY (sitter_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Tabla de reportes de sesiones
CREATE TABLE IF NOT EXISTS session_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    care_session_id UUID NOT NULL,
    pet_id UUID NOT NULL,
    sitter_id INTEGER NOT NULL,
    report_date DATE NOT NULL,
    activities TEXT[] NOT NULL,
    notes TEXT NOT NULL,
    mood VARCHAR(50) CHECK (mood IN ('happy', 'calm', 'anxious', 'playful', 'tired')),
    feeding JSONB,
    medication JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_reports_care_session FOREIGN KEY (care_session_id) REFERENCES care_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_reports_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_reports_sitter FOREIGN KEY (sitter_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Tabla de ubicaciones
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    pet_id UUID,
    owner_id INTEGER NOT NULL,
    type VARCHAR(50) DEFAULT 'other' CHECK (type IN ('home', 'vet', 'grooming', 'park', 'other')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_locations_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE SET NULL,
    CONSTRAINT fk_locations_owner FOREIGN KEY (owner_id) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Tabla de fotos
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    pet_id UUID,
    care_session_id UUID,
    session_report_id UUID,
    uploaded_by INTEGER NOT NULL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_photos_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE SET NULL,
    CONSTRAINT fk_photos_care_session FOREIGN KEY (care_session_id) REFERENCES care_sessions(id) ON DELETE SET NULL,
    CONSTRAINT fk_photos_session_report FOREIGN KEY (session_report_id) REFERENCES session_reports(id) ON DELETE SET NULL,
    CONSTRAINT fk_photos_uploader FOREIGN KEY (uploaded_by) REFERENCES "user"(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_fecha_inicio ON sessions(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_transcriptions_session_id ON transcriptions(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_log_user_id ON emotion_log("userId");
CREATE INDEX IF NOT EXISTS idx_emotion_analysis_log_id ON emotion_analysis("emotionLogId");

-- Índices para tablas de mascotas
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_care_sessions_pet_id ON care_sessions(pet_id);
CREATE INDEX IF NOT EXISTS idx_care_sessions_sitter_id ON care_sessions(sitter_id);
CREATE INDEX IF NOT EXISTS idx_care_sessions_start_time ON care_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_session_reports_care_session_id ON session_reports(care_session_id);
CREATE INDEX IF NOT EXISTS idx_session_reports_pet_id ON session_reports(pet_id);
CREATE INDEX IF NOT EXISTS idx_locations_owner_id ON locations(owner_id);
CREATE INDEX IF NOT EXISTS idx_locations_pet_id ON locations(pet_id);
CREATE INDEX IF NOT EXISTS idx_photos_pet_id ON photos(pet_id);
CREATE INDEX IF NOT EXISTS idx_photos_care_session_id ON photos(care_session_id);

-- Comentarios en las tablas
COMMENT ON TABLE patients IS 'Tabla de pacientes del sistema';
COMMENT ON TABLE sessions IS 'Tabla de sesiones terapéuticas';
COMMENT ON TABLE transcriptions IS 'Tabla de transcripciones de sesiones';
COMMENT ON TABLE "user" IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE emotion_log IS 'Tabla de logs de emociones de usuarios';
COMMENT ON TABLE emotion_analysis IS 'Tabla de análisis de emociones generados por IA';
COMMENT ON TABLE pets IS 'Tabla de mascotas del sistema PetTrack';
COMMENT ON TABLE care_sessions IS 'Tabla de sesiones de cuidado de mascotas';
COMMENT ON TABLE session_reports IS 'Tabla de reportes de sesiones de cuidado';
COMMENT ON TABLE locations IS 'Tabla de ubicaciones relacionadas con mascotas';
COMMENT ON TABLE photos IS 'Tabla de fotos de mascotas y sesiones';

