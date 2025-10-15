import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService as NestJwtService} from "@nestjs/jwt";


@Injectable()
export class JwtService {
    constructor(
        private readonly jwtService: NestJwtService,
        private readonly configService: ConfigService
    ){}

    generateAccessToken(payload: any): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.secret'),
            expiresIn: this.configService.get('jwt.expiresIn')
        })
    }

    generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.secret'),
            expiresIn: '30d'
        })
    }

    verifyToken(token: string): string | any{
        return this.jwtService.verify(token, {
            secret: this.configService.get('jwt.secret')
        })
    }

}
