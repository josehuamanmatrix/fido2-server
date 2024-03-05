export class GetUserResponse {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly config?: UserConfig,
  ) {}
}

type UserConfig = {
  origin: string;
  factor: string;
};
