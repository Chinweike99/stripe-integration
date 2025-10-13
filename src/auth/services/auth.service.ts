import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "src/common/services/jwt.service";
import { PasswordService } from "src/common/services/password.services";
import { UserRepository } from "src/users/repositories/user.repository";
import { RegisterDto } from "../dto/registration.dto";
import { AuthResponseDto } from "../dto/auth-response.dto";
import { User } from "src/users/entities/user.entity";
import { LoginDto } from "../dto/login.dto";



@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService
    ){}


    async register(registerDto: RegisterDto): Promise<AuthResponseDto>{
        const {email, name, password} = registerDto
        const userExists = await this.userRepository.findByEmail(email);
        if(userExists){
            throw new ConflictException("User Already Existss with this email")
        }

        const hashedPassword = await this.passwordService.hashPassword(password);

        const createUser = await this.userRepository.create({
            name, email, password: hashedPassword
        });

        const tokens = await this.generateToken(createUser)
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: (createUser as any)._id.toString(),
                name: createUser.name,
                email: createUser.email,
                role: createUser.role,
            }
        }
    }


    async login(loginDto: LoginDto): Promise<AuthResponseDto>{
        const {email, password} = loginDto;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
        throw new UnauthorizedException('Invalid credentials');
        }
        
        const isPasswordValid = await this.passwordService.verifyPassword(user.password, password);
        if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
        }

        await this.userRepository.update((user as any)._id.toString(), {
            lastLogin: new Date()
        })

        const tokens = await this.generateToken(user);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: (user as any)._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }
    }


    private async generateToken(user: any){
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role
        }

        const accessToken = this.jwtService.generateAccessToken(payload);
        const refreshToken = this.jwtService.generateRefreshToken(payload);

        // Store the refreshtoken in the database
        await this.userRepository.updateRefreshToken(
            user._id.toString(),
            refreshToken
        )
        return { accessToken, refreshToken}
    }

}
