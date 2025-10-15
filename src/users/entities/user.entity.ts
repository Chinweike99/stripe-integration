import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true})
export class User {
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({ required: true })
    password: string;


    @Prop({default: 'user'})
    role: string;

    @Prop({default: false})
    isEmailVerified: boolean;

    @Prop()
    stripeCustomerId?: string;

    @Prop()
    refreshToken?: string;

    @Prop()
    lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);