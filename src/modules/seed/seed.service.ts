import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PatientsService } from '../patients/patients.service';
import { SessionsService } from '../sessions/sessions.service';
import { TranscriptionsService } from '../transcriptions/transcriptions.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

interface PatientData {
  fullName: string;
  email: string;
  age: number;
  gender: string;
  contactInfo?: string;
  notes?: string;
}

interface SessionData {
  patientId: number;
  fechaInicio: string;
  fechaFin: string;
  conceptoPrincipal: string;
  notasDelTerapeuta?: string;
  precio: number;
  pagado: boolean;
}

const patientsData: PatientData[] = [
  { fullName: 'María González Silva', email: 'maria.gonzalez@email.com', age: 28, gender: 'femenino', contactInfo: '+56 9 1234 5678', notes: 'Paciente con ansiedad social' },
  { fullName: 'Carlos Rodríguez Pérez', email: 'carlos.rodriguez@email.com', age: 35, gender: 'masculino', contactInfo: '+56 9 2345 6789', notes: 'Depresión moderada' },
  { fullName: 'Ana María López', email: 'ana.lopez@email.com', age: 42, gender: 'femenino', contactInfo: '+56 9 3456 7890', notes: 'Estrés laboral' },
  { fullName: 'Roberto Fernández', email: 'roberto.fernandez@email.com', age: 31, gender: 'masculino', contactInfo: '+56 9 4567 8901', notes: 'Problemas de pareja' },
  { fullName: 'Carmen Elena Vargas', email: 'carmen.vargas@email.com', age: 39, gender: 'femenino', contactInfo: '+56 9 5678 9012', notes: 'Autoestima baja' },
  { fullName: 'Diego Alejandro Morales', email: 'diego.morales@email.com', age: 26, gender: 'masculino', contactInfo: '+56 9 6789 0123', notes: 'Adicción a redes sociales' },
  { fullName: 'Patricia Isabel Herrera', email: 'patricia.herrera@email.com', age: 45, gender: 'femenino', contactInfo: '+56 9 7890 1234', notes: 'Duelo por pérdida' },
  { fullName: 'Francisco Javier Torres', email: 'francisco.torres@email.com', age: 33, gender: 'masculino', contactInfo: '+56 9 8901 2345', notes: 'Problemas de comunicación' },
  { fullName: 'Valentina Andrea Soto', email: 'valentina.soto@email.com', age: 29, gender: 'femenino', contactInfo: '+56 9 9012 3456', notes: 'Trastorno de pánico' },
  { fullName: 'Manuel Antonio Rojas', email: 'manuel.rojas@email.com', age: 37, gender: 'masculino', contactInfo: '+56 9 0123 4567', notes: 'Problemas de ira' },
  { fullName: 'Sofía Camila Díaz', email: 'sofia.diaz@email.com', age: 24, gender: 'femenino', contactInfo: '+56 9 1234 5679', notes: 'Ansiedad académica' },
  { fullName: 'Andrés Felipe Jiménez', email: 'andres.jimenez@email.com', age: 41, gender: 'masculino', contactInfo: '+56 9 2345 6780', notes: 'Burnout laboral' },
  { fullName: 'Isabella Fernanda Ruiz', email: 'isabella.ruiz@email.com', age: 27, gender: 'femenino', contactInfo: '+56 9 3456 7891', notes: 'Problemas de sueño' },
  { fullName: 'Sebastián Ignacio Castro', email: 'sebastian.castro@email.com', age: 34, gender: 'masculino', contactInfo: '+56 9 4567 8902', notes: 'Problemas de confianza' },
  { fullName: 'Camila Antonia Flores', email: 'camila.flores@email.com', age: 30, gender: 'femenino', contactInfo: '+56 9 5678 9013', notes: 'Problemas de alimentación' },
  { fullName: 'Matías Alejandro Reyes', email: 'matias.reyes@email.com', age: 38, gender: 'masculino', contactInfo: '+56 9 6789 0124', notes: 'Problemas de identidad' },
  { fullName: 'Javiera Francisca Moreno', email: 'javiera.moreno@email.com', age: 25, gender: 'femenino', contactInfo: '+56 9 7890 1235', notes: 'Problemas de límites' },
  { fullName: 'Nicolás Andrés Silva', email: 'nicolas.silva@email.com', age: 32, gender: 'masculino', contactInfo: '+56 9 8901 2346', notes: 'Problemas de procrastinación' },
  { fullName: 'Antonia Valentina Muñoz', email: 'antonia.munoz@email.com', age: 36, gender: 'femenino', contactInfo: '+56 9 9012 3457', notes: 'Problemas de maternidad' },
  { fullName: 'Tomás Eduardo Fuentes', email: 'tomas.fuentes@email.com', age: 29, gender: 'masculino', contactInfo: '+56 9 0123 4568', notes: 'Problemas de adaptación' }
];

