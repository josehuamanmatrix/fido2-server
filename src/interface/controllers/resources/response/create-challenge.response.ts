export class CreateChallengeResponse {
  constructor(
    public readonly challenge: string,
    public readonly user: {
      id: string;
      name: string;
      displayName: string;
    },
    public readonly pubKeyCredParams: PublicKeyCredentialParameters[],
    public readonly rp: PublicKeyCredentialRpEntity,
    public readonly excludeCredentials?: PublicKeyCredentialDescriptor[],
    public readonly extensions?: AuthenticationExtensionsClientInputs,
    public readonly timeout?: number,
    public readonly attestation?: AttestationConveyancePreference,
    public readonly authenticatorSelection?: AuthenticatorSelectionCriteria,
  ) {}
}
