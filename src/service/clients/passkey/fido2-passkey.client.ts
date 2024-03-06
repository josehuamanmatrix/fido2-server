import { decode, encode } from "base64-arraybuffer";
import { Fido2Lib } from "fido2-lib";
import { PasskeyClient } from "src/service/domain/clients/passkey/passkey.client";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { KeyAuthChallenge } from "../../domain/models/key-auth-challenge";
import { KeyConfig } from "../../domain/models/key-config";
import { KeyRegisterConfirm } from "../../domain/models/key-register-confirm";
import { KeyRegisterChallenge } from "../../domain/models/key-register-challenge";
import { KeyRegisterResult } from "../../domain/models/key-register-result";
import { KeyAuthenticator } from "../../domain/models/key-authenticator";
import { KeyAuthConfirm } from "../../domain/models/key-auth-confirm";

@Injectable()
export class Fido2PasskeyClient implements PasskeyClient {
  private readonly f2l: Fido2Lib;
  private readonly keyConfig: KeyConfig;
  private readonly rpId: string;

  constructor(configService: ConfigService) {
    this.rpId = configService.get<string>("RP_ID");

    this.keyConfig = {
      factor: "first",
      origin: configService.get<string>("ORIGIN"),
    };

    this.f2l = new Fido2Lib({
      timeout: 50,
      rpId: this.rpId,
      rpName: configService.get<string>("RP_NAME"),
      challengeSize: 128,
      attestation: "none",
      cryptoParams: [-7, -257],
      authenticatorAttachment: "platform",
      authenticatorRequireResidentKey: true,
      authenticatorUserVerification: "required",
    });
  }

  async confirmAuthChallenge(
    challenge: string,
    keyAuthConfirm: KeyAuthConfirm,
    keyAuthenticator: KeyAuthenticator,
  ): Promise<void> {
    const assertionResult = await this.f2l.assertionResult(
      {
        id: decode(keyAuthConfirm.id),
        rawId: decode(keyAuthConfirm.rawId),
        response: {
          clientDataJSON: keyAuthConfirm.response.clientDataJSON,
          authenticatorData: decode(keyAuthConfirm.response.authenticatorData),
          signature: keyAuthConfirm.response.signature,
          userHandle: keyAuthConfirm.response.userHandle,
        },
      },
      {
        challenge: challenge,
        origin: this.keyConfig.origin,
        factor: this.keyConfig.factor,
        publicKey: keyAuthenticator.publicKey,
        prevCounter: keyAuthenticator.counter,
        userHandle: keyAuthenticator.credential,
      },
    );

    console.log(assertionResult);
  }

  async createAuthChallenge(): Promise<KeyAuthChallenge> {
    const authOptions = await this.f2l.assertionOptions();
    return {
      ...authOptions,
      rawChallenge: encode(authOptions.rawChallenge),
      challenge: encode(authOptions.challenge),
      allowCredentials: [],
    };
  }

  async confirmRegisterChallenge(
    challenge: string,
    keyRegisterConfirm: KeyRegisterConfirm,
  ): Promise<KeyRegisterResult> {
    const attestationResult = await this.f2l.attestationResult(
      {
        id: decode(keyRegisterConfirm.id),
        rawId: decode(keyRegisterConfirm.rawId),
        response: {
          clientDataJSON: keyRegisterConfirm.response.clientDataJSON,
          attestationObject: keyRegisterConfirm.response.attestationObject,
        },
      },
      {
        challenge,
        rpId: this.rpId,
        factor: this.keyConfig.factor,
        origin: this.keyConfig.origin,
      },
    );
    const authnrData = attestationResult.authnrData;
    const credId = encode(authnrData.get("credId"));

    return {
      counter: Number.parseInt(authnrData.get("counter")),
      credentials: credId,
      publicKey: authnrData.get("credentialPublicKeyPem"),
    };
  }

  async createRegisterChallenge(userId: string, username: string): Promise<KeyRegisterChallenge> {
    const registrationOptions = await this.f2l.attestationOptions();
    const base64Username = Buffer.from(username).toString("base64");

    return {
      ...registrationOptions,
      user: {
        id: Buffer.from(userId).toString("base64"),
        name: base64Username,
        displayName: base64Username,
      },
      challenge: encode(registrationOptions.challenge),
    };
  }
}
