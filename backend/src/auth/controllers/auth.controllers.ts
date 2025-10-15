import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { AuthResponseDto } from "../dto/auth-response.dto";
import { RegisterDto } from "../dto/registration.dto";
import { LoginDto } from "../dto/login.dto";



@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user'})
    @ApiResponse({
        status: 201,
        description: "User successfully registered",
        type: AuthResponseDto
    })
    @ApiResponse({status: 409, description: "User already exists"})
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Login User'})
    @ApiResponse({
        status: 200,
        description: "User successfully logged in",
        type: AuthResponseDto
    })
    @ApiResponse({status: 401, description: "Invalid credentials"})
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto>{
        return this.authService.login(loginDto)
    }
}