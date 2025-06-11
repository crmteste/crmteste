import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User, Role } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() body: { name: string; email: string; password: string; role: Role }): Promise<User> {
    return this.userService.createUser(body);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
