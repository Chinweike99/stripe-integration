import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { StripeModule } from "src/stripe/stripe.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => StripeModule), // ✅ wrap with forwardRef
  ],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService], // ✅ export both
})
export class UsersModule {}
