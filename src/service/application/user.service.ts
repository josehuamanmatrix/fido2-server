import { Inject } from "@nestjs/common";
import { TYPES } from "src/common/types";
import { UserRepository } from "../domain/clients/repository/user.repository";

export class UserService {
  constructor(@Inject(TYPES.LocalUserRepository) private readonly userRepository: UserRepository) {}

  async getUser(userId: string) {
    return this.userRepository.getUser(userId);
  }
}
