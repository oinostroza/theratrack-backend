import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PatientsService } from '../src/modules/patients/patients.service';
import { SessionsService } from '../src/modules/sessions/sessions.service';
import { TranscriptionsService } from '../src/modules/transcriptions/transcriptions.service';

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

interface TranscriptionData {
  sessionId: number;
  contenido: string;
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
    
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
    
    // Generate 2 sessions per week (every 3-4 days)
    if (day % 3 === 0 || day % 4 === 0) {
      let attempts = 0;
      let sessionTime;
      
      // Find an available time slot
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
          pagado: Math.random() > 0.5 // 50% pagadas
        });
      }
    }
  }
  
  return sessions;
}

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const patientService = app.get(PatientsService);
  const sessionsService = app.get(SessionsService);
  const transcriptionsService = app.get(TranscriptionsService);
  
  console.log('🌱 Iniciando inserción de datos de ejemplo...');
  
  try {
    // Insert patients
    console.log('📝 Insertando pacientes...');
    const createdPatients = [];
    
    for (const patientData of patientsData) {
      const patient = await patientService.create(patientData);
      createdPatients.push(patient);
      console.log(`✅ Paciente creado: ${patient.fullName} (ID: ${patient.id})`);
    }
    
    // Generate sessions for each patient
    console.log('📅 Generando sesiones...');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Start 30 days ago
    
    const allSessions = [];
    
    for (const patient of createdPatients) {
      const patientSessions = generateSessionsForPatient(patient.id, startDate);
      
      for (const sessionData of patientSessions) {
        const session = await sessionsService.create(sessionData);
        allSessions.push(session);
        console.log(`✅ Sesión creada: ${patient.fullName} - ${session.conceptoPrincipal} (ID: ${session.id})`);
      }
    }
    
    // Generate transcriptions for 60% of sessions
    console.log('📄 Generando transcripciones...');
    const sessionsForTranscription = allSessions.filter(() => Math.random() < 0.6);
    
    for (const session of sessionsForTranscription) {
      const patient = createdPatients.find(p => p.id === session.patientId);
      const transcriptionContent = generateTranscriptionContent(patient?.fullName || 'Paciente', session.conceptoPrincipal);
      
      const transcriptionData = {
        sessionId: session.id,
        content: transcriptionContent
      };
      
      const transcription = await transcriptionsService.create(transcriptionData);
      console.log(`✅ Transcripción creada para sesión ${session.id} (ID: ${transcription.id})`);
    }
    
    console.log('\n🎉 ¡Datos de ejemplo insertados exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${createdPatients.length} pacientes creados`);
    console.log(`   - ${allSessions.length} sesiones generadas`);
    console.log(`   - ${sessionsForTranscription.length} transcripciones creadas`);
    
  } catch (error) {
    console.error('❌ Error durante la inserción de datos:', error);
  } finally {
    await app.close();
  }
}

// Run the seed function
seedData().catch(console.error); 