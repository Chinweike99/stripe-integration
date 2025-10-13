import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    this.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });
    
    this.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    // Check current connection state
    if (this.connection.readyState === 1) {
      console.log('✅ MongoDB is connected');
      console.log(`📊 Database: ${this.connection.name}`);
    } else {
      console.log('⏳ MongoDB connection state:', this.connection.readyState);
    }
  }
}