import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateSubscriptionDto {
    @ApiProperty({example: 'price_1ABC123...'})
    @IsNotEmpty()
    @IsString()
    priceId: string;
}