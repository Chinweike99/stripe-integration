import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserService } from "../services/user.service";
import { GetUser } from "src/common/decorators/get-user.decorator";



@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get('profile')
    @ApiOperation({summary: 'Get user profile'})
    @ApiResponse({status: 200, description: 'User profile retrieved successfully'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    async getProfile(@GetUser() user: any){
        return this.userService.getUserProfile(user.id)
    }


    @Get('me')
    @ApiOperation({summary: 'Get current user info'})
    @ApiResponse({status: 200, description: 'User Info retireved successfully'})
    async getCurrentUser(@GetUser() user: any){
        return user;
    }
}