import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interface';
import { User, UserDocument } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRpository implements IRepository<User> {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ){}

    async create(entity: Partial<User>): Promise<User>{
        const user = new this.userModel(entity);
        return user.save()
    }

    async findById(id: string): Promise<User |null>{
        return this.userModel.findById(id).exec()
    }

    async findOne(filter: any): Promise<User | null>{
        return this.userModel.findOne(filter).exec();
    }

    async findAll(filter?: any): Promise<User[]>{
        return this.userModel.find(filter || {}).exec();
    }

    async update(id: string, entity: Partial<User>): Promise<User | null>{
        return this.userModel.findByIdAndUpdate(id, entity, {new: true}).exec()
    }

    async delete(id: string): Promise<boolean>{
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return result !== null
    }

    async findByEmail(email: string): Promise<User | null>{
        return this.userModel.findOne({email}).exec()
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<User | null>{
        return this.userModel.findByIdAndUpdate(userId, {refreshToken}, {new: true}).exec()
    }

}
