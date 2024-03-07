export class ConfirmAuthChallenge {
  id: string;
  rawId: string;
  challengeToken: string;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle?: string;
  };
}
