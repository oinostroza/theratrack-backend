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

function generateCalendarSessionsForDecember(patientIds: number[]): SessionData[] {
  const sessions: SessionData[] = [];
  const usedTimes = new Set<string>();
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Crear fecha de inicio de diciembre (1 de diciembre)
  const decemberStart = new Date(currentYear, 11, 1); // Mes 11 = Diciembre (0-indexed)
  
  // Crear fecha de fin de diciembre (31 de diciembre)
  const decemberEnd = new Date(currentYear, 11, 31);
  
  // Horarios más amplios para tener más sesiones
  const extendedSessionTimes = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '10:30', end: '11:30' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '15:30', end: '16:30' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '18:30', end: '19:30' },
    { start: '19:00', end: '20:00' }
  ];
  
  // Iterar por cada día de diciembre
  for (let day = 1; day <= 31; day++) {
    const currentDate = new Date(currentYear, 11, day);
    const dayOfWeek = currentDate.getDay();
    
    // Saltar domingos (0), pero incluir sábados (6) con menos frecuencia
    if (dayOfWeek === 0) continue;
    
    // Determinar cuántas sesiones crear este día
    let sessionsPerDay = 0;
    if (dayOfWeek === 6) { // Sábado
      sessionsPerDay = Math.random() > 0.7 ? 2 : 0; // 30% de probabilidad, máximo 2 sesiones
    } else { // Lunes a Viernes
      // Entre 3 y 6 sesiones por día laboral
      sessionsPerDay = Math.floor(Math.random() * 4) + 3;
    }
    
    // Crear sesiones para este día
    for (let i = 0; i < sessionsPerDay && i < extendedSessionTimes.length; i++) {
      // Seleccionar un paciente aleatorio
      const patientId = patientIds[Math.floor(Math.random() * patientIds.length)];
      
      // Seleccionar un horario disponible
      let attempts = 0;
      let sessionTime;
      let timeKey;
      
      do {
        sessionTime = extendedSessionTimes[Math.floor(Math.random() * extendedSessionTimes.length)];
        timeKey = `${currentDate.toISOString().split('T')[0]}-${sessionTime.start}`;
        attempts++;
      } while (usedTimes.has(timeKey) && attempts < 50);
      
      if (attempts < 50) {
        usedTimes.add(timeKey);
        
        const fechaInicio = `${currentDate.toISOString().split('T')[0]}T${sessionTime.start}:00`;
        const fechaFin = `${currentDate.toISOString().split('T')[0]}T${sessionTime.end}:00`;
        
        // Para fechas pasadas, marcar más como pagadas
        const isPast = currentDate < today;
        const pagado = isPast ? Math.random() > 0.2 : Math.random() > 0.5; // 80% pagadas si es pasado, 50% si es futuro
        
        sessions.push({
          patientId,
          fechaInicio,
          fechaFin,
          conceptoPrincipal: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
          precio: prices[Math.floor(Math.random() * prices.length)],
          pagado,
          notasDelTerapeuta: isPast ? 'Sesión completada' : undefined
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
    const statements = [
      `CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'therapist', 'owner', 'sitter', 'admin'))
      )`,
      `CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(50) NOT NULL,
        contact_info TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
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
      )`,
      `CREATE TABLE IF NOT EXISTS transcriptions (
        id SERIAL PRIMARY KEY,
        session_id INTEGER UNIQUE NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_transcriptions_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS emotion_log (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        text TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_emotion_log_user FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS emotion_analysis (
        id SERIAL PRIMARY KEY,
        "emotionLogId" INTEGER NOT NULL,
        "primaryEmotion" VARCHAR(255) NOT NULL,
        confidence DECIMAL(3, 2) NOT NULL,
        "analysisData" JSONB,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_emotion_analysis_log FOREIGN KEY ("emotionLogId") REFERENCES emotion_log(id) ON DELETE CASCADE
      )`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_fecha_inicio ON sessions(fecha_inicio)`,
      `CREATE INDEX IF NOT EXISTS idx_transcriptions_session_id ON transcriptions(session_id)`,
      `CREATE INDEX IF NOT EXISTS idx_emotion_log_user_id ON emotion_log("userId")`,
      `CREATE INDEX IF NOT EXISTS idx_emotion_analysis_log_id ON emotion_analysis("emotionLogId")`,
      // Tablas para sistema de mascotas
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
      `CREATE TABLE IF NOT EXISTS pets (
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
      )`,
      `CREATE TABLE IF NOT EXISTS care_sessions (
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
      )`,
      `CREATE TABLE IF NOT EXISTS session_reports (
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
      )`,
      `CREATE TABLE IF NOT EXISTS locations (
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
      )`,
      `CREATE TABLE IF NOT EXISTS photos (
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
      )`,
      // Índices para tablas de mascotas
      `CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id)`,
      `CREATE INDEX IF NOT EXISTS idx_care_sessions_pet_id ON care_sessions(pet_id)`,
      `CREATE INDEX IF NOT EXISTS idx_care_sessions_sitter_id ON care_sessions(sitter_id)`,
      `CREATE INDEX IF NOT EXISTS idx_care_sessions_start_time ON care_sessions(start_time)`,
      `CREATE INDEX IF NOT EXISTS idx_session_reports_care_session_id ON session_reports(care_session_id)`,
      `CREATE INDEX IF NOT EXISTS idx_session_reports_pet_id ON session_reports(pet_id)`,
      `CREATE INDEX IF NOT EXISTS idx_locations_owner_id ON locations(owner_id)`,
      `CREATE INDEX IF NOT EXISTS idx_locations_pet_id ON locations(pet_id)`,
      `CREATE INDEX IF NOT EXISTS idx_photos_pet_id ON photos(pet_id)`,
      `CREATE INDEX IF NOT EXISTS idx_photos_care_session_id ON photos(care_session_id)`,
    ];

    const results = [];
    let hasErrors = false;

    try {
      for (const statement of statements) {
        try {
          await this.dataSource.query(statement);
          results.push({ statement: statement.substring(0, 50) + '...', status: 'success' });
        } catch (error) {
          // Ignore errors for IF NOT EXISTS statements (table/index already exists)
          if (error.message?.includes('already exists') || error.code === '42P07' || error.code === '42710') {
            results.push({ statement: statement.substring(0, 50) + '...', status: 'skipped (already exists)' });
          } else {
            hasErrors = true;
            results.push({ 
              statement: statement.substring(0, 50) + '...', 
              status: 'error', 
              error: error.message 
            });
            console.error('Error executing SQL:', error.message);
          }
        }
      }

      return {
        message: hasErrors ? 'Tables created with some errors' : 'Tables created successfully',
        success: !hasErrors,
        results,
      };
    } catch (error) {
      console.error('Fatal error creating tables:', error);
      return {
        message: 'Error creating tables',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        success: false,
      };
    }
  }

  async seedUsers() {
    const usersData = [
      // Admin
      { email: 'admin@example.com', password: '123456', role: 'admin', name: 'Administrador' },
      
      // Therapists
      { email: 'therapist1@example.com', password: '123456', role: 'therapist', name: 'Dr. María González' },
      { email: 'therapist2@example.com', password: '123456', role: 'therapist', name: 'Dr. Carlos Rodríguez' },
      { email: 'therapist3@example.com', password: '123456', role: 'therapist', name: 'Dra. Ana López' },
      
      // Patients
      { email: 'patient1@example.com', password: '123456', role: 'patient', name: 'Juan Pérez' },
      { email: 'patient2@example.com', password: '123456', role: 'patient', name: 'María Silva' },
      { email: 'patient3@example.com', password: '123456', role: 'patient', name: 'Pedro Martínez' },
      
      // Owners
      { email: 'owner1@example.com', password: '123456', role: 'owner', name: 'Roberto Fernández' },
      { email: 'owner2@example.com', password: '123456', role: 'owner', name: 'Carmen Vargas' },
      { email: 'owner3@example.com', password: '123456', role: 'owner', name: 'Diego Morales' },
      { email: 'owner4@example.com', password: '123456', role: 'owner', name: 'Patricia Herrera' },
      { email: 'owner5@example.com', password: '123456', role: 'owner', name: 'Francisco Torres' },
      
      // Sitters
      { email: 'sitter1@example.com', password: '123456', role: 'sitter', name: 'Laura Martínez' },
      { email: 'sitter2@example.com', password: '123456', role: 'sitter', name: 'Andrés Soto' },
      { email: 'sitter3@example.com', password: '123456', role: 'sitter', name: 'Isabella Ruiz' },
      { email: 'sitter4@example.com', password: '123456', role: 'sitter', name: 'Sebastián Castro' },
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      try {
        // Eliminar usuario existente si existe
        const existingUser = await this.usersService.findByEmail(userData.email);
        if (existingUser) {
          await this.dataSource.query(`DELETE FROM "user" WHERE email = $1`, [userData.email]);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        const user = await this.usersService.create({
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        });
        
        createdUsers.push({ id: user.id, email: user.email, role: user.role, name: userData.name });
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

  async seedCalendar() {
    try {
      // Obtener todos los pacientes existentes
      const allPatients = await this.patientService.findAll();
      
      if (allPatients.length === 0) {
        return {
          message: 'No patients found. Please seed patients first.',
          sessions: 0,
        };
      }
      
      const patientIds = allPatients.map(p => p.id);
      
      // Generar sesiones para diciembre
      const calendarSessions = generateCalendarSessionsForDecember(patientIds);
      
      const createdSessions = [];
      let errors = 0;
      
      // Crear las sesiones
      for (const sessionData of calendarSessions) {
        try {
          const session = await this.sessionsService.create(sessionData);
          createdSessions.push(session);
        } catch (error) {
          errors++;
          // Ignorar errores de duplicados (misma fecha/hora para mismo paciente)
          if (!error.message?.includes('duplicate') && !error.message?.includes('unique')) {
            console.error(`Error creating calendar session:`, error.message);
          }
        }
      }
      
      return {
        message: `Calendar sessions for December created successfully`,
        summary: {
          totalGenerated: calendarSessions.length,
          created: createdSessions.length,
          errors,
          patientsUsed: patientIds.length,
        },
      };
    } catch (error) {
      console.error('Error in seedCalendar:', error);
      throw error;
    }
  }

  async seedPets() {
    // Primero necesitamos usuarios con rol 'owner'
    const owners = await this.dataSource.query(
      `SELECT id FROM "user" WHERE role = 'owner' ORDER BY id`
    );

    if (owners.length === 0) {
      return {
        message: 'No owners found. Please create users with role "owner" first.',
        pets: 0,
      };
    }

    const petsData = [
      // Owner 1
      { name: 'Max', species: 'Perro', breed: 'Labrador Retriever', age: 3, ownerId: owners[0]?.id },
      { name: 'Luna', species: 'Gato', breed: 'Persa', age: 2, ownerId: owners[0]?.id },
      { name: 'Bobby', species: 'Perro', breed: 'Beagle', age: 1, ownerId: owners[0]?.id },
      
      // Owner 2
      { name: 'Rocky', species: 'Perro', breed: 'Bulldog Francés', age: 5, ownerId: owners[1]?.id || owners[0]?.id },
      { name: 'Mia', species: 'Gato', breed: 'Siamés', age: 1, ownerId: owners[1]?.id || owners[0]?.id },
      
      // Owner 3
      { name: 'Charlie', species: 'Perro', breed: 'Golden Retriever', age: 4, ownerId: owners[2]?.id || owners[0]?.id },
      { name: 'Simba', species: 'Gato', breed: 'Maine Coon', age: 2, ownerId: owners[2]?.id || owners[0]?.id },
      { name: 'Nala', species: 'Gato', breed: 'Maine Coon', age: 2, ownerId: owners[2]?.id || owners[0]?.id },
      
      // Owner 4
      { name: 'Bella', species: 'Perro', breed: 'Chihuahua', age: 6, ownerId: owners[3]?.id || owners[0]?.id },
      { name: 'Coco', species: 'Perro', breed: 'Poodle', age: 3, ownerId: owners[3]?.id || owners[0]?.id },
      
      // Owner 5
      { name: 'Oliver', species: 'Gato', breed: 'British Shorthair', age: 3, ownerId: owners[4]?.id || owners[0]?.id },
      { name: 'Daisy', species: 'Perro', breed: 'Dachshund', age: 4, ownerId: owners[4]?.id || owners[0]?.id },
      { name: 'Whiskers', species: 'Gato', breed: 'Ragdoll', age: 1, ownerId: owners[4]?.id || owners[0]?.id },
    ];

    const createdPets = [];
    for (const petData of petsData) {
      try {
        const result = await this.dataSource.query(
          `INSERT INTO pets (name, species, breed, age, owner_id) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING id, name, species, owner_id`,
          [petData.name, petData.species, petData.breed, petData.age, petData.ownerId]
        );
        createdPets.push(result[0]);
      } catch (error) {
        console.error(`Error creating pet ${petData.name}:`, error.message);
      }
    }

    return {
      message: 'Pets seeded successfully',
      pets: createdPets,
      total: createdPets.length,
    };
  }

  async seedCareSessions() {
    const pets = await this.dataSource.query(`SELECT id, name, owner_id FROM pets ORDER BY owner_id`);
    const sitters = await this.dataSource.query(
      `SELECT id FROM "user" WHERE role = 'sitter' ORDER BY id`
    );

    if (pets.length === 0 || sitters.length === 0) {
      return {
        message: 'No pets or sitters found. Please seed pets and create sitter users first.',
        sessions: 0,
      };
    }

    const createdSessions = [];
    const now = new Date();
    const statuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
    const hours = [8, 9, 10, 11, 14, 15, 16, 17, 18];

    // Crear sesiones para los próximos 30 días
    for (let day = 0; day < 30; day++) {
      const currentDate = new Date(now);
      currentDate.setDate(currentDate.getDate() + day);
      
      // Saltar domingos
      if (currentDate.getDay() === 0) continue;
      
      // Crear 2-4 sesiones por día
      const sessionsPerDay = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < sessionsPerDay && i < hours.length; i++) {
        const pet = pets[Math.floor(Math.random() * pets.length)];
        const sitter = sitters[Math.floor(Math.random() * sitters.length)];
        const hour = hours[Math.floor(Math.random() * hours.length)];
        
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + 2);

        // Para fechas pasadas, más probabilidad de 'completed'
        // Para fechas futuras, más probabilidad de 'scheduled'
        let status;
        if (day < 7) {
          status = Math.random() > 0.3 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)];
        } else if (day < 14) {
          status = statuses[Math.floor(Math.random() * statuses.length)];
        } else {
          status = Math.random() > 0.3 ? 'scheduled' : statuses[Math.floor(Math.random() * statuses.length)];
        }

        try {
          const result = await this.dataSource.query(
            `INSERT INTO care_sessions (pet_id, sitter_id, start_time, end_time, status, notes)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, pet_id, sitter_id, status`,
            [
              pet.id,
              sitter.id,
              startTime.toISOString(),
              endTime.toISOString(),
              status,
              `Sesión de cuidado para ${pet.name}. ${status === 'completed' ? 'Sesión completada exitosamente.' : 'Sesión programada.'}`,
            ]
          );
          createdSessions.push(result[0]);
        } catch (error) {
          // Ignorar errores de duplicados
          if (!error.message?.includes('duplicate') && !error.message?.includes('unique')) {
            console.error(`Error creating care session:`, error.message);
          }
        }
      }
    }

    return {
      message: 'Care sessions seeded successfully',
      sessions: createdSessions,
      total: createdSessions.length,
    };
  }

  async seedSessionReports() {
    const careSessions = await this.dataSource.query(
      `SELECT cs.id, cs.pet_id, cs.sitter_id, cs.start_time, p.name as pet_name
       FROM care_sessions cs
       JOIN pets p ON cs.pet_id = p.id
       WHERE cs.status = 'completed'
       ORDER BY cs.start_time DESC`
    );

    if (careSessions.length === 0) {
      return {
        message: 'No completed care sessions found. Please seed care sessions first.',
        reports: 0,
      };
    }

    const activities = [
      ['Juego con pelota', 'Paseo en el parque', 'Tiempo de descanso'],
      ['Alimentación', 'Juego interactivo', 'Cepillado'],
      ['Ejercicio físico', 'Socialización', 'Entrenamiento básico'],
      ['Tiempo de juego', 'Relajación', 'Observación de comportamiento'],
      ['Paseo largo', 'Juego de buscar', 'Tiempo de descanso'],
      ['Alimentación programada', 'Hidratación', 'Revisión de salud'],
    ];

    const moods = ['happy', 'calm', 'anxious', 'playful', 'tired'];
    const createdReports = [];

    // Crear reportes para todas las sesiones completadas (o al menos la mayoría)
    const sessionsToReport = careSessions.slice(0, Math.min(careSessions.length, 50));

    for (const session of sessionsToReport) {
      const activitySet = activities[Math.floor(Math.random() * activities.length)];
      const mood = moods[Math.floor(Math.random() * moods.length)];

      const feeding = Math.random() > 0.4 ? {
        time: `${8 + Math.floor(Math.random() * 10)}:00`,
        amount: `${100 + Math.floor(Math.random() * 200)}g`,
        foodType: ['Croquetas premium', 'Alimento húmedo', 'Dieta balanceada', 'Alimento especial'][Math.floor(Math.random() * 4)],
      } : null;

      const medication = Math.random() > 0.7 ? {
        time: `${8 + Math.floor(Math.random() * 4)}:00`,
        medication: ['Vitamina D', 'Probióticos', 'Suplemento de calcio', 'Medicamento prescrito'][Math.floor(Math.random() * 4)],
        dosage: ['1 tableta', '2 tabletas', '5ml', '1 dosis'][Math.floor(Math.random() * 4)],
      } : null;

      // Usar la fecha de la sesión como fecha del reporte
      const reportDate = session.start_time 
        ? new Date(session.start_time).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const notes = [
        `Reporte de sesión para ${session.pet_name}. Todo salió bien.`,
        `${session.pet_name} se mostró muy activo y colaborativo durante la sesión.`,
        `Sesión exitosa con ${session.pet_name}. Se cumplieron todos los objetivos.`,
        `${session.pet_name} disfrutó mucho de las actividades. Comportamiento excelente.`,
        `Reporte positivo para ${session.pet_name}. Sin incidencias.`,
      ][Math.floor(Math.random() * 5)];

      try {
        const result = await this.dataSource.query(
          `INSERT INTO session_reports (care_session_id, pet_id, sitter_id, report_date, activities, notes, mood, feeding, medication)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, care_session_id`,
          [
            session.id,
            session.pet_id,
            session.sitter_id,
            reportDate,
            activitySet,
            notes,
            mood,
            feeding ? JSON.stringify(feeding) : null,
            medication ? JSON.stringify(medication) : null,
          ]
        );
        createdReports.push(result[0]);
      } catch (error) {
        // Ignorar errores de duplicados
        if (!error.message?.includes('duplicate') && !error.message?.includes('unique')) {
          console.error(`Error creating session report:`, error.message);
        }
      }
    }

    return {
      message: 'Session reports seeded successfully',
      reports: createdReports,
      total: createdReports.length,
    };
  }

  async seedLocations() {
    const owners = await this.dataSource.query(
      `SELECT id, email FROM "user" WHERE role = 'owner' ORDER BY id`
    );
    const pets = await this.dataSource.query(`SELECT id, owner_id FROM pets ORDER BY owner_id`);

    if (owners.length === 0) {
      return {
        message: 'No owners found. Please create users with role "owner" first.',
        locations: 0,
      };
    }

    // Agrupar mascotas por owner
    const petsByOwner = {};
    for (const pet of pets) {
      if (!petsByOwner[pet.owner_id]) {
        petsByOwner[pet.owner_id] = [];
      }
      petsByOwner[pet.owner_id].push(pet);
    }

    const locationsData = [];
    
    // Crear ubicaciones para cada owner
    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      const ownerPets = petsByOwner[owner.id] || [];
      const ownerName = owner.email ? owner.email.split('@')[0] : `Owner${i + 1}`;
      
      // Casa principal (home)
      locationsData.push({
        name: `Casa de ${ownerName}`,
        address: `Av. Principal ${100 + i * 10}, Santiago`,
        lat: -33.4489 + (i * 0.01),
        lng: -70.6693 + (i * 0.01),
        type: 'home',
        ownerId: owner.id,
        petId: ownerPets[0]?.id || null,
      });
      
      // Veterinaria
      locationsData.push({
        name: `Veterinaria Favorita - Owner ${i + 1}`,
        address: `Av. Las Condes ${456 + i * 10}, Las Condes`,
        lat: -33.4167 + (i * 0.005),
        lng: -70.5833 + (i * 0.005),
        type: 'vet',
        ownerId: owner.id,
      });
      
      // Parque
      if (ownerPets.length > 0) {
        locationsData.push({
          name: `Parque Favorito - ${ownerPets[0]?.id ? 'Pet' : 'Owner'} ${i + 1}`,
          address: `Parque ${i + 1}, Santiago`,
          lat: -33.4000 + (i * 0.008),
          lng: -70.5500 + (i * 0.008),
          type: 'park',
          ownerId: owner.id,
          petId: ownerPets[0]?.id || null,
        });
      }
      
      // Peluquería (solo para algunos owners)
      if (i % 2 === 0) {
        locationsData.push({
          name: `Peluquería Canina ${i + 1}`,
          address: `Av. Vitacura ${2800 + i * 10}, Vitacura`,
          lat: -33.3833 + (i * 0.003),
          lng: -70.5333 + (i * 0.003),
          type: 'grooming',
          ownerId: owner.id,
        });
      }
    }

    const createdLocations = [];
    for (const locData of locationsData) {
      try {
        const result = await this.dataSource.query(
          `INSERT INTO locations (name, address, latitude, longitude, pet_id, owner_id, type, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, name, type, owner_id`,
          [
            locData.name,
            locData.address,
            locData.lat,
            locData.lng,
            locData.petId || null,
            locData.ownerId,
            locData.type,
            `Ubicación ${locData.type} para el owner ${locData.ownerId}`,
          ]
        );
        createdLocations.push(result[0]);
      } catch (error) {
        console.error(`Error creating location ${locData.name}:`, error.message);
      }
    }

    return {
      message: 'Locations seeded successfully',
      locations: createdLocations,
      total: createdLocations.length,
    };
  }

  async seedPhotos() {
    const pets = await this.dataSource.query(`SELECT id, name, owner_id FROM pets ORDER BY owner_id`);
    const careSessions = await this.dataSource.query(
      `SELECT id, pet_id FROM care_sessions ORDER BY start_time DESC LIMIT 20`
    );
    const sessionReports = await this.dataSource.query(
      `SELECT id, care_session_id FROM session_reports LIMIT 10`
    );
    const owners = await this.dataSource.query(`SELECT id FROM "user" WHERE role = 'owner' ORDER BY id`);
    const sitters = await this.dataSource.query(`SELECT id FROM "user" WHERE role = 'sitter' ORDER BY id`);

    if (pets.length === 0) {
      return {
        message: 'No pets found. Please seed pets first.',
        photos: 0,
      };
    }

    const photosData = [];
    const photoUrls = [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006',
      'https://images.unsplash.com/photo-1552053831-71594a27632d',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
      'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a',
    ];

    // Fotos de mascotas (subidas por owners)
    for (let i = 0; i < Math.min(pets.length, 10); i++) {
      const pet = pets[i];
      const owner = owners.find(o => o.id === pet.owner_id) || owners[0];
      
      photosData.push({
        url: `${photoUrls[i % photoUrls.length]}?w=800&h=600&fit=crop`,
        thumbnailUrl: `${photoUrls[i % photoUrls.length]}?w=200&h=200&fit=crop`,
        petId: pet.id,
        uploadedBy: owner.id,
        description: `Foto de ${pet.name}`,
        tags: ['mascota', 'perfil'],
      });
      
      // Segunda foto para algunas mascotas
      if (i % 2 === 0) {
        photosData.push({
          url: `${photoUrls[(i + 1) % photoUrls.length]}?w=800&h=600&fit=crop`,
          thumbnailUrl: `${photoUrls[(i + 1) % photoUrls.length]}?w=200&h=200&fit=crop`,
          petId: pet.id,
          uploadedBy: owner.id,
          description: `${pet.name} jugando`,
          tags: ['mascota', 'actividad'],
        });
      }
    }

    // Fotos de sesiones de cuidado (subidas por sitters)
    for (let i = 0; i < Math.min(careSessions.length, 15); i++) {
      const session = careSessions[i];
      const sitter = sitters[Math.floor(Math.random() * sitters.length)] || sitters[0];
      
      photosData.push({
        url: `${photoUrls[i % photoUrls.length]}?w=800&h=600&fit=crop`,
        thumbnailUrl: `${photoUrls[i % photoUrls.length]}?w=200&h=200&fit=crop`,
        careSessionId: session.id,
        uploadedBy: sitter.id,
        description: `Foto durante la sesión de cuidado`,
        tags: ['sesión', 'cuidado'],
      });
    }

    // Fotos de reportes de sesión
    for (let i = 0; i < Math.min(sessionReports.length, 8); i++) {
      const report = sessionReports[i];
      const sitter = sitters[Math.floor(Math.random() * sitters.length)] || sitters[0];
      
      photosData.push({
        url: `${photoUrls[i % photoUrls.length]}?w=800&h=600&fit=crop`,
        thumbnailUrl: `${photoUrls[i % photoUrls.length]}?w=200&h=200&fit=crop`,
        sessionReportId: report.id,
        uploadedBy: sitter.id,
        description: `Foto del reporte de sesión`,
        tags: ['reporte', 'sesión'],
      });
    }

    const createdPhotos = [];
    for (const photoData of photosData) {
      try {
        const result = await this.dataSource.query(
          `INSERT INTO photos (url, thumbnail_url, pet_id, care_session_id, session_report_id, uploaded_by, description, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id, url`,
          [
            photoData.url,
            photoData.thumbnailUrl || null,
            photoData.petId || null,
            photoData.careSessionId || null,
            photoData.sessionReportId || null,
            photoData.uploadedBy,
            photoData.description || null,
            photoData.tags || null,
          ]
        );
        createdPhotos.push(result[0]);
      } catch (error) {
        console.error(`Error creating photo:`, error.message);
      }
    }

    return {
      message: 'Photos seeded successfully',
      photos: createdPhotos,
      total: createdPhotos.length,
    };
  }

  async seedPetsData() {
    try {
      // Seed pets
      const petsResult = await this.seedPets();
      
      // Seed care sessions
      const sessionsResult = await this.seedCareSessions();
      
      // Seed session reports
      const reportsResult = await this.seedSessionReports();
      
      // Seed locations
      const locationsResult = await this.seedLocations();
      
      // Seed photos
      const photosResult = await this.seedPhotos();
      
      return {
        message: 'Pets data seeded successfully',
        pets: petsResult,
        careSessions: sessionsResult,
        sessionReports: reportsResult,
        locations: locationsResult,
        photos: photosResult,
      };
    } catch (error) {
      console.error('Error in seedPetsData:', error);
      throw error;
    }
  }

  async seedAll() {
    try {
      // First create tables
      const tablesResult = await this.createTables();
      
      if (!tablesResult.success) {
        throw new Error(`Failed to create tables: ${tablesResult.error || 'Unknown error'}`);
      }
      
      // Then seed users
      const usersResult = await this.seedUsers();
      
      // Seed therapy data
      const dataResult = await this.seedData();
      
      // Seed pets data
      const petsDataResult = await this.seedPetsData();
      
      return {
        message: 'Database initialized and seeded successfully',
        tables: tablesResult,
        users: usersResult,
        therapyData: dataResult,
        petsData: petsDataResult,
      };
    } catch (error) {
      console.error('Error in seedAll:', error);
      throw error;
    }
  }

  /**
   * Método completo que elimina todas las tablas, las recrea y seedea todos los datos
   * Útil para resetear completamente la base de datos desde cero
   */
  async seedComplete() {
    try {
      console.log('🗑️  Eliminando tablas existentes...');
      
      // Eliminar tablas en orden inverso (respetando dependencias de foreign keys)
      const dropStatements = [
        // Tablas de mascotas (dependen de user)
        'DROP TABLE IF EXISTS photos CASCADE',
        'DROP TABLE IF EXISTS session_reports CASCADE',
        'DROP TABLE IF EXISTS care_sessions CASCADE',
        'DROP TABLE IF EXISTS locations CASCADE',
        'DROP TABLE IF EXISTS pets CASCADE',
        
        // Tablas de terapia (dependen de user y patients)
        'DROP TABLE IF EXISTS emotion_analysis CASCADE',
        'DROP TABLE IF EXISTS emotion_log CASCADE',
        'DROP TABLE IF EXISTS transcriptions CASCADE',
        'DROP TABLE IF EXISTS sessions CASCADE',
        'DROP TABLE IF EXISTS patients CASCADE',
        
        // Tabla de usuarios (última, ya que otras dependen de ella)
        'DROP TABLE IF EXISTS "user" CASCADE',
      ];

      for (const statement of dropStatements) {
        try {
          await this.dataSource.query(statement);
          console.log(`✅ ${statement}`);
        } catch (error) {
          console.warn(`⚠️  Warning executing ${statement}:`, error.message);
        }
      }

      console.log('📦 Creando todas las tablas...');
      
      // Crear extensión UUID si no existe
      await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      
      // Crear todas las tablas
      const createStatements = [
        // Tabla de usuarios (primera, ya que otras dependen de ella)
        `CREATE TABLE "user" (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'therapist', 'owner', 'sitter', 'admin'))
        )`,
        
        // Tablas de terapia
        `CREATE TABLE patients (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          age INTEGER NOT NULL,
          gender VARCHAR(50) NOT NULL,
          contact_info TEXT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE sessions (
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
        )`,
        `CREATE TABLE transcriptions (
          id SERIAL PRIMARY KEY,
          session_id INTEGER UNIQUE NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_transcriptions_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE emotion_log (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL,
          text TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_emotion_log_user FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE emotion_analysis (
          id SERIAL PRIMARY KEY,
          "emotionLogId" INTEGER NOT NULL,
          "primaryEmotion" VARCHAR(255) NOT NULL,
          confidence DECIMAL(3, 2) NOT NULL,
          "analysisData" JSONB,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_emotion_analysis_log FOREIGN KEY ("emotionLogId") REFERENCES emotion_log(id) ON DELETE CASCADE
        )`,
        
        // Tablas de mascotas
        `CREATE TABLE pets (
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
        )`,
        `CREATE TABLE care_sessions (
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
        )`,
        `CREATE TABLE session_reports (
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
        )`,
        `CREATE TABLE locations (
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
        )`,
        `CREATE TABLE photos (
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
        )`,
      ];

      for (const statement of createStatements) {
        await this.dataSource.query(statement);
      }

      // Crear índices
      console.log('📇 Creando índices...');
      const indexStatements = [
        'CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_fecha_inicio ON sessions(fecha_inicio)',
        'CREATE INDEX IF NOT EXISTS idx_transcriptions_session_id ON transcriptions(session_id)',
        'CREATE INDEX IF NOT EXISTS idx_emotion_log_user_id ON emotion_log("userId")',
        'CREATE INDEX IF NOT EXISTS idx_emotion_analysis_log_id ON emotion_analysis("emotionLogId")',
        'CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id)',
        'CREATE INDEX IF NOT EXISTS idx_care_sessions_pet_id ON care_sessions(pet_id)',
        'CREATE INDEX IF NOT EXISTS idx_care_sessions_sitter_id ON care_sessions(sitter_id)',
        'CREATE INDEX IF NOT EXISTS idx_care_sessions_start_time ON care_sessions(start_time)',
        'CREATE INDEX IF NOT EXISTS idx_session_reports_care_session_id ON session_reports(care_session_id)',
        'CREATE INDEX IF NOT EXISTS idx_session_reports_pet_id ON session_reports(pet_id)',
        'CREATE INDEX IF NOT EXISTS idx_locations_owner_id ON locations(owner_id)',
        'CREATE INDEX IF NOT EXISTS idx_locations_pet_id ON locations(pet_id)',
        'CREATE INDEX IF NOT EXISTS idx_photos_pet_id ON photos(pet_id)',
        'CREATE INDEX IF NOT EXISTS idx_photos_care_session_id ON photos(care_session_id)',
      ];

      for (const statement of indexStatements) {
        await this.dataSource.query(statement);
      }

      console.log('👥 Seedando usuarios...');
      const usersResult = await this.seedUsers();
      
      console.log('🏥 Seedando datos de terapia...');
      const therapyDataResult = await this.seedData();
      
      console.log('🐾 Seedando datos de mascotas...');
      const petsDataResult = await this.seedPetsData();
      
      console.log('✅ ¡Base de datos inicializada completamente!');
      
      return {
        message: 'Database completely reset and seeded successfully',
        summary: {
          users: usersResult.total ?? (Array.isArray(usersResult.users) ? usersResult.users.length : 0),
          therapy: {
            patients: therapyDataResult.summary?.patients || 0,
            sessions: therapyDataResult.summary?.sessions || 0,
            transcriptions: therapyDataResult.summary?.transcriptions || 0,
          },
          pets: {
            pets: petsDataResult.pets?.total ?? (Array.isArray(petsDataResult.pets?.pets) ? petsDataResult.pets.pets.length : 0),
            careSessions: petsDataResult.careSessions?.total ?? (Array.isArray(petsDataResult.careSessions?.sessions) ? petsDataResult.careSessions.sessions.length : 0),
            sessionReports: petsDataResult.sessionReports?.total ?? (Array.isArray(petsDataResult.sessionReports?.reports) ? petsDataResult.sessionReports.reports.length : 0),
            locations: petsDataResult.locations?.total ?? (Array.isArray(petsDataResult.locations?.locations) ? petsDataResult.locations.locations.length : 0),
            photos: petsDataResult.photos?.total ?? (Array.isArray(petsDataResult.photos?.photos) ? petsDataResult.photos.photos.length : 0),
          },
        },
        details: {
          users: usersResult,
          therapyData: therapyDataResult,
          petsData: petsDataResult,
        },
      };
    } catch (error) {
      console.error('❌ Error in seedComplete:', error);
      throw error;
    }
  }
}

