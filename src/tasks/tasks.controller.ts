import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import type { JwtPayload } from 'src/types/jwt-payload.type';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ResponseMessage } from 'src/common/decorators/message-response.decorator';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET /api/tasks
  @ApiOperation({ summary: 'Get all tasks for current user' })
  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    return this.tasksService.findTasksUser(user.sub);
  }

  // POST /api/tasks
  @ResponseMessage('Create successfully!')
  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() createTasks: CreateTaskDto,
  ) {
    return this.tasksService.createTitle(user.sub, createTasks);
  }

  // PATCH /api/tasks/:id
  @ResponseMessage('Update successfully!')
  @ApiOperation({ summary: 'Updata task' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() createTasks: CreateTaskDto,
  ) {
    return this.tasksService.update(id, user.sub, createTasks);
  }

  // DELETE /api/tasks/:id
  @ResponseMessage('Delete successfully!')
  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':id')
  async delete(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.tasksService.delete(id, user.sub);
  }
}
