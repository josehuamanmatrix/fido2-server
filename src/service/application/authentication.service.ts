import { Inject, Injectable } from "@nestjs/common";
import { TYPES } from "src/common/types";
import { PasskeyClient } from "../domain/clients/passkey/passkey.client";
import { UserRepository } from "../domain/clients/repository/user.repository";

import { v4 as uuid } from "uuid";
import { ConfigService } from "@nestjs/config";

import { JwtService } from "@nestjs/jwt";

import { CreateRegisterChallenge } from "./resources/create-register-challenge";

import { ConfirmRegisterChallenge } from "./resources/confirm-register-challenge";
import { CreateAuthChallenge } from "./resources/create-auth-challenge";
import { KeyRegisterConfirm } from "../domain/models/key-register-confirm";
import { KeyAuthConfirm } from "../domain/models/key-auth-confirm";

type CreateUserInput = {
  username: string;
};
@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(TYPES.PasskeyClientType) private readonly passkeyClient: PasskeyClient,
    @Inject(TYPES.LocalUserRepository) private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createRegisterChallenge(userId: string): Promise<CreateRegisterChallenge> {
    const user = await this.userRepository.getUser(userId);

    const registerChallenge = await this.passkeyClient.createRegisterChallenge(user.userId, user.username);

    const challengeToken = this.jwtService.sign({
      challenge: registerChallenge.challenge,
      base64UserId: registerChallenge.user.id,
    });

    await this.userRepository.updateUser(user.userId, {
      userId: user.userId,
      username: user.username,
      authenticators: user.authenticators,
    });

    return {
      challengeToken,
      user: {
        name: registerChallenge.user.name,
        displayName: registerChallenge.user.displayName,
      },
      pubKeyCredParams: registerChallenge.pubKeyCredParams,
      rp: registerChallenge.rp,
      timeout: registerChallenge.timeout,
      attestation: registerChallenge.attestation,
      authenticatorSelection: registerChallenge.authenticatorSelection,
      excludeCredentials: registerChallenge.excludeCredentials,
      extensions: registerChallenge.extensions,
    };
  }

  async confirmRegisterChallenge(
    challengeToken: string,
    keyRegisterConfirm: KeyRegisterConfirm,
  ): Promise<ConfirmRegisterChallenge> {
    const { challenge, base64UserId } = this.jwtService.verify(challengeToken);

    const userId = Buffer.from(base64UserId, "base64").toString("utf-8");
    const user = await this.userRepository.getUser(userId);

    const keyRegisterResult = await this.passkeyClient.confirmRegisterChallenge(challenge, keyRegisterConfirm);

    user.authenticators.push({
      publicKey: keyRegisterResult.publicKey,
      counter: keyRegisterResult.counter,
      credential: keyRegisterResult.credentials,
    });

    await this.userRepository.updateUser(userId, {
      ...user,
      authenticators: user.authenticators,
    });

    return {
      publicKey: keyRegisterResult.publicKey,
      counter: keyRegisterResult.counter,
      credentials: keyRegisterResult.credentials,
    };
  }

  async createAuthChallenge(userId: string): Promise<CreateAuthChallenge> {
    const keyAuthOptions = await this.passkeyClient.createAuthChallenge();

    const user = await this.userRepository.getUser(userId);

    const allowCredentials = user.authenticators.map((authenticator) => ({
      id: authenticator.credential,
      type: "public-key",
    }));

    const challengeToken = this.jwtService.sign({
      challenge: keyAuthOptions.challenge,
      base64UserId: Buffer.from(userId).toString("base64"),
    });

    return {
      challengeToken,
      timeout: keyAuthOptions.timeout,
      rpId: keyAuthOptions.rpId,
      attestation: keyAuthOptions.attestation,
      userVerification: keyAuthOptions.userVerification,
      rawChallenge: keyAuthOptions.rawChallenge,
      extensions: keyAuthOptions.extensions,
      allowCredentials,
    };
  }

  async confirmAuthChallenge(challengeToken: string, keyAuthConfirm: KeyAuthConfirm) {
    const { challenge, base64UserId } = this.jwtService.verify(challengeToken);

    const userId = Buffer.from(base64UserId, "base64").toString("utf-8");
    const user = await this.userRepository.getUser(userId);

    const authenticator = user.authenticators.find(
      (authenticator) => authenticator.credential === keyAuthConfirm.rawId,
    );

    await this.passkeyClient.confirmAuthChallenge(challenge, keyAuthConfirm, authenticator);
  }

  register(createUserInput: CreateUserInput) {
    const userId = uuid();
    this.userRepository.createUser({ userId, username: createUserInput.username, authenticators: [] });
    return userId;
  }
}
