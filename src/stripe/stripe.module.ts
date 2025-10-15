import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { StripeService } from "./services/stripe.service";



@Module({
    imports: [ConfigModule, UsersModule],
    providers: [StripeService],
    controllers: [StripeController],
    exports: [StripeService]
})
export class StriprModule{}