"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
async function main() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use('/stripe/webhook', (0, express_1.raw)({ type: 'application/json' }), (req, _res, next) => {
        req.rawBody = req.body;
        next();
    });
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("NestJs Stripe Auth API")
        .setDescription("Authentication system with stripe integration")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(4000);
    console.log("🚀 Application is running on: http://localhost:4000");
    console.log("📘 Swagger documentation: http://localhost:4000/api");
}
main();
//# sourceMappingURL=main.js.map