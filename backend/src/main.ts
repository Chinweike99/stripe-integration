import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, urlencoded, raw } from "express"; 
import cors from 'cors';

async function main() {
  const app = await NestFactory.create(AppModule);

  // Stripe webhook must receive the *raw body*, not parsed JSON
    app.use('/stripe/webhook', raw({ type: 'application/json' }), (req: any, _res, next) => {
    req.rawBody = req.body;
    next();
  });

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(
  cors({
    origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:3001' ], 
    credentials: true
  })
);


  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("NestJs Stripe Auth API")
    .setDescription("Authentication system with stripe integration")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(4000);
  console.log("🚀 Application is running on: http://localhost:4000");
  console.log("📘 Swagger documentation: http://localhost:4000/api");
}

main();
