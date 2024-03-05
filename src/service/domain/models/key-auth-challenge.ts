export type KeyAuthChallenge = {
  challenge: string;
  timeout?: number;
  rpId?: string;
  attestation?: string;
  userVerification?: string;
  rawChallenge?: string;
  extensions?: any;
  allowCredentials?: Array<{ type: "public-key"; id: string; transports?: string[] }>;
};
