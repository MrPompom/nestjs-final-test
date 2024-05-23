import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.shema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async addUser(email: string): Promise<User> {
        if (!this.isEmail(email)) {
            throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
        }

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }
        const newUser = new this.userModel({ email });
        return newUser.save();
    }

    async getUser(email: string): Promise<User> {
        if (!this.isEmail(email)) {
            throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
        }
        const existingUser = await this.userModel.findOne({ email });
        
        if (!existingUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return existingUser;
    }

    async getUserById(userId: string): Promise<User> {
        return await this.userModel.findById(userId);
    }

    async resetData() {
        await this.userModel.deleteMany({});
    }

    private isEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}