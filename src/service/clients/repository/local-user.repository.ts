import { UserRepository } from "src/service/domain/clients/repository/user.repository";
import { User } from "src/service/domain/models/user";

export class LocalUserRepository implements UserRepository {
  private readonly users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(userId: string): Promise<User> {
    return this.users.get(userId);
  }

  async createUser(user: User): Promise<void> {
    this.users.set(user.userId, user);
  }

  async updateUser(userId: string, user: User): Promise<void> {
    this.users.set(userId, user);
  }
}
