import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { StripeService } from "src/stripe/services/stripe.service";


@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly stripeService: StripeService
    ){}

    async getUserByEmail(email: string){
        return this.userRepository.findByEmail(email)
    }

    async createUserWithStripe(userData: Partial<any>){
        const stripeCustomerId = await this.stripeService.createCustomer(
            userData.email,
            userData.name
        );

        return this.userRepository.create({
            ...userData, stripeCustomerId
        })
    }

    async getUserProfile(userId: string){
        const user = await this.userRepository.findById(userId);
        if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: (user as any)._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      stripeCustomerId: user.stripeCustomerId,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
      createdAt: user['createdAt'],
      updatedAt: user['updatedAt'],
    };
    }

    async updateStripeCustomerId(userId: string, stripeCustomerId: string){
        return this.userRepository.update(userId, { stripeCustomerId })
    }

    async updateLastLogin(userId: string){
        return this.userRepository.update(userId, {lastLogin: new Date()})
    }

    async updateRefreshToken(userId: string, refreshToken: string){
        return this.userRepository.updateRefreshToken(userId, refreshToken)
    }

    async updateStripeCustomerIn(userId: string, stripeCustomerId: string){
        return this.userRepository.update(userId, {stripeCustomerId});
    }

}