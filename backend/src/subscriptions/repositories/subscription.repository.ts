import { Injectable } from "@nestjs/common";
import { IRepository } from "src/common/interfaces/repository.interface";
import { Subscription, SubscriptionDocument, SubscriptionStatus } from "../entities/subscription.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";



@Injectable()
export class SubscriptionRepository implements IRepository<Subscription> {
    constructor(
        @InjectModel(Subscription.name) private readonly subscriptionModel: Model<SubscriptionDocument>
    ){}

    async create(entity: Partial<Subscription>): Promise<Subscription>{
        const subscription = new this.subscriptionModel(entity);
        return subscription.save()
    }

    async findById(id: string): Promise<Subscription | null>{
        return this.subscriptionModel.findById(id).populate('userId', 'name email').exec()
    }

    async findOne(filter: any): Promise<Subscription | null>{
        return this.subscriptionModel.findOne(filter).populate('userId', 'name email').exec();
    }

    async findAll(filter?: any): Promise<Subscription[]>{
        return this.subscriptionModel.find(filter || {}).populate('userId', 'name email').exec()
    }

    async update(id: string, entity: Partial<Subscription>): Promise<Subscription | null> {
    return this.subscriptionModel
      .findByIdAndUpdate(id, entity, { new: true })
      .populate('userId', 'name email')
      .exec();
  }
    async delete(id: string): Promise<boolean> {
    const result = await this.subscriptionModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

   // Custom methods
  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionModel
      .find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStripeSubscriptionId(stripeSubscriptionId: string): Promise<Subscription | null>{
    return this.subscriptionModel.findOne({stripeSubscriptionId}).populate('userId', 'name email').exec()
  }

  async updateStatus(subscriptionId: string, status: SubscriptionStatus): Promise<Subscription | null>{
    return this.subscriptionModel.findByIdAndUpdate(subscriptionId, {status}, {new: true}).exec();
  }

    async findActiveSubscription(userId: string): Promise<Subscription | null>{
        return this.subscriptionModel.findOne({
            userId,
            status: {$in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]}
        })
    }

}
