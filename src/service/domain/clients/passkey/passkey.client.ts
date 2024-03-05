import { KeyAuthChallenge } from "src/service/domain/models/key-auth-challenge";
import { KeyRegisterConfirm } from "src/service/domain/models/key-register-confirm";
import { KeyRegisterChallenge } from "src/service/domain/models/key-register-challenge";
import { KeyRegisterResult } from "src/service/domain/models/key-register-result";
import { KeyAuthenticator } from "src/service/domain/models/key-authenticator";
import { KeyAuthConfirm } from "src/service/domain/models/key-auth-confirm";

export interface PasskeyClient {
  createRegisterChallenge(userId: string, username: string): Promise<KeyRegisterChallenge>;
  confirmRegisterChallenge(challenge: string, keyRegisterConfirm: KeyRegisterConfirm): Promise<KeyRegisterResult>;
  createAuthChallenge(): Promise<KeyAuthChallenge>;
  confirmAuthChallenge(
    challenge: string,
    keyAuthConfirm: KeyAuthConfirm,
    keyAuthenticator: KeyAuthenticator,
  ): Promise<void>;
}
