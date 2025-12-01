import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingController } from './ping.controller';
import { User, Session, EmotionLog, EmotionAnalysis, Patient, Transcription } from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { PatientsModule } from './modules/patients/patients.module';
import { EmotionsModule } from './modules/emotions/emotions.module';
import { QueueModule } from './modules/queue/queue.module';
import { AiAnalysisModule } from './modules/ai-analysis/ai-analysis.module';
import { TranscriptionsModule } from './modules/transcriptions/transcriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', '1234'),
        database: configService.get('DB_DATABASE', 'theratrack'),
        synchronize: configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        entities: [User, Session, EmotionLog, EmotionAnalysis, Patient, Transcription],
      }),
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
  ],
  controllers: [AppController, PingController],
  providers: [AppService],
})
export class AppModule {}
