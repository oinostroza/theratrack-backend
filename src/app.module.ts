import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingController } from './ping.controller';
import { 
  User, 
  Session, 
  EmotionLog, 
  EmotionAnalysis, 
  Patient, 
  Transcription,
  Pet,
  CareSession,
  SessionReport,
  Location,
  Photo
} from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PatientsModule } from './modules/patients/patients.module';
import { EmotionsModule } from './modules/emotions/emotions.module';
import { QueueModule } from './modules/queue/queue.module';
import { AiAnalysisModule } from './modules/ai-analysis/ai-analysis.module';
import { TranscriptionsModule } from './modules/transcriptions/transcriptions.module';
import { SeedModule } from './modules/seed/seed.module';
import { PetsModule } from './modules/pets/pets.module';
import { CareSessionsModule } from './modules/care-sessions/care-sessions.module';
import { SessionReportsModule } from './modules/session-reports/session-reports.module';
import { LocationsModule } from './modules/locations/locations.module';
import { PhotosModule } from './modules/photos/photos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        // Handle DATABASE_URL if provided (common in Render, Heroku, etc.)
        const databaseUrl = configService.get('DATABASE_URL');
        if (databaseUrl) {
          const dbUrl = new URL(databaseUrl);
          return {
            type: 'postgres',
            host: dbUrl.hostname,
            port: parseInt(dbUrl.port),
            username: dbUrl.username,
            password: dbUrl.password,
            database: dbUrl.pathname.slice(1),
            synchronize: !isProduction,
            autoLoadEntities: true,
            entities: [
              User, 
              Session, 
              EmotionLog, 
              EmotionAnalysis, 
              Patient, 
              Transcription,
              Pet,
              CareSession,
              SessionReport,
              Location,
              Photo
            ],
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          };
        }
        
        // Use individual environment variables
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', '1234'),
          database: configService.get('DB_DATABASE', 'theratrack'),
          synchronize: !isProduction,
          autoLoadEntities: true,
          entities: [
              User, 
              Session, 
              EmotionLog, 
              EmotionAnalysis, 
              Patient, 
              Transcription,
              Pet,
              CareSession,
              SessionReport,
              Location,
              Photo
            ],
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    SessionsModule,
    PatientsModule,
    EmotionsModule,
    QueueModule,
    AiAnalysisModule,
    TranscriptionsModule,
    SeedModule,
    PetsModule,
    CareSessionsModule,
    SessionReportsModule,
    LocationsModule,
    PhotosModule,
  ],
  controllers: [AppController, PingController],
  providers: [AppService],
})
export class AppModule {}
