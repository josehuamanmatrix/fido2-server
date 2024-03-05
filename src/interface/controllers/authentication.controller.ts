import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "src/service/application/authentication.service";
import { CreateRegisterChallengeRequest } from "./resources/request/create-register-challenge.request";

import { RegisterResponse } from "./resources/response/register.response";
import { RegisterRequest } from "./resources/request/register.request";

import { CreateAuthChallengeRequest } from "./resources/request/create-auth-challenge.request";
import { ConfirmRegisterChallengeRequest } from "./resources/request/confirm-register-challenge.request";

@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("register")
  createUser(@Body() registerRequest: RegisterRequest) {
    const userId = this.authenticationService.register({
      username: registerRequest.username,
    });

    return new RegisterResponse(userId);
  }

  @Post("create-register-challenge")
  async createRegisterChallenge(@Body() createRegisterChallengeRequest: CreateRegisterChallengeRequest) {
    const createRegisterChallenge = await this.authenticationService.createRegisterChallenge(
      createRegisterChallengeRequest.userId,
    );

    return createRegisterChallenge;
  }

  @Post("confirm-register-challenge")
  async confirmCreateChallenge(@Body() confirmRegisterChallengeRequest: ConfirmRegisterChallengeRequest) {
    const confirmRegisterChallenge = await this.authenticationService.confirmRegisterChallenge(
      confirmRegisterChallengeRequest.challengeToken,
      {
        id: confirmRegisterChallengeRequest.id,
        rawId: confirmRegisterChallengeRequest.rawId,
        response: confirmRegisterChallengeRequest.response,
      },
    );

    return confirmRegisterChallenge;
  }

  @Post("create-auth-challenge")
  async createAuthChallenge(@Body() createAuthChallengeRequest: CreateAuthChallengeRequest) {
    const createAuthChallenge = await this.authenticationService.createAuthChallenge(createAuthChallengeRequest.userId);
    return createAuthChallenge;
  }

  @Post("confirm-auth-challenge")
  async confirmAuthChallenge(@Body() confirmAuthChallenge: ConfirmAuthChallenge) {
    await this.authenticationService.confirmAuthChallenge(confirmAuthChallenge.challengeToken, {
      id: confirmAuthChallenge.id,
      rawId: confirmAuthChallenge.rawId,
      response: confirmAuthChallenge.response,
    });
  }
}

type ConfirmAuthChallenge = {
  id: string;
  rawId: string;
  challengeToken: string;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle?: string;
  };
};
