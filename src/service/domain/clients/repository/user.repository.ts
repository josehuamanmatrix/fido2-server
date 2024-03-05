import { User } from "../../models/user";

export interface UserRepository {
  getUser(userId: string): Promise<User>;
  createUser(user: User): Promise<void>;
  updateUser(userId: string, user: User): Promise<void>;
}
