import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class RegisterDto {
    @ApiProperty({ example: 'John Doe'})
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'john@example.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: 'password123', minLength: 6})
    @IsNotEmpty()
    @MinLength(6)
    password: string;

}