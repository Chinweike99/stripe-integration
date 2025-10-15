import { ApiProperty } from "@nestjs/swagger";


export class AuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}