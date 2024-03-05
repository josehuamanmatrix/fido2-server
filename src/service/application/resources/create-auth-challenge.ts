export type CreateAuthChallenge = {
  challengeToken: string;
  timeout?: number;
  rpId?: string;
  attestation?: string;
  userVerification?: string;
  rawChallenge?: string;
  extensions?: any;
  allowCredentials?: Array<{ type: string; id: string; transports?: string[] }>;
};
