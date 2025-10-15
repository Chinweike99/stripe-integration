import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2'


@Injectable()
export class PasswordService{
    async hashPassword(password: string): Promise<string>{
        return argon2.hash(password);
    }

    async verifyPassword(hashedPassword: string, password: string): Promise<boolean>{
        return argon2.verify(hashedPassword, password)
    }
}