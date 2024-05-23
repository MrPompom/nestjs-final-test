import {
    HttpException,
    HttpStatus,
    Injectable,
    NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.shema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
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

    async getUserTasks(userId: string): Promise<Task[]> {
        return await this.taskModel.find({ userId }).exec();
    }

    async resetData() {
        await this.taskModel.deleteMany({});
    }
}