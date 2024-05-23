import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
    @Prop({ required: true, unique: false })
    name: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    priority: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);