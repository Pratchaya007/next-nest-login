import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Find User All in Title
  async findTasksUser(userId: string) {
    return this.prisma.tasks.findMany({
      where: { userId },
    });
  }

  // Create Title
  async createTitle(userId: string, createTasks: CreateTaskDto) {
    return this.prisma.tasks.create({
      data: { userId, ...createTasks },
    });
  }

  async update(id: string, userId: string, data: Partial<CreateTaskDto>) {
    const tasks = await this.prisma.tasks.findFirst({ where: { id } });
    if (!tasks) throw new NotFoundException('Task not found');

    if (tasks.userId !== userId)
      throw new ForbiddenException('You do not own this task');

    const updateTask = await this.prisma.tasks.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return updateTask;
  }

  async delete(id: string, userId: string) {
    const task = await this.prisma.tasks.findFirst({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId)
      throw new ForbiddenException('You do not own this task');

    await this.prisma.tasks.delete({
      where: { id },
    });
  }
}
