export class ConfirmRegisterChallengeRequest {
  id: string;
  rawId: string;
  challengeToken: string;
  response: {
    clientDataJSON: string;
    attestationObject: string;
  };
}
