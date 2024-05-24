import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.shema';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        private readonly userService: UserService
    ) {}

    async addTask(
        name: string,
        userId: string,
        priority: number,
    ): Promise<Task> {
        if (!name || !userId || priority <= 0) {
            throw new HttpException(
                'Invalid task data',
                HttpStatus.BAD_REQUEST,
            );
        }
        const newTask = new this.taskModel({ name, userId, priority });

        return newTask.save();
    }

    async getTaskByName(name: string): Promise<Task> {
        const payload = await this.taskModel.findOne({ name }).exec();
        if (!payload) {
            throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        }
        return payload
    }

    async getUserTasks(userId: string): Promise<Task[] | null> {
        try {
            await this.userService.getUserById(userId);
    
            const response = await this.taskModel.find({ userId }).exec();
    
            const userTasks = response.map((task) => ({
                id: task.id,
                name: task.name,
                userId: task.userId,
                priority: task.priority,
            }));
            return userTasks;
        } catch (error) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
    }
    

    async resetData() {
        await this.taskModel.deleteMany({});
    }
}