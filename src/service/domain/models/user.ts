import { KeyAuthenticator } from "src/service/domain/models/key-authenticator";

export type User = {
  userId: string;
  username: string;
  authenticators: KeyAuthenticator[];
};
