"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("@nestjs/mongoose");
const mongoose_3 = require("mongoose");
let AppModule = class AppModule {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async onModuleInit() {
        this.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });
        this.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        if (this.connection.readyState === 1) {
            console.log('✅ MongoDB is connected');
            console.log(`📊 Database: ${this.connection.name}`);
        }
        else {
            console.log('⏳ MongoDB connection state:', this.connection.readyState);
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
        ],
    }),
    __param(0, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_3.Connection])
], AppModule);
//# sourceMappingURL=app.module.js.map