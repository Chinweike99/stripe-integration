import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "src/users/repositories/user.repository";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.secret')!
        });
    }

    async validate(payload: any){
        const user = await this.userRepository.findById(payload.sub);
        if(!user){
            throw new UnauthorizedException('User not found')
        }
        return {
            id: (user as any)._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
        }
    }


}