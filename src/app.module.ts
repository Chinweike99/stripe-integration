// import { Module, OnModuleInit } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from '@nestjs/config';
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration.db";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { StripeModule } from "./stripe/stripe.module";
import { TransactionsModule } from "./transactions/transactions.module";



@Module({
  imports: [
    ConfigModule.forRoot({ //ConfigModule allows you to read .env variables (like database URI or JWT secret).
      isGlobal: true, 
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) =>( {
        uri: configService.get<string>('database.uri')
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService)=> ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn')}
      }),
      inject: [ConfigService],
      global: true
    }),
    AuthModule,
    UsersModule,
    StripeModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule{}