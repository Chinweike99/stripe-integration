import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { StripeModule } from "src/stripe/stripe.module";
import { UserController } from "./controllers/user.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => StripeModule), 
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UsersModule {}
