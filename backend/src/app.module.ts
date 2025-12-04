import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // --- DATABASE CONFIGURATION ---
    // We use TypeOrmModule.forRoot to connect to our PostgreSQL database
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Since our database is running on Docker, we connect to localhost:5432
      // In Docker Compose, the API service will connect to 'db' instead of 'localhost'
      host: 'localhost', 
      port: 5432,
      username: 'wallet_user',
      password: 'supersecurepassword', // Match the password from docker-compose.yml
      database: 'wallet_db',
      
      // We will discover entity files automatically
      autoLoadEntities: true, 

      // WARNING: synchronize: true should ONLY be used in development. 
      // It automatically creates tables. For production, we will use migrations.
      synchronize: true, 
      
      logging: true, // See the SQL queries in the console
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}