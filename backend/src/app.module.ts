// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { FeedModule } from './feed/feed.module';
// import { AuthModule } from './auth/auth.module';


// @Module({
//   //**configuration base de donnée postgres */
//   imports: [
//     ConfigModule.forRoot({ isGlobal : true}),
//     TypeOrmModule.forRoot({
//       type : 'postgres',
//       host : process.env.POSTGRES_HOST,
//       port :parseInt(<string>process.env.POSTGRES_PORT),
//       username: process.env.POSTGRES_USER,
//       password : process.env.POSTGRES_PASSWORD,
//       database : process.env.POSTGRES_DATABASE,
//       autoLoadEntities : true,
//       synchronize : true,    //ne doit pas être utilisé en prod , risque de perte de données
//     }),
//     FeedModule,
//     AuthModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './auth/controllers/models/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';  // Import de ServeStaticModule
import { join } from 'path';  // Import de join pour gérer les chemins

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Config globale pour les variables d'environnement
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,    // Ne pas utiliser en production sans précautions
    }),
    FeedModule,
    AuthModule,
    UserModule,
    // Configuration pour servir les fichiers statiques du dossier 'images'
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),  // Le chemin vers ton dossier 'images'
      serveRoot: '/images',  // URL d'accès aux images via HTTP
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
