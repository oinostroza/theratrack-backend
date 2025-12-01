import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import * as bcrypt from 'bcrypt';

const usersData = [
  {
    email: 'patient1@example.com',
    password: '123456',
    role: 'patient',
  },
  {
    email: 'patient2@example.com',
    password: '123456',
    role: 'patient',
  },
  {
    email: 'therapist1@example.com',
    password: '123456',
    role: 'therapist',
  },
  {
    email: 'therapist2@example.com',
    password: '123456',
    role: 'therapist',
  },
  {
    email: 'admin@example.com',
    password: '123456',
    role: 'therapist',
  },
];

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  
  console.log('👤 Iniciando creación de usuarios...');
  
  try {
    const createdUsers = [];
    
    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await usersService.findByEmail(userData.email);
      
      if (existingUser) {
        console.log(`⚠️  Usuario ya existe: ${userData.email}`);
        continue;
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Create user with hashed password
      const user = await usersService.create({
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });
      
      createdUsers.push({
        id: user.id,
        email: user.email,
        role: user.role,
        password: userData.password, // Show plain password for reference
      });
      
      console.log(`✅ Usuario creado: ${user.email} (ID: ${user.id}, Role: ${user.role})`);
    }
    
    console.log('\n🎉 ¡Usuarios creados exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('═══════════════════════════════════════════════════════════');
    
    createdUsers.forEach((user) => {
      console.log(`\n📧 Email: ${user.email}`);
      console.log(`🔑 Contraseña: ${user.password}`);
      console.log(`👤 Rol: ${user.role}`);
    });
    
    console.log('\n═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error durante la creación de usuarios:', error);
  } finally {
    await app.close();
  }
}

// Run the seed function
seedUsers().catch(console.error);

