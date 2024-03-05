import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "src/service/application/user.service";
import { GetUserResponse } from "./resources/response/get-user.response";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":userId")
  async getUser(@Param("userId") userId: string) {
    const user = await this.userService.getUser(userId);
    return new GetUserResponse(user.userId, user.username);
  }
}