const sessionTypes = ['individual', 'grupal', 'evaluación'];
const sessionTimes = [
  { start: '09:00', end: '10:00' },
  { start: '10:30', end: '11:30' },
  { start: '14:00', end: '15:00' },
  { start: '15:30', end: '16:30' },
  { start: '17:00', end: '18:00' },
  { start: '18:30', end: '19:30' }
];

const prices = [25000, 28000, 30000, 32000, 35000, 38000, 40000];

function generateTranscriptionContent(patientName: string, sessionType: string): string {
  const templates = [
    `Sesión ${sessionType} con ${patientName}. El paciente se mostró colaborativo y participativo durante toda la sesión. Se trabajó en técnicas de respiración y mindfulness para manejar la ansiedad. El paciente reportó una mejora significativa en su capacidad para identificar los primeros signos de ansiedad y aplicar las técnicas aprendidas. Se observó una mayor apertura emocional y disposición para explorar temas difíciles. Se asignaron ejercicios de práctica diaria para consolidar los aprendizajes. Próxima sesión programada para continuar con el trabajo en técnicas de afrontamiento.`,
    `Evaluación inicial con ${patientName}. Se realizó una entrevista clínica completa donde el paciente manifestó síntomas de ${sessionType === 'individual' ? 'ansiedad social' : 'depresión moderada'}. Se aplicaron escalas de evaluación estandarizadas. El paciente mostró buena disposición para el tratamiento y comprensión de la importancia de la continuidad terapéutica. Se establecieron objetivos claros y realistas para el proceso terapéutico. Se observó la necesidad de trabajar en aspectos de autoestima y habilidades sociales. Se programó sesión de seguimiento para evaluar progreso.`,
    `Sesión ${sessionType} con ${patientName}. Se abordaron temas relacionados con el manejo del estrés laboral y la búsqueda de equilibrio personal. El paciente demostró una mayor conciencia de sus patrones de pensamiento negativos. Se trabajó en técnicas de reestructuración cognitiva y se practicaron ejercicios de relajación progresiva. El paciente reportó una reducción en la intensidad de sus síntomas y mayor capacidad de afrontamiento. Se observó una mejora en la comunicación de sus necesidades emocionales. Se asignaron tareas para casa enfocadas en la práctica de técnicas aprendidas.`,
    `Sesión de seguimiento con ${patientName}. El paciente mostró progresos significativos en el manejo de sus síntomas. Se revisaron las tareas asignadas en la sesión anterior y se observó un alto nivel de compromiso. Se trabajó en el desarrollo de habilidades de comunicación asertiva y establecimiento de límites saludables. El paciente reportó una mejora en sus relaciones interpersonales y mayor confianza en sí mismo. Se continuó trabajando en técnicas de regulación emocional. Se programó próxima sesión para evaluar objetivos a largo plazo.`,
    `Sesión ${sessionType} con ${patientName}. Se abordaron temas relacionados con el duelo y el proceso de aceptación. El paciente mostró una mayor capacidad para expresar sus emociones de manera saludable. Se trabajó en técnicas de procesamiento emocional y se exploraron recursos de apoyo social. El paciente reportó una reducción en la intensidad del dolor emocional y mayor capacidad de resiliencia. Se observó una integración más saludable de la experiencia de pérdida. Se asignaron ejercicios de escritura terapéutica para continuar el proceso de elaboración.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateSessionsForPatient(patientId: number, startDate: Date): SessionData[] {
  const sessions: SessionData[] = [];
  const usedTimes = new Set<string>();
  
  for (let day = 0; day < 10; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
    
    if (day % 3 === 0 || day % 4 === 0) {
      let attempts = 0;
      let sessionTime;
      
      do {
        sessionTime = sessionTimes[Math.floor(Math.random() * sessionTimes.length)];
        attempts++;
      } while (usedTimes.has(`${currentDate.toISOString().split('T')[0]}-${sessionTime.start}`) && attempts < 10);
      
      if (attempts < 10) {
        usedTimes.add(`${currentDate.toISOString().split('T')[0]}-${sessionTime.start}`);
        
        const fechaInicio = `${currentDate.toISOString().split('T')[0]}T${sessionTime.start}:00`;
        const fechaFin = `${currentDate.toISOString().split('T')[0]}T${sessionTime.end}:00`;
        
        sessions.push({
          patientId,
          fechaInicio,
          fechaFin,
          conceptoPrincipal: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
          precio: prices[Math.floor(Math.random() * prices.length)],
          pagado: Math.random() > 0.5
        });
      }
    }
  }
  
  return sessions;
}

@Injectable()
export class SeedService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly patientService: PatientsService,
    private readonly sessionsService: SessionsService,
    private readonly transcriptionsService: TranscriptionsService,
    private readonly usersService: UsersService,
  ) {}

  async createTables() {
    const createTablesSQL = `
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
`;

    try {
      // Execute each statement separately to handle errors gracefully
      const statements = createTablesSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await this.dataSource.query(statement);
          } catch (error) {
            // Ignore errors for IF NOT EXISTS statements
            if (!error.message?.includes('already exists')) {
              console.warn(`Warning executing SQL: ${error.message}`);
            }
          }
        }
      }

      return {
        message: 'Tables created successfully',
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error creating tables',
        error: error.message,
        success: false,
      };
    }
  }

  async seedUsers() {
    const usersData = [
      { email: 'patient1@example.com', password: '123456', role: 'patient' },
      { email: 'patient2@example.com', password: '123456', role: 'patient' },
      { email: 'therapist1@example.com', password: '123456', role: 'therapist' },
      { email: 'therapist2@example.com', password: '123456', role: 'therapist' },
      { email: 'admin@example.com', password: '123456', role: 'therapist' },
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      try {
        const existingUser = await this.usersService.findByEmail(userData.email);
        if (existingUser) {
          continue;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        const user = await this.usersService.create({
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        });
        
        createdUsers.push({ id: user.id, email: user.email, role: user.role });
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error.message);
      }
    }

    return {
      message: 'Users seeded successfully',
      users: createdUsers,
      total: createdUsers.length,
    };
  }

  async seedData() {
    const createdPatients = [];
    
    // Insert patients
    for (const patientData of patientsData) {
      try {
        const patient = await this.patientService.create(patientData);
        createdPatients.push(patient);
      } catch (error) {
        // Skip if patient already exists
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          continue;
        }
        throw error;
      }
    }
    
    // Generate sessions
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const allSessions = [];
    
    for (const patient of createdPatients) {
      const patientSessions = generateSessionsForPatient(patient.id, startDate);
      
      for (const sessionData of patientSessions) {
        try {
          const session = await this.sessionsService.create(sessionData);
          allSessions.push(session);
        } catch (error) {
          console.error(`Error creating session for patient ${patient.id}:`, error.message);
        }
      }
    }
    
    // Generate transcriptions
    const sessionsForTranscription = allSessions.filter(() => Math.random() < 0.6);
    
    for (const session of sessionsForTranscription) {
      try {
        const patient = createdPatients.find(p => p.id === session.patientId);
        const transcriptionContent = generateTranscriptionContent(patient?.fullName || 'Paciente', session.conceptoPrincipal);
        
        await this.transcriptionsService.create({
          sessionId: session.id,
          content: transcriptionContent
        });
      } catch (error) {
        console.error(`Error creating transcription for session ${session.id}:`, error.message);
      }
    }
    
    return {
      message: 'Data seeded successfully',
      summary: {
        patients: createdPatients.length,
        sessions: allSessions.length,
        transcriptions: sessionsForTranscription.length,
      },
    };
  }

  async seedAll() {
    // First create tables
    const tablesResult = await this.createTables();
    
    // Then seed users
    const usersResult = await this.seedUsers();
    
    // Finally seed data
    const dataResult = await this.seedData();
    
    return {
      message: 'Database initialized and seeded successfully',
      tables: tablesResult,
      users: usersResult,
      data: dataResult,
    };
  }
}

