import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


async function main(){
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true}))

  //swagger configuration
  const config = new DocumentBuilder()
    .setTitle("NestJs Stripe Auth API")
    .setDescription('Authentication system with stripe integration')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(4000);
    console.log('Application is running on: http://localhost:4000');
    console.log('Swagger documentation: http://localhost:4000/api');

}
main();